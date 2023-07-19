import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import { useRouter } from 'next/router'

const config: DocsThemeConfig = {
  logo: (
    <>
      <img src="/penmark-logo.png" alt="Penmark CMS" width="44" height="44" />
      <span style={{ marginLeft: '0.6em', fontWeight: 600, fontSize: '1.25em' }}>
        Penmark CMS
      </span>
    </>
  ),
  project: {
    link: 'https://github.com/penmark-cms/penmark',
  },
  docsRepositoryBase: 'https://penmark.appsinprogress.com',
  //@ts-ignore
  editLink: false,
  feedback: {
    content: false
  },
  footer: {
    text: (
      <span>
        MIT {new Date().getFullYear()} ©{' '}
        <a href="https://penmark.appsinprogress.com" target="_blank">
          Penmark CMS
        </a>
      </span>
    )
  },
  //hide the search textbox
  search: {
    component: false,
  },
  //disable dark mode
  darkMode: false,
  nextThemes: {
    forcedTheme: 'light'
  },
  direction: 'ltr',
  useNextSeoProps: () => {
    const { asPath } = useRouter()
    if (asPath !== '/') {
      return {
        titleTemplate: '%s – Penmark CMS'
      }
    }
    else{
      return {
        titleTemplate: 'Penmark CMS'
      }
    }

  }
}

export default config
