/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  serverRuntimeConfig: {
    supabaseUrl: 'https://mcifmirdfzzkrdpjgego.supabase.co',
    supabaseKey: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jaWZtaXJkZnp6a3JkcGpnZWdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzk2NTg2MzUsImV4cCI6MTk5NTIzNDYzNX0.P0Sr9a_cfBfBtpziz0fc-qsT7hJ6a2CdeWkwOi8pRPg`
  }
}

module.exports = nextConfig
