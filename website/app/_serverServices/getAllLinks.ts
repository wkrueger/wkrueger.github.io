import { getArticlesDetail } from './getArticlesDetail'
import { getArticlesIndex } from './getArticlesIndex'
import groupBy from 'lodash/groupBy'
import indexBy from 'lodash/keyBy'
import { resolve, tryCache } from './workerClient'
import uniqBy from 'lodash/uniqBy'

export async function getAllLinks() {
  const tryResult = await tryCache(['_getAllLinks'], true)
  if (tryResult) return tryResult as never
  const index = await getArticlesIndex({ tryCache: true })
  const indexIdx = indexBy(index, 'path')
  const articleDetails = await Promise.all(
    index.map(articleIndex => {
      return getArticlesDetail({ slug: articleIndex.path, tryCache: true })
    })
  )
  const linksByTarget = groupBy(
    articleDetails.flatMap(item => {
      return uniqBy(
        item.wikiLinks
          .map(link => ({ ...link, source: indexIdx[item.slug] }))
          .filter(x => x.source),
        x => x.source.path
      )
    }),
    'actualLink'
  )
  await resolve(['_getAllLinks'], linksByTarget)
  return linksByTarget
}
