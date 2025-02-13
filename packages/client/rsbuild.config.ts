import {defineConfig} from '@rsbuild/core';
import {pluginReact} from '@rsbuild/plugin-react';
import {pluginSass} from '@rsbuild/plugin-sass';
import {pluginSvgr} from '@rsbuild/plugin-svgr';

export default defineConfig({
  dev: {
    client: {
      port: '',
    },
  },
  html: {
    template: './public/index.html',
  },
  output: {
    distPath: {
      root: './build',
    },
    sourceMap: {
      js: process.env.NODE_ENV === 'development' ? 'cheap-module-source-map' : 'source-map',
    },
  },
  plugins: [
    pluginSvgr({
      query: /tsx/,
      svgrOptions: {
        exportType: 'default',
        ref: true,
        svgo: false,
        titleProp: true,
      },
    }),
    pluginReact(),
    pluginSass(),
  ],
  server: {
    port: 3000,
    proxy: {
      '/ws': 'http://localhost',
    },
    strictPort: true,
  },
  source: {
    entry: {
      index: './src/index.tsx',
    },
  },
});
