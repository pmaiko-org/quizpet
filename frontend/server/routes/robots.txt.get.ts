export default defineEventHandler((event) => {
  setHeader(event, "content-type", "text/plain; charset=utf-8");

  if (process.env.NODE_ENV === "production") {
    return `User-agent: *\nAllow: /\nSitemap: ${getRequestURL(event).origin}/sitemap.xml\n`;
  }

  return "User-agent: *\nDisallow: /\n";
});
