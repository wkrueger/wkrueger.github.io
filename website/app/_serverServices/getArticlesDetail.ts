import { serialize } from 'next-mdx-remote/serialize'
import remarkGfm from 'remark-gfm'
import syntaxHighlight from '@mapbox/rehype-prism'
import fs from 'fs/promises'
import glob from 'tiny-glob'
import { parse, sep } from 'path'

export async function getArticlesDetail({ slug }: { slug: string }) {
  const attemptFiles = await glob(`../md/${slug}/*.md`)
  if (!attemptFiles.length) throw Error('não achou nada.')
  const contentRaw = await fs.readFile(attemptFiles[0], 'utf8')
  const mdxSource = await serialize(contentRaw, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [syntaxHighlight],
    },
  })
  const folder = parse(attemptFiles[0]).dir.split(sep).join('/')
  const filenamePattern = /^(\d{4})-(\d{2})-(.*)/g
  const resp = filenamePattern.exec(slug)!
  const [_, year, month] = resp
  return {
    year,
    month,
    folder,
    slug,
    mdxSource,
  }
}

export type ArticlesDetail = Awaited<ReturnType<typeof getArticlesDetail>>
