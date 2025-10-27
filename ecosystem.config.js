module.exports = {
  apps: [
    {
      name: 'promohive',
      script: 'dist/index.js',
      instances: 1,
      exec_mode: 'cluster',
      cwd: '/var/www/promohive',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 3000,
        HOST: process.env.HOST || 'srv1052990.hstgr.cloud',
        DATABASE_URL: process.env.DATABASE_URL,
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
        JWT_SECRET: process.env.JWT_SECRET,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
        ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
        REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
        CORS_ORIGIN: process.env.CORS_ORIGIN,
        PLATFORM_URL: process.env.PLATFORM_URL,
        RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS,
        RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS,
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_PORT: process.env.SMTP_PORT,
        SMTP_SECURE: process.env.SMTP_SECURE,
        SMTP_USER: process.env.SMTP_USER,
        SMTP_PASS: process.env.SMTP_PASS,
        SMTP_FROM: process.env.SMTP_FROM,
        ADGEM_JWT_SECRET: process.env.ADGEM_JWT_SECRET || 'your-adgem-jwt-secret',
        ADSTERRA_API_KEY: process.env.ADSTERRA_API_KEY || 'your-adsterra-api-key',
        CPALEAD_API_KEY: process.env.CPALEAD_API_KEY || 'your-cpalead-api-key',
        LOG_LEVEL: process.env.LOG_LEVEL || 'info',
        BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS || '12'
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};
