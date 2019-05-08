import Cookie from 'cookie'
import Cookies from 'js-cookie'
import jwtDecode from 'jwt-decode'


function isJWTValid(token) {
  if (!token) return false

  const jwtData = jwtDecode(token) || {}
  const expires = jwtData.exp || 0

  return (new Date().getTime() / 1000) < expires
}


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
    Cookies.set('jwt-token', token)
  },

  logout({ commit }) {
    this.$axios.setToken(false)
    commit('clearToken')
    Cookies.remove('jwt-token')
  },

  autoLogin({ dispatch }) {
    const cookieStr = process.browser
      ? document.cookie
      : this.app.context.req.headers.cookie

    const cookies = Cookie.parse(cookieStr || '') || {}
    const token = cookies['jwt-token']

    if (isJWTValid(token)) {
      dispatch('setToken', token)
    } else {
      dispatch('logout')
    }
  }
}
