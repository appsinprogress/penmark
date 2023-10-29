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
  title: 'Penmark CMS',
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="An embeddable CMS for your Markdown-based, GitHub-backed content sites" />
      <meta name="og:title" content="Penmark CMS" />
      <meta name="og:description" content="An embeddable CMS for your Markdown-based, GitHub-backed content sites" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@thomasgauvin" />
      <meta name="twitter:title" content="Penmark CMS" />
      <meta name="twitter:description" content="An embeddable CMS for your Markdown-based, GitHub-backed content sites" />
      <meta name="twitter:image" content="https://penmark.appsinprogress.com/penmark-splash.png" />
      <meta name="og:image" content="https://penmark.appsinprogress.com/penmark-splash.png" />
      <meta name="apple-mobile-web-app-title" content="Penmark CMS" />
      <meta name="application-name" content="Penmark CMS" />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="theme-color" content="#ffffff" />
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
