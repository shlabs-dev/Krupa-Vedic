/** @type {import('next').NextConfig} */
const nextConfig = {
  // Docker builds set STANDALONE=1 (small image). Normal hosts (GoDaddy) use "npm start".
  ...(process.env.STANDALONE === "1" ? { output: "standalone" } : {}),
};
module.exports = nextConfig;
