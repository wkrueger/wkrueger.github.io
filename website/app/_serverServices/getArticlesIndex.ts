import groupBy from 'lodash/groupBy'
import { resolve, tryCache as tryCacheFn } from './workerClient'

export async function getArticlesIndex({ tryCache }: { tryCache?: boolean } = {}): Promise<
  Article[]
> {
  const getTitles = true
  // const cache = new AsyncCache(global, ['_articlesIndex'], Boolean(tryCache))
  const tryResult = await tryCacheFn(['_articlesIndex'], tryCache)
  if (tryResult) return tryResult as never
  const path = await import('path')
  const glob = (await import('tiny-glob')).default
  const fs = await import('fs')
  const files = await glob('../md/*/*.md')
  const filesByFolder = groupBy(files, item => {
    const split = item.split(path.sep)
    return split[2]
  })

  const filenamePattern = /^(\d{4})-(\d{2})-(.*)/g
  const titlePattern = /^\# (.*)$/gm

  let dirs = await glob('../md/*')
  dirs = dirs
    .map(dir => {
      const parsed = path.parse(dir)
      return parsed.base
    })
    .filter(dir => {
      const rgx = new RegExp(filenamePattern)
      return rgx.test(dir)
    })
  dirs.sort((a, b) => {
    if (a > b) return -1
    if (a < b) return 1
    return 0
  })

  const result = await Promise.all(
    dirs.map(async item => {
      const rgx = new RegExp(filenamePattern)
      const resp = rgx.exec(item)!
      const [_, year, month] = resp
      const file = filesByFolder[item][0]
      let data = ''
      if (getTitles) {
        const stream = fs.createReadStream(file, { encoding: 'utf8', start: 0, end: 200 })
        const titleRgx = new RegExp(titlePattern, 'gm')
        await new Promise<void>(res => {
          stream.on('readable', () => {
            let chunk = stream.read()
            const foundTitle = (titleRgx.exec(chunk) || [''])[1]
            data = foundTitle
            stream.close()
            res()
          })
        })
      }

      return {
        year,
        month,
        datestr: year + month,
        path: item,
        title: data || item,
      }
    })
  )
  await resolve(['_articlesIndex'], result)
  return result
}

export interface Article {
  year: string
  month: string
  datestr: string
  path: string
  title: string
}
