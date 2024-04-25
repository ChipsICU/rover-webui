import { defineConfig } from 'vite';
import { copy } from 'vite-plugin-copy';

export default defineConfig({
  root: '.',  
  plugins: [
    copy({
      targets: [
        { src: 'users', dest: 'dist/users' }
      ]
    })
  ],
  build: {
    outDir: 'dist',  
    rollupOptions: {
      input: {
        // index: 'index.html',  
        dashboard: 'dashboard.html'
      }
    }
  }
});
