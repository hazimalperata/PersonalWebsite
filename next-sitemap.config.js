/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.WEBSITE_URL,
  generateRobotsTxt: true, // (optional)
  exclude: ["/login", "/picker"],
  // ...other options
};
