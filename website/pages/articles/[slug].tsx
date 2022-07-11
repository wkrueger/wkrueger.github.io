import { GetStaticPaths, GetStaticProps } from 'next'
import { ArticlesDetail } from '../../app/Articles/ArticlesDetail'
import { getArticlesDetail } from '../../app/_serverServices/getArticlesDetail'
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

export default function Main(props: any) {
  return <ArticlesDetail {...props} />
}
