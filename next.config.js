/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 本番ビルド最適化
  swcMinify: true,

  // サーバー専用パッケージをバンドル対象から除外
  serverExternalPackages: ["@prisma/client", "prisma"],

  experimental: {
    serverActions: false
  },

  // 本番でconsole.logを削除（errorは残す）
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error"] }
        : false
  },

  // セキュリティヘッダ（軽量版）
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY"
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin"
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
