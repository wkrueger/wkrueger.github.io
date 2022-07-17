import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { ArticlesDetail } from '../../app/Articles/ArticlesDetail'
import { SITE_TITLE } from '../../app/globals'
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
  return (
    <div>
      <Head>
        <title>
          {props.articlesDetail.title} : {SITE_TITLE}
        </title>
      </Head>
      <ArticlesDetail {...props} />
    </div>
  )
}
