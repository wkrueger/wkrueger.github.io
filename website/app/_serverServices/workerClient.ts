import sqlite, { Database } from 'better-sqlite3'
import getConfig from 'next/config'

const { serverRuntimeConfig } = getConfig()

let _instance: Database

function connect() {
  const buildId = serverRuntimeConfig.customBuildId
  if (_instance) {
    return { db: _instance, buildId }
  }
  const db = new sqlite('.next/shared_build.db')
  const table = db
    .prepare(/* sql */ `SELECT name from sqlite_master WHERE type='table' and name=?;`)
    .get('store')
  if (!table) {
    db.exec(/* sql */ `
      CREATE TABLE IF NOT EXISTS store (
        k TEXT NOT NULL,
        build_id TEXT NOT NULL,
        is_pending INTEGER NOT NULL,
        v TEXT,
        PRIMARY KEY (build_id, k)
      )
    `)
  }
  if (!buildId) throw Error('Unable to determine build id.')
  db.prepare(/* sql */ `DELETE FROM store WHERE build_id <> ?;`).run(buildId)
  _instance = db
  // console.log('db init success', buildId)
  return { db: _instance, buildId: buildId }
}

export async function tryCache(key: string[], doCache: boolean | undefined) {
  const { db, buildId } = connect()
  const index = key.join('::')
  const query = db.prepare(/* sql */ `SELECT * FROM store WHERE build_id = ? AND k = ?`)
  let found = query.get(buildId, index)
  if (process.env.NODE_ENV === 'production' || doCache) {
    if (!found) {
      db.prepare(/* sql */ `INSERT INTO store(build_id, k, is_pending) VALUES (?, ?, ?);`).run(
        buildId,
        index,
        1
      )
      // console.log('cache not found', key)
      return null
    }
    let waitCount = 0
    while (!found || found?.is_pending) {
      waitCount++
      if (!found) throw Error('Unexpected')
      if (waitCount > 10) throw Error(`Store key timeout ${index}`)
      await new Promise(resolve => setTimeout(resolve, 100))
      found = query.get(buildId, index)
    }
    // console.log('cache found', key, 'after', waitCount, 'polls')
    return JSON.parse(found.v)
  } else {
    if (!found) {
      db.prepare(/* sql */ `INSERT INTO store(build_id, k, is_pending) VALUES (?, ?, ?);`).run(
        buildId,
        index,
        1
      )
    }
    // console.log('skip cache', key)
    return null
  }
}

const dependencies = {
  _getArticlesDetail: '_getAllLinks',
}

export async function resolve(key: string[], data: any) {
  const { db, buildId } = connect()

  const dependant = dependencies[key[0]]
  if (dependant) {
    db.prepare(/* sql */ `DELETE from store WHERE build_id = ? and k = ?;`).run(buildId, dependant)
  }

  const index = key.join('::')
  const query = db.prepare(/* sql */ `SELECT * FROM store WHERE build_id = ? AND k = ?;`)
  let found = query.get(buildId, index)
  if (found) {
    // console.log('update', key)
    db.prepare(/* sql */ `UPDATE store SET is_pending=?, v=? WHERE build_id=? AND k=?;`).run(
      0,
      JSON.stringify(data),
      buildId,
      index
    )
  } else {
    // console.log('create', key)
    db.prepare(/* sql */ `INSERT INTO store(build_id, k, is_pending, v) VALUES (?, ?, ?, ?);`).run(
      buildId,
      index,
      0,
      JSON.stringify(data)
    )
  }
}
