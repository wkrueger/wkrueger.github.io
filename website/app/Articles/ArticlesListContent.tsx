import { Box, VisuallyHidden } from '@chakra-ui/react'
import Link from 'next/link'
import { useContext } from 'react'
import { Article } from '../_serverServices/getArticlesIndex'
import { articlesListContext } from './ArticlesList'

interface Args {
  articles: Article[]
}

export function ArticlesListContent() {
  const { articles } = useContext(articlesListContext)
  return (
    <Box
      sx={{
        '& li': {
          listStyleType: 'none',
          marginBottom: 6,
          '.title': {
            fontSize: 'xl',
          },
          '.date': {
            color: 'textAlpha600',
          },
        },
        '.itemblock': {
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <VisuallyHidden>
        <h1>Lista de artigos</h1>
      </VisuallyHidden>
      <ul>
        {articles.map(article => {
          return (
            <li key={article.path}>
              <Link href={'/articles/' + article.path}>
                <a>
                  <div className="itemblock">
                    <span className="date">
                      {article.month} / {article.year}
                    </span>
                    <h2 className="title">{article.title}</h2>
                  </div>
                </a>
              </Link>
            </li>
          )
        })}
      </ul>
    </Box>
  )
}
