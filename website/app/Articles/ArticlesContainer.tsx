import { MoonIcon } from '@chakra-ui/icons'
import { Button, Center, Container, CSSObject, Spacer, useColorMode } from '@chakra-ui/react'
import Head from 'next/head'
import Link from 'next/link'
import { FunctionComponent } from 'react'

const links = {
  landing: '/',
  articles: '/articles',
}

const articlesStyles: CSSObject = {
  '& ul': {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  '& li': {
    // border: 'solid 1px red',
    display: 'flex',
    alignItems: 'center',
    listStyleType: 'none',
    padding: 4,
    marginTop: 4,
    ':first-of-type': {
      paddingLeft: 0,
    },
    '& a': {
      display: 'inline-block',
      color: 'textAlpha800',
    },
  },
  '& li.active': {
    fontWeight: 'bold',
    '& a': {
      borderBottom: 'solid 2px var(--chakra-colors-orange-500)',
    },
  },
}

/** Common container for Articles List and Articles Detail */
export function ArticlesContainer({ Content }: { Content: FunctionComponent }) {
  const { toggleColorMode } = useColorMode()

  return (
    <>
      <Center>
        <Container sx={articlesStyles} maxW="3xl">
          <nav>
            <ul>
              <li className="active">
                <Link href={links.articles}>
                  <a>Artigos</a>
                </Link>
              </li>
              <li>
                <Link href={links.landing}>
                  <a>Início</a>
                </Link>
              </li>
              <Spacer />
              <li className="left">
                <Button onClick={toggleColorMode}>
                  <MoonIcon />
                </Button>
              </li>
            </ul>
          </nav>
        </Container>
      </Center>
      <Center as="main" sx={{ mt: 8 }}>
        <Container maxW="3xl" position="relative">
          <Content />
        </Container>
      </Center>
    </>
  )
}
