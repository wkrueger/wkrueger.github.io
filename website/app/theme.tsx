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
      // preBg: {
      //   _dark: 'rgba(255, 255, 255, 0.05)',
      //   _light: 'rgba(0,0,0, 0.05)',
      // },
      preBg: '#262b37', // 5% white over dark mode bg
      quoteBg: {
        _dark: 'rgba(255, 255, 255, 0.05)',
        _light: 'rgba(0,0,0, 0.05)',
      },
      headingAccent: {
        _dark: 'orange.100',
        _light: 'orange.900',
      },
      anchorAccent: {
        _dark: 'orange.100',
        _light: 'orange.900',
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
