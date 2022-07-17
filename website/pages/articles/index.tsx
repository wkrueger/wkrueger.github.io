import { GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ArticlesList } from '../../app/Articles/ArticlesList'
import { CANONICAL_BASE_URL } from '../../app/globals'
import { getArticlesIndex } from '../../app/_serverServices/getArticlesIndex'

export const getStaticProps: GetStaticProps = async ctx => {
  const articlesIndex = await getArticlesIndex()
  return {
    props: {
      articlesIndex,
    },
  }
}

export default function Main(props: any) {
  const title = 'Artigos'
  const router = useRouter()
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="org:url" content={CANONICAL_BASE_URL + router.asPath} />
      </Head>
      <ArticlesList articles={props.articlesIndex} />
    </>
  )
}
