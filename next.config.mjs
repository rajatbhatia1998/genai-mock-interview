


import path from 'path'
const __dirname = new URL('.', import.meta.url).pathname;
const nextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './'),
    };

    return config;
  },
    env:{
            NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:"pk_test_c3dlZXQtdGFycG9uLTgyLmNsZXJrLmFjY291bnRzLmRldiQ",
            CLERK_SECRET_KEY:"sk_test_lnOeSGmAHJCMUL05NmQBiGMQ05jZYdi306oNC8CEQx",
            NEXT_PUBLIC_CLERK_SIGN_IN_URL:"/sign-in",
            NEXT_PUBLIC_CLERK_SIGN_UP_URL:"/sign-up",
            FIREBASE_API_KEY:"AIzaSyBFQKVSQilY4WYgSNzs-quwRqILYwKs29I",
            FIREBASE_AUTH_DOMAIN:"prepai-ai.firebaseapp.com",
            FIREBASE_PROJECT_ID:"prepai-ai",
            FIREBASE_STORAGE_BUCKET:"prepai-ai.firebasestorage.app",
            FIREBASE_MESSAGE_ID:"394539887187",
            FIREBASE_APPID:"1:394539887187:web:675bf08de5cc6bc56434a6"
    },
    async redirects(){
        return [
            {
              source: '/',
              destination: '/sign-in',
              permanent: true,
            },
          ]
    }
};

export default nextConfig;
