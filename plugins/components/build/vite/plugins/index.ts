import type {PluginOption} from 'vite';
import vue from '@vitejs/plugin-vue';
import UnoCss from "unocss/vite";
import Pages from 'vite-plugin-pages';
// keepAlive 组件name
import vueSetupExtend from "vite-plugin-vue-setup-extend";
// gzip压缩
import viteCompression from "vite-plugin-compression";
import compression from "vite-plugin-compression";

import appInfo from './app-info';
import createDevtools from './devtools';
import createAutoImport from './auto-import';
import createChunkSplit from './chunk';
import createComponents from './components';
import createCompression from './compression';
import createSvgIcon from './svg-icon';

export default function createVitePlugins(viteEnv: any, isBuild = false) {
  const vitePlugins: (PluginOption | PluginOption[])[] = [
    appInfo(),
    vue(),
    UnoCss(),
    vueSetupExtend(),
    viteCompression(),
    Pages({
      dirs: 'src/views',  // 你的视图目录
      extensions: ['vue'], // 默认会查找 .vue 文件
      exclude: ['**/components/*.vue'] // 排除组件目录
    })
  ];

  vitePlugins.push(createDevtools(viteEnv));
  vitePlugins.push(compression());
  vitePlugins.push(createAutoImport());
  vitePlugins.push(createComponents());
  vitePlugins.push(...createCompression(viteEnv, isBuild))
  vitePlugins.push(createSvgIcon(isBuild));
  vitePlugins.push(createChunkSplit());

  return vitePlugins;
}
