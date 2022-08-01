const crypto = require('crypto')

const customBuildId = crypto.randomBytes(20).toString('hex')
/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  serverRuntimeConfig: {
    customBuildId,
  },
}
