import mariadb, {PoolConnection, QueryOptions} from 'mariadb';
import {snakeCase} from 'snake-case';
import {intersection} from 'lodash';

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

export async function getTransactional<R>(deviceId: string, fn: (update: typeof query) => Promise<R>): Promise<R> {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  let result;
  try {
    await doQuery(conn, 'SET @__currentDeviceId = ?', [deviceId]);
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

export function buildPartialUpdateSql<O extends { [x: string]: any }>(partial: O, whiteList: Array<keyof O>) {
  return intersection<string>(Object.keys(partial), whiteList as string[])
    .map((key) => `${snakeCase(key)} = :${key}`)
    .join(', ');
}
