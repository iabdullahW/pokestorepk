/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://pokemonstorepk.vercel.app/', // Change to your production URL
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: ['/admin/*', '/test-upload/*'], // Add any paths you want to exclude
}