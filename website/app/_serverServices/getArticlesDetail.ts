import { serialize } from 'next-mdx-remote/serialize'
import remarkGfm from 'remark-gfm'
import syntaxHighlight from '@mapbox/rehype-prism'
import fs from 'fs/promises'
import glob from 'tiny-glob'
import { parse, sep } from 'path'
import { getArticlesIndex } from './getArticlesIndex'
import fuse from 'fuse.js'

export async function getArticlesDetail({ slug }: { slug: string }) {
  const attemptFiles = await glob(`../md/${slug}/*.md`)
  if (!attemptFiles.length) throw Error('não achou nada.')
  let content = await fs.readFile(attemptFiles[0], 'utf8')
  const titlePattern = /^\# (.*)$/m
  const foundTitle = (titlePattern.exec(content.slice(0, 200)) || [''])[1]
  const wikiLinks = await getWikilinks(content)
  content = replaceWikilinks(wikiLinks, content)
  const mdxSource = await serialize(content, {
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
    title: foundTitle,
  }
}

async function getWikilinks(text: string) {
  const matches: {
    start: number
    end: number
    display: string
    srclink: string
    actualLink: string
  }[] = []
  const rgx = /\[\[(.*?)\]\]/gm

  let result: RegExpExecArray | null

  while ((result = rgx.exec(text)) !== null) {
    const content = result[result.length - 1]
    let [link, display] = content.split('|').map(s => s.trim())
    const actualLink = link.startsWith('http') ? link : await findSlug(link)
    matches.push({
      start: result.index,
      end: rgx.lastIndex,
      display: display || link,
      srclink: link,
      actualLink,
    })
  }
  return matches
}

let _fuseInst: fuse<{ text; path }>

async function getSearchTargets() {
  if (_fuseInst) return _fuseInst
  const all = await getArticlesIndex()
  const searchTargets = all.map(item => {
    return { text: item.title, path: item.path }
  })
  _fuseInst = new fuse(searchTargets, {
    includeScore: true,
    keys: ['text'],
    threshold: 0.02,
  })
  return _fuseInst
}

async function findSlug(title: string): Promise<string> {
  const fuseInst = await getSearchTargets()
  const results = fuseInst.search(title)
  return results[0]?.item.path || encodeURIComponent(title)
}

function replaceWikilinks(linksInfo: Awaited<ReturnType<typeof getWikilinks>>, source: string) {
  let out = ''
  let prev = 0
  for (const slice of linksInfo) {
    out += source.slice(prev, slice.start) + `[${slice.display}](${slice.actualLink})`
    prev = slice.end
  }
  out += source.slice(prev)
  return out
}

export type ArticlesDetailData = Awaited<ReturnType<typeof getArticlesDetail>>
