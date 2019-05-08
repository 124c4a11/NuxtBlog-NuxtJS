export const state = () => ({
  token: null
})

export const getters = {
  token: (state) => state.token,

  isAuth: (state) => Boolean(state.token)
}

export const mutations = {
  setToken(state, token) {
    state.token = token
  },

  clearToken(state) {
    state.token = null
  }
}

export const actions = {
  async login({ commit, dispatch }, formData) {
    try {
      const { token } = await this.$axios.$post('/api/auth/admin/login', formData)

      dispatch('setToken', token)
    } catch (err) {
      commit('setError', err, { root: true })
      throw err
    }
  },

  async createUser({ commit }, formData) {
    try {
      await this.$axios.post('/api/auth/admin/create', formData)
    } catch (err) {
      commit('setError', err, { root: true })
      throw err
    }
  },

  setToken({ commit }, token) {
    this.$axios.setToken(token, 'Bearer')
    commit('setToken', token)
  },

  logout({ commit }) {
    this.$axios.setToken(false)
    commit('clearToken')
  }
}
