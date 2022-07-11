import '../styles/globals.scss'
import '@fontsource/libre-caslon-text/400.css'
import '@fontsource/libre-caslon-text/700.css'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '../app/theme'
import Head from 'next/head'

function MyApp({ Component, pageProps }: any) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  )
}
export default MyApp
