import { GetStaticPaths, GetStaticProps } from "next"

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params || {}
  const fs = await import("fs/promises")
  const glob = (await import("tiny-glob")).default
  try {
    await fs.stat(`../md/${slug}`)
    const [file] = await glob(`../md/${slug}/*.md`)
    if (file) {
      const content = await fs.readFile(`../${slug}/${file}`, "utf-8")
      return {
        props: {
          slug,
          content,
        },
      }
    }
    return { notFound: true }
  } catch (err) {
    console.error(err)
    return {
      notFound: true,
    }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const fs = await import("fs/promises")
  const folders = await fs.readdir(`../md`)
  return {
    paths: folders.map((f) => ({ params: { slug: f } })),
    fallback: true,
  }
}

function Post({ slug, content }: { slug: string; content: string }) {
  return (
    <main>
      <h1>{slug}</h1>
      <pre>{content}</pre>
    </main>
  )
}

export default Post
