import { createContext } from 'react'
import { ArticlesDetail } from '../_serverServices/getArticlesDetail'
import { ArticlesContainer } from './ArticlesContainer'
import ArticlesDetailContent from './ArticlesDetailContent'

interface ArticlesDetailProps {
  articlesDetail: ArticlesDetail
}

export const articlesDetailContext = createContext(null as any as ArticlesDetailProps)

export function ArticlesDetail(props: ArticlesDetailProps) {
  return (
    <articlesDetailContext.Provider value={props}>
      <ArticlesContainer Content={ArticlesDetailContent} />
    </articlesDetailContext.Provider>
  )
}
