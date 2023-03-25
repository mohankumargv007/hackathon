/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  serverRuntimeConfig: {
    supabaseUrl: 'https://jsynratnyrjtlpmivmtj.supabase.co',
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzeW5yYXRueXJqdGxwbWl2bXRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzk1OTA1NzMsImV4cCI6MTk5NTE2NjU3M30.QcnzeHd0j0T2EZnpxuA_IVrBsx0xmOInf_Tk6rveAx0'
  }
}

module.exports = nextConfig
