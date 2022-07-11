import { GetStaticProps } from 'next'
import { ArticlesList } from '../../app/Articles/ArticlesList'
import { getArticlesIndex } from '../../app/_serverServices/getArticlesIndex'

export const getStaticProps: GetStaticProps = async () => {
  const articlesIndex = await getArticlesIndex()
  return {
    props: {
      articlesIndex,
    },
  }
}

export default function Main(props: any) {
  return <ArticlesList articles={props.articlesIndex} />
}
