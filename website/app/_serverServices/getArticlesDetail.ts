export async function getArticlesDetail({ slug }: { slug: string }) {
  const fs = await import('fs/promises')
  const glob = (await import('tiny-glob')).default
  const attemptFiles = await glob(`../md/${slug}/*.md`)
  if (!attemptFiles.length) throw Error('não achou nada.')
  const content = await fs.readFile(attemptFiles[0], 'utf8')
  return {
    slug,
    content,
  }
}

export type ArticlesDetail = Awaited<ReturnType<typeof getArticlesDetail>>
