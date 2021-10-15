export const state = () => ({
  siteData: null,
  isMobile: false
})

export const mutations = {
  updateData: (state, data) => {
    state.siteData = data
  },
  setIsMobile: (state, bool) => {
    state.isMobile = bool
  }
}

export const actions = {
  async nuxtServerInit ({ commit }) {
    console.log('nuxt server init--get data')

    const homePage = this.$prismic.api.getSingle('home')

    await Promise.all([homePage])
      .then(values => {
        const dataObj = {
          homePage: values[0]
        }

        commit('updateData', dataObj)
      })
      .catch(error => {
        console.log(error)
      })
  },
  setIsMobile ({commit}, bool) {
    commit('setIsMobile', bool)
  }
}