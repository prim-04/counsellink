
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/login",
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/login"
  },
  {
    "renderMode": 2,
    "route": "/student-dashboard"
  },
  {
    "renderMode": 2,
    "route": "/counselor-dashboard"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 1511, hash: '14db9f882df7144188b951fe2638862b9f05014ad10facc1a7e92b1910efa0ef', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 949, hash: '558758487b7ce3a961a89c214fbfbbe050d8a120a4fb63584b85982bbeb2cbb5', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'counselor-dashboard/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/counselor-dashboard_index_html.mjs').then(m => m.default)},
    'student-dashboard/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/student-dashboard_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 10295, hash: '750f07f2fabb308f915563df4bc0213bf3aa27f4cd9b017a7074a77a99e5302a', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'styles-NEADY7JJ.css': {size: 3685, hash: '+A6gMyFXC5M', text: () => import('./assets-chunks/styles-NEADY7JJ_css.mjs').then(m => m.default)}
  },
};
