// const theme = extendTheme({
//   fonts: {
//     heading: "Libre Caslon Text, serif",
//   },
//   styles: {
//     global: {
//       body: {
//         // background: "#fcf3d9",
//         // backgroundImage: "Brick-2400.jpg",
//       },
//       "a.iconlink span": {
//         textDecoration: "underline",
//         textDecorationStyle: "dotted",
//         textDecorationColor: "#d8929c",
//       },
//       "a.iconlink span:hover": {
//         textDecorationStyle: "solid",
//         // textDecorationColor: "black",
//       },
//     },
//   },
// })

import { extendTheme, ThemeConfig } from '@chakra-ui/react'

export const theme = extendTheme({
  config: {
    useSystemColorMode: true,
    initialColorMode: 'dark',
  } as ThemeConfig,
  semanticTokens: {
    colors: {
      textAlpha600: {
        _dark: 'var(--chakra-colors-whiteAlpha-600)',
        _light: 'var(--chakra-colors-blackAlpha-600)',
      },
      textAlpha800: {
        _dark: 'var(--chakra-colors-whiteAlpha-800)',
        _light: 'var(--chakra-colors-blackAlpha-800)',
      },
    },
  },
  // styles: {
  //   global: {
  //     'a:hover': {
  //       color: 'var(--chakra-colors-orange-200)',
  //     },
  //   },
  // },
})
