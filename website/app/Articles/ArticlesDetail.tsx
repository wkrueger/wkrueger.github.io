import { createContext } from 'react'
import { ArticlesDetailData } from '../_serverServices/getArticlesDetail'
import { ArticlesContainer } from './ArticlesContainer'
import ArticlesDetailContent from './ArticlesDetailContent'

interface ArticlesDetailProps {
  articlesDetail: ArticlesDetailData
}

export const articlesDetailContext = createContext(null as any as ArticlesDetailProps)

export function ArticlesDetail(props: ArticlesDetailProps) {
  return (
    <articlesDetailContext.Provider value={props}>
      <ArticlesContainer Content={ArticlesDetailContent} />
    </articlesDetailContext.Provider>
  )
}
