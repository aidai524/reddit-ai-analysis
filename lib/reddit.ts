import Snoowrap from 'snoowrap';

let reddit: Snoowrap | undefined;

// 只在服务器端初始化 Snoowrap
if (typeof window === 'undefined') {
  reddit = new Snoowrap({
    userAgent: process.env.REDDIT_USER_AGENT || 'MyRedditApp/1.0',
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD,
  });
}

export default reddit;