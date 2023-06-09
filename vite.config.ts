import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const buildApp = true;

// https://vitejs.dev/config/
export default defineConfig(
  buildApp ? {
    base: "",
    plugins: [vue()],
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    build: {
      outDir: "dist/lib",
      assetsDir: "assets", //指定静态资源存放路径
      sourcemap: false, //是否构建source map 文件
      minify: "terser", // 混淆器，terser 构建后文件体积更小，'terser' | 'esbuild'
      chunkSizeWarningLimit: 1500, //chunk 大小警告的限制，默认500KB
      rollupOptions: {
        output: {
          // 最小化拆分包
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          },
          chunkFileNames: 'js/[name].[hash].js', // 用于命名代码拆分时创建的共享块的输出命名，[name]表示文件名,[hash]表示该文件内容hash值
        }
      },
      terserOptions: {
        // 生产环境移除console
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
        output: {
          comments: true, // 去掉注释内容
        },
      },
    },
  } : {
    // https://github.com/vitejs/vite/issues/330#issuecomment-757191364
    plugins: [vue()],
    build: {
      outDir: "dist/lib",
      sourcemap: false,
      minify: "terser",
      lib: {
        // Could also be a dictionary or array of multiple entry points
        entry: resolve(__dirname, 'src/components/index.ts'),
        name: 'richform-plus',
        // the proper extensions will be added
        fileName: 'richform',
      },
      rollupOptions: {
        // make sure to externalize deps that shouldn't be bundled
        // into your library
        external: ['vue'],
        output: {
          // Provide global variables to use in the UMD build
          // for externalized deps
          globals: {
            vue: 'Vue',
          },
        },
      }
    },
  })
