/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    REDDIT_USER_AGENT: process.env.REDDIT_USER_AGENT,
    REDDIT_CLIENT_ID: process.env.REDDIT_CLIENT_ID,
    REDDIT_CLIENT_SECRET: process.env.REDDIT_CLIENT_SECRET,
    REDDIT_USERNAME: process.env.REDDIT_USERNAME,
    REDDIT_PASSWORD: process.env.REDDIT_PASSWORD,
  },
}

module.exports = nextConfig