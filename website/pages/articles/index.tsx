import { GetStaticProps } from 'next'
import Head from 'next/head'
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
  return (
    <>
      <Head>
        <title>Artigos : Willian Krueger</title>
      </Head>
      <ArticlesList articles={props.articlesIndex} />
    </>
  )
}
