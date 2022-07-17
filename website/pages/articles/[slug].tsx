import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ArticlesDetail } from '../../app/Articles/ArticlesDetail'
import { CANONICAL_BASE_URL } from '../../app/globals'
import { ArticlesDetailData, getArticlesDetail } from '../../app/_serverServices/getArticlesDetail'
import { getArticlesIndex } from '../../app/_serverServices/getArticlesIndex'

export const getStaticProps: GetStaticProps = async ctx => {
  const slug = ctx.params?.slug as string
  const articlesDetail = await getArticlesDetail({ slug })
  return {
    props: { articlesDetail },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const index = await getArticlesIndex()
  const paths = index.map(item => ({ params: { slug: item.path } }))
  return {
    paths,
    fallback: false,
  }
}

export default function Main(props: { articlesDetail: ArticlesDetailData }) {
  const title = props.articlesDetail.title
  const router = useRouter()
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="org:url" content={CANONICAL_BASE_URL + router.asPath} />
      </Head>
      <ArticlesDetail {...props} />
    </div>
  )
}
