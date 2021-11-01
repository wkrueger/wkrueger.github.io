import { Box, Container, Flex, Heading, List, ListItem } from "@chakra-ui/react"
import React, { CSSProperties } from "react"
import Link from "next/link"
import { css } from "@emotion/react"
import Head from "next/head"

const headingBlock = {
  h2: {
    margin: "6px",
  },
}

const tipsList = css`
  display: flex;
  margin-top: 1rem;
  > * {
    display: flex;
    align-items: center;
    padding-left: 1rem;
    padding-right: 1rem;
    border-right: solid 1px gray;
    &:last-child {
      border-right: none;
    }
  }
  a {
    display: flex;
  }
  .nextimg {
    width: 18px;
  }
`

export function IndexPage() {
  return (
    <Box
      height="100vh"
      css={{
        backgroundImage: "url('Brick-2400.jpg')",
      }}
    >
      <Head>
        <title>Willian Krueger - Pedreiro de Software</title>
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
            Pedreiro de Software
          </Heading>
          <Heading size="md" fontWeight="light">
            Sua obra em boas mãos.
          </Heading>

          <List css={tipsList}>
            <ListItem>
              <Link href="/posts">
                <a className="iconlink">
                  📓&nbsp;<span>Artigos</span>
                </a>
              </Link>
            </ListItem>
            <ListItem>
              <a
                href="https://github.com/wkrueger"
                target="_blank"
                rel="noreferrer"
                className="iconlink"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="./github.svg" alt="github" className="nextimg" />
                &nbsp;
                <span>GitHub</span>
              </a>
            </ListItem>
            <ListItem>
              <a
                href="https://www.linkedin.com/in/willian-krueger-74a55815/"
                target="_blank"
                rel="noreferrer"
                className="iconlink"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="./linkedin.svg" alt="linkedin" className="nextimg" />
                &nbsp;
                <span>Currículo</span>
              </a>
            </ListItem>
          </List>
        </Flex>
        {/* <NextImage src={bannerImg} width="100%" /> */}
      </Container>
    </Box>
  )
}
