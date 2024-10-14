import Snoowrap from 'snoowrap';

const reddit: Snoowrap = new Snoowrap({
  userAgent: process.env.REDDIT_USER_AGENT || 'MyRedditApp/1.0',
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD,
});

export default reddit;
