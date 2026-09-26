/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      // Kanonik domain: www. Search Console'da www adresi kullanılmalı.
      {
        source: "/:path*",
        has: [{ type: "host", value: "nakliyatdiyari.com" }],
        destination: "https://www.nakliyatdiyari.com/:path*",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
