import { createContext, DetailedHTMLProps, ImgHTMLAttributes, useContext } from 'react'
import { articlesDetailContext } from './ArticlesDetail'
import { MDXRemote } from 'next-mdx-remote'
import { chakra, CSSObject } from '@chakra-ui/react'

function ImageComponent(
  props: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
) {
  const ctx = useContext(childComponentContext)
  const filename = props.src!
  const filenameDecoded = decodeURI(filename)

  // fonte já é remota, não mexer em nada.
  if (filename.startsWith('http')) {
    // eslint-disable-next-line
    return <img {...props} />
  }

  // copia imagens para a pasta public no primeiro render.
  if (typeof window === 'undefined') {
    const srcOnMdPath = ctx.srcPath + '/' + filenameDecoded
    console.log('collect image', srcOnMdPath)
    const fs: typeof import('fs') = require('fs')
    const path: typeof import('path') = require('path')
    const expectFile = path.join('.', 'public', 'images', ctx.slug, filenameDecoded)
    try {
      fs.statSync(expectFile)
      console.log('image', srcOnMdPath, 'already found')
    } catch (err) {
      try {
        const { sync } = require('mkdirp')
        sync(path.join('.', 'public', 'images', ctx.slug))
        console.log('copy', srcOnMdPath, expectFile)
        // fs.symlinkSync(srcOnMdPath, path.resolve(expectFile))
        fs.linkSync(srcOnMdPath, expectFile)
      } catch (err2) {
        console.error('failed copying', err2)
      }
    }
  }
  console.log('img props', props)
  console.log('img src', '/images/' + ctx.slug + '/' + filename)
  // eslint-disable-next-line
  return <img {...props} src={'/images/' + ctx.slug + '/' + filename} />
}

const childComponentContext = createContext({ srcPath: '', slug: '' })

const mdFormat: CSSObject = {
  h1: {
    fontSize: '3xl',
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
    display: 'inline-block',
    borderBottom: 'solid 3px var(--chakra-colors-orange-500)',
    width: '100%',
    paddingBottom: 3,
    borderRadius: 4,
    '&:first-child': {
      marginTop: 0,
    },
  },
  h2: {
    fontWeight: 'bold',
    fontSize: '2xl',
    mt: 12,
    mb: 6,
  },
  h3: {
    fontSize: 'xl',
    mt: 8,
  },
  p: {
    my: 4,
  },
  pre: {
    my: 6,
    p: 6,
    mx: -6,
    backgroundColor: 'preBg',
    borderRadius: 4,
    color: 'white',
    minWidth: 'calc(100% + var(--chakra-space-12))',
    width: 'fit-content',
  },
  ul: {
    ml: '2rem',
  },
  li: {
    my: 3,
  },
  'p code, ul code': {
    backgroundColor: 'quoteBg',
  },
  blockquote: {
    borderLeft: 'solid 3px var(--chakra-colors-orange-200)',
    my: 6,
    px: 6,
    py: 2,
    mx: -6,
    backgroundColor: 'quoteBg',
    borderRadius: 4,
    // fix padding+margin collapsing
    '& > :first-of-type': {
      mt: 0,
    },
    '& > :last-of-type': {
      mb: 0,
    },
  },
}

export default function ArticlesDetailContent() {
  const { articlesDetail } = useContext(articlesDetailContext)
  return (
    <childComponentContext.Provider
      value={{
        srcPath: articlesDetail.folder,
        slug: articlesDetail.slug,
      }}
    >
      <chakra.div sx={{ position: 'absolute', color: 'textAlpha600', top: -6 }}>
        <span className="date">
          {articlesDetail.month} / {articlesDetail.year}
        </span>
      </chakra.div>
      <chakra.main className="mdcontent" id="mdcontent" sx={mdFormat}>
        <MDXRemote
          {...articlesDetail.mdxSource}
          components={{
            img: ImageComponent,
          }}
        />
      </chakra.main>
    </childComponentContext.Provider>
  )
}
