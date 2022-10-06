export const VIEW_PORT_HEIGHT = '[index] View Port Height'
export const VIEW_PORT_WIDTH = '[index] View Port Width'
export const SCROLL_POSITION = '[index] Scroll Position'
export const ERRORS = '[index] Handle Error'

const state = () => ({
  error: null,
  viewportWidth: 0,
  viewportHeight: 0,
  scrollPosition: 0
})
const actions = {
  setError({ commit }, error) {
    console.log('setError',error)
    commit('setError', error)
  },
}

const mutations = {
  setError(state, error) {
    state.error = error
  },
  clearError(state) {
    state.error = null
  },
  setViewportWidth(state, value) {
    state.viewportWidth = value;
  },
  setViewportHeight(state, value) {
    state.viewportHeight = value;
  },
  setScrollPosition(state, value) {
    state.scrollPosition = value;
  },
}

const getters = {
  [ERRORS]: state => state.error,
  [VIEW_PORT_HEIGHT]: state => state.viewportHeight,
  [VIEW_PORT_WIDTH]: state => state.viewportWidth,
  [SCROLL_POSITION]: state => state.scrollPosition,
}

export default {
  namespaced: false,
  state,
  mutations,
  actions,
  getters
}

