import "../styles/globals.css"
import "@fontsource/libre-caslon-text/400.css"
import "@fontsource/libre-caslon-text/700.css"
import type { AppProps } from "next/app"
import { ChakraProvider, extendTheme } from "@chakra-ui/react"

const theme = extendTheme({
  fonts: {
    heading: "Libre Caslon Text, serif",
  },
  styles: {
    global: {
      body: {
        background: "#fcf3d9",
        backgroundImage: "Brick-2400.jpg",
      },
      "a.iconlink span": {
        textDecoration: "underline",
        textDecorationStyle: "dotted",
        textDecorationColor: "#d8929c",
      },
      "a.iconlink span:hover": {
        textDecorationStyle: "solid",
        // textDecorationColor: "black",
      },
    },
  },
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}
export default MyApp
