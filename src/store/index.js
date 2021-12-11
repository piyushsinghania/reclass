import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    profile: null,
  },
  mutations: {
    setProfile(state, profileData) {
      state.profile = profileData
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${profileData.access_token}`
      localStorage.setItem('profile', JSON.stringify(profileData))
    },
    removeProfile(state) {
      state.profile = null
      localStorage.removeItem('profile')
      location.reload()
    },
  },
  actions: {},
  modules: {},
  getters: {
    loggedIn(state) {
      return !!state.profile
    },

    role(state) {
      if (state.profile.is_admin) {
        return 'admin'
      } else {
        if (state.profile.is_instructor) {
          return 'instructor'
        } else {
          return 'student'
        }
      }
    },
  },
})
