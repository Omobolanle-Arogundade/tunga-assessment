module.exports = {
 apps: [
  {
   name: 'app',
   script: 'dist/index.js',
   instances: 1,
   autorestart: true,
   watch: false,
   time: true,
   //    env: {
   //     NODE_ENV: 'development',
   //    },
  },
 ],
};
