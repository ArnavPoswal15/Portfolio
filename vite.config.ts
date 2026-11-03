import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';

/** Keep render-blocking stylesheets before module scripts in built HTML. */
function cssBeforeModuleScripts(): Plugin {
  return {
    name: 'css-before-module-scripts',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        return html.replace(
          /(<head[^>]*>)([\s\S]*?)(<\/head>)/i,
          (_match, headOpen: string, headInner: string, headClose: string) => {
            const linkRe = /<link[^>]*rel=["']stylesheet["'][^>]*>/gi;
            const scriptRe = /<script[^>]*type=["']module["'][^>]*>\s*<\/script>/gi;
            const styles = headInner.match(linkRe) ?? [];
            const scripts = headInner.match(scriptRe) ?? [];
            if (styles.length === 0 && scripts.length === 0) {
              return headOpen + headInner + headClose;
            }
            const cleaned = headInner.replace(linkRe, '').replace(scriptRe, '').trimEnd();
            const bundle = [...styles, ...scripts].join('\n  ');
            return `${headOpen}${cleaned}\n  ${bundle}\n${headClose}`;
          },
        );
      },
    },
  };
}

export default defineConfig({
  base: '/Portfolio/',
  root: '.',
  plugins: [cssBeforeModuleScripts()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        orderflow: resolve(__dirname, 'work/orderflow.html'),
        focusfleet: resolve(__dirname, 'work/focusfleet.html'),
      },
    },
  },
});
