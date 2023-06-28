import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <div className='nx-mr-auto'>✏️ Penmark</div>,
  project: {
    link: 'https://github.com/shuding/nextra-docs-template',
  },
  docsRepositoryBase: 'https://github.com/shuding/nextra-docs-template',
  footer: {
    text: 'Nextra Docs Template',
  },
  //hide the search textbox
  search: {
    component: false,
  },
  //disable dark mode
  darkMode: false,
  direction: 'ltr',
}

export default config
