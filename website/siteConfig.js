/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

// List of projects/orgs using your project for the users page.
const users = [
  // {
  // caption: 'User1',
  // You will need to prepend the image path with your baseUrl
  // if it is not '/', like: '/test-site../cita-assets/docusaurus.svg'.
  // image: '../cita-assets/docusaurus.svg',
  // infoLink: 'https://www.facebook.com',
  // pinned: true,
  // },
]
const baseUrl = '/'

const siteConfig = {
  title: 'CITAHub Docs', // Title for your website.
  tagline: 'Documents of CITAHub',
  url: 'https://docs.citahub.com/', // Your website URL
  baseUrl, // Base URL for your project */
  customDocsPath: 'docs/',
  docsUrl: '',
  cname: 'docs.citahub.com',
  // blogsUrl: 'toolchain',
  // blogSideBarCount: 'ALL',
  // blogSidebarTitle: {
  //   default: 'CITA Toolchain',
  //   all: 'All blog posts'
  // },

  // customDocsPath: 'en/',
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // Used for publishing and more
  projectName: 'citahub-docs',
  organizationName: 'cryptape',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'
  editUrl: 'https://github.com/cryptape/edit/master/docs/',
  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    // {
    //   doc: 'welcome',
    //   label: 'Docs'
    // },
    {
      page: 'community',
      label: 'Community',
    },
    {
      search: true,
    },
    {
      language: true,
    },
  ],

  // If you have users set above, you add it here:
  // users,

  /* path to images for header/footer */
  headerIcon: 'img/citahub_logo.svg',
  footerIcon: 'img/citahub_logo.svg',
  favicon: 'img/citahub_logo.png',

  /* Colors for website */
  colors: {
    primaryColor: '#231719',
    secondaryColor: '#595656',
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */
  translationRecruitingLink: 'https://crowdin.com/project/citahub-docs',
  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} Your Name or Your Company Name`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'default',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: ['https://buttons.github.io/buttons.js', baseUrl + 'javascript/index.js'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  docsSideNavCollapsible: true,

  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/docusaurus.png',
  twitterImage: 'img/docusaurus.png',

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  // enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  //   repoUrl: 'https://github.com/facebook/test-site',
  scrollToTop: true,
  algolia: {
    apiKey: '4fdec42fee0b2bd9e2c44248e1945f19',
    indexName: 'test',
    placeholder: 'Search',
    algoliaOptions: {
      algoliaOptions: {
        // "start_urls": ["./docs"],
        facetFilters: ['language:LANGUAGE', 'version:VERSION'],
      },
    }, // Optional, if provided by Algolia
  },
}

module.exports = siteConfig
