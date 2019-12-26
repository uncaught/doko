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

export async function getConnection<R>(): Promise<PoolConnection> {
  return pool.getConnection();
}

export async function query<R>(sql: string, values?: any[] | object): Promise<R[]> {
  let conn;
  try {
    conn = await pool.getConnection();
    const sqlOptions: QueryOptions = {
      namedPlaceholders: Boolean(values && !Array.isArray(values)),
      sql,
    };
    return conn.query(sqlOptions, values);
  } finally {
    if (conn) {
      conn.release();
    }
  }
}

export function buildPartialUpdateSql<O extends { [x: string]: any }>(partial: O, whiteList: Array<keyof O>) {
  return intersection<string>(Object.keys(partial), whiteList as string[])
    .map((key) => `${snakeCase(key)} = :${key}`)
    .join(', ');
}
