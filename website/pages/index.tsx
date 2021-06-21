import { Box, Container, Flex, Heading } from "@chakra-ui/react"
import Head from "next/head"
import React, { CSSProperties } from "react"

const headingBlock = {
  h2: {
    margin: "6px",
  },
}

const mainBox: CSSProperties = {
  backgroundImage: "hayden-mills-2_3JKm2BPNs-unsplash.jpg",
}

export default function Home() {
  return (
    <Box height="100vh" style={mainBox}>
      <Head>
        <title>Willian Krueger - Pedreiro digital</title>
      </Head>
      <Container
        maxW="container.lg"
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100%"
      >
        <Flex
          flexDir="column"
          alignItems="center"
          css={headingBlock}
          backgroundColor="#fcf3d9"
          padding="6"
          borderRadius="lg"
          boxShadow="5px 5px 0px rgb(0 0 0 / 45%)"
        >
          <Heading as="h1" margin="3">
            Willian Krueger 🧱
          </Heading>
          <Heading size="md" fontWeight="light" textTransform="uppercase">
            Pedreiro Digital
          </Heading>
          <Heading size="md" fontWeight="light">
            Sua obra em boas mãos.
          </Heading>
        </Flex>
        {/* <NextImage src={bannerImg} width="100%" /> */}
      </Container>
    </Box>
  )
}
