// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: false,
  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in'
    }
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@vueuse/nuxt',
    'nuxt-icon'
  ],

  css: [
    '@/assets/default.css',
  ],

  googleFonts: {
    families: {
      'Inter': [300, 400, 500, 600, 700, 800],
      'Roboto+Mono': [300, 500, 700],
    }
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_ROOT
    }
  },

  tailwindcss: {
    config: {
      plugins: [
        require('@tailwindcss/forms')
      ],
      theme: {
        fontFamily: {
          'sans': ['Inter'],
          'mono': ['Roboto Mono']
        },
        extend: {
          colors: {
            primaryfg: '#E1EBED',
            primarybg: '#010104',
            secondaryfg: '#B0B5B6',
            primary: '#534DC6',
            secondary: '#19182B',
            'secondary-d': '#131320',
            accent: '#C07BBC',
            success: '#639A55',
            error: '#C95B5B'
          }
        }
      }
    }
  }
})
