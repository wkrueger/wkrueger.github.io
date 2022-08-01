import { createContext } from 'react'
import { Article } from '../_serverServices/getArticlesIndex'
import { ArticlesContainer } from './ArticlesContainer'
import { ArticlesListContent } from './ArticlesListContent'

export const articlesListContext = createContext(null as any as ArticlesListProps)

interface ArticlesListProps {
  articles: Article[]
}

/** Page entry */
export function ArticlesList(props: ArticlesListProps) {
  if (!props.articles) return null
  return (
    <articlesListContext.Provider value={props}>
      <ArticlesContainer Content={ArticlesListContent} />
    </articlesListContext.Provider>
  )
}
