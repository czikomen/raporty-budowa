import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

let dbInstance: any = null;

export async function openDb() {
  if (!dbInstance) {
    dbInstance = await open({
      filename: path.join(process.cwd(), 'database.sqlite'),
      driver: sqlite3.Database
    });
  }
  return dbInstance;
}

export async function getUserByEmail(email: string) {
  const db = await openDb();
  return db.get('SELECT * FROM users WHERE email = ?', email);
}
