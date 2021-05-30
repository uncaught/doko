import mariadb, {PoolConnection, QueryOptions} from 'mariadb';
import {snakeCase} from 'snake-case';
import {difference, intersection} from 'lodash';
import dayjs from 'dayjs';
import {AnyObject, DeepPartial, mergeStates} from '@doko/common';
import {DatabaseTypes, DbConfig} from './DbTypes';

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT!,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
  connectionLimit: 5,
});

function doQuery<R>(conn: PoolConnection, sql: string, values?: any[] | object): Promise<R[]> {
  const sqlOptions: QueryOptions = {
    namedPlaceholders: Boolean(values && !Array.isArray(values)),
    sql,
  };
  return conn.query(sqlOptions, values);
}

export async function query<R>(sql: string, values?: any[] | object): Promise<R[]> {
  let conn;
  try {
    conn = await pool.getConnection();
    return doQuery(conn, sql, values);
  } finally {
    if (conn) {
      conn.release();
    }
  }
}

export async function getTransactional<R>(
  deviceId: string | null,
  fn: (update: typeof query) => Promise<R>,
): Promise<R> {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  let result;
  try {
    if (deviceId) {
      await doQuery(conn, 'SET @__currentDeviceId = ?', [deviceId]);
    }
    result = await fn(doQuery.bind(null, conn) as typeof query);
    await conn.commit();
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
  return result as unknown as R;
}

export async function deviceBoundQuery<R>(deviceId: string, sql: string, values?: any[] | object): Promise<R[]> {
  return getTransactional(deviceId, (update) => update(sql, values));
}

type Parameters<O extends AnyObject> = {
  [k in keyof O]?: string | number | null | object | undefined;
}

function prepareId<O extends AnyObject>(
  id: string | Partial<O>,
  parameters: Parameters<O>,
): string {
  const ids = typeof id === 'string' ? {id} : id;
  return Object.entries(ids).map(([key, val]) => {
    parameters[key as keyof O] = val;
    return `${snakeCase(key as string)} = :${key}`;
  }).join(' AND ');
}

export function fromDbValue<O extends AnyObject>(entities: O[], types: DatabaseTypes<O>): void {
  entities.forEach((entity) => {
    console.log('fromDbValue', {entity});
    Object.entries(entity).forEach(([key, value]) => {
      switch (types[key as keyof O]) {
        case 'bool':
          entity[key as keyof O] = (value === null ? null : entity[key] == '1') as O[keyof O];
          break;
        default:
        //nothing
      }
    });
  });
}

async function getToDbTransformer<O extends AnyObject>(
  upsertData: DeepPartial<O>,
  types: DatabaseTypes<O> = {},
  oldEntity?: O | null,
  merger = mergeStates,
) {
  return (key: keyof O): string | number | null | object | undefined => {
    const newValue = upsertData[key] as O[keyof O];
    if (newValue === null) {
      return null;
    }
    switch (types[key]) {
      case 'json':
        const oldValue = oldEntity ? oldEntity[snakeCase(key as string)] : null;
        if (oldValue === null) {
          return upsertData[key];
        }
        return merger(oldValue, newValue);
      case 'unix':
        return dayjs.unix(newValue).format('YYYY-MM-DD HH:mm:ss');
      case 'bool':
        return newValue ? 1 : 0;
      default:
        const type = typeof newValue;
        if (type !== 'string' && type !== 'number') {
          throw new Error(`Missing db transformer for type '${type}' (${newValue})`);
        }
        return newValue;
    }
  };
}

export async function insertEntity<O extends AnyObject>(
  update: typeof query,
  {table, types, insertFields}: DbConfig<O>,
  entity: O,
) {
  const keysToInsert = intersection<keyof O>(Object.keys(entity), insertFields);
  const parameters: Parameters<O> = {};
  if (keysToInsert.length) {
    const toDbValue = await getToDbTransformer<O>(entity, types);
    const columns: string[] = [];
    const values: Array<string | number | null> = [];
    keysToInsert.forEach((key: keyof O) => {
      columns.push(snakeCase(key as string));
      values.push(`:${key}`);
      parameters[key] = toDbValue(key);
    });
    await update(`INSERT INTO ${table} (${columns.join(', ')}) VALUES (${values.join(', ')})`, parameters);
  }
}

export async function insertSingleEntity<O extends AnyObject>(
  deviceId: string,
  dbConfig: DbConfig<O>,
  entity: O,
) {
  await getTransactional(deviceId, async (update) => {
    await insertEntity<O>(update, dbConfig, entity);
  });
}

export async function updateEntity<O extends AnyObject>(
  update: typeof query,
  {table, types, updateFields}: DbConfig<O>,
  id: string | Partial<O>,
  partial: DeepPartial<O>,
  merger = mergeStates,
) {
  const ids = typeof id === 'string' ? {id} : id;
  const keysToUpdate = difference<keyof O>(
    intersection<keyof O>(Object.keys(partial), updateFields),
    Object.keys(ids),
  );

  const parameters: Parameters<O> = {};
  const where = prepareId<O>(id, parameters);
  if (keysToUpdate.length) {
    const oldEntity = keysToUpdate.some((key) => types[key] === 'json')
      ? (await update<O>(`SELECT * FROM ${table} WHERE ${where}`, parameters))[0]
      : null;
    const toDbValue = await getToDbTransformer<O>(partial, types, oldEntity, merger);
    const updateKeys = keysToUpdate.map((key: keyof O) => {
      parameters[key] = toDbValue(key);
      return `${snakeCase(key as string)} = :${key}`;
    }).join(', ');
    await update(`UPDATE ${table} SET ${updateKeys} WHERE ${where}`, parameters);
  }
}

export async function updateSingleEntity<O extends AnyObject>(
  deviceId: string,
  dbConfig: DbConfig<O>,
  id: string | Partial<O>,
  partialEntity: DeepPartial<O>,
  merger = mergeStates,
) {
  await getTransactional(deviceId, async (update) => {
    await updateEntity<O>(update, dbConfig, id, partialEntity, merger);
  });
}
