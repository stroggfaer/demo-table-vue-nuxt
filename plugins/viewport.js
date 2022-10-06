export default ({ store }) => {
  setViewportParameters();
  setScrollPosition();
  window.addEventListener("resize", setViewportParameters, false);
  window.addEventListener("scroll", setScrollPosition, false);

  function setViewportParameters() {
    store.commit('setViewportWidth', window.innerWidth);
    store.commit('setViewportHeight', window.innerHeight);
  }

  function setScrollPosition() {
    store.commit('setScrollPosition', window.scrollY);
  }
}
