import { createContext, DetailedHTMLProps, ImgHTMLAttributes, useContext } from 'react'
import { articlesDetailContext } from './ArticlesDetail'
import { MDXRemote } from 'next-mdx-remote'
import { chakra, CSSObject, List, ListIcon, ListItem } from '@chakra-ui/react'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import Link from 'next/link'

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
  // eslint-disable-next-line
  return <img {...props} src={'/images/' + ctx.slug + '/' + filename} />
}

const childComponentContext = createContext({ srcPath: '', slug: '' })

const mdFormat: CSSObject = {
  paddingBottom: '6rem',
  h1: {
    fontSize: '3xl',
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 2,
    display: 'inline-block',
    borderBottom: 'solid 3px var(--chakra-colors-orange-500)',
    width: '100%',
    paddingBottom: 3,
    borderRadius: 4,
    '&:first-of-type': {
      marginTop: 0,
    },
  },
  'h1 + h2': {
    mt: 4,
  },
  h2: {
    color: 'headingAccent',
    fontWeight: 'bold',
    fontSize: '2xl',
    mt: 10,
    mb: 4,
  },
  h3: {
    color: 'headingAccent',
    fontSize: 'xl',
    mt: 6,
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
  'ul, ol': {
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
  a: {
    color: 'anchorAccent',
    textDecoration: 'underline',
    textDecorationStyle: 'dotted',
  },
  img: {
    my: 10,
  },
}

const footerFormat: CSSObject = {
  ...mdFormat,
  h2: {
    ...(mdFormat.h2 as any),
    mt: 0,
    color: 'white',
  },
  borderWidth: '1px',
  borderRadius: 'lg',
  px: 6,
  mx: -6,
  py: 6,
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
      {Boolean(articlesDetail.backlinks.length) && (
        <chakra.footer sx={footerFormat}>
          <h2>Backlinks</h2>
          <List>
            {articlesDetail.backlinks.map(link => (
              <ListItem key={link.source.path}>
                <ListIcon as={ArrowForwardIcon} color="green.500" />
                <Link href={'/articles/' + link.source.path}>
                  <a>{link.source.title}</a>
                </Link>
              </ListItem>
            ))}
          </List>
        </chakra.footer>
      )}
    </childComponentContext.Provider>
  )
}
