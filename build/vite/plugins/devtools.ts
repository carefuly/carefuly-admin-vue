import VueDevTools from 'vite-plugin-vue-devtools';

export default function createDevtools(env: any) {
  const { VITE_OPEN_DEVTOOLS } = env
  return VITE_OPEN_DEVTOOLS === 'true' && VueDevTools()
}
