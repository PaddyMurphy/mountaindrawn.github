<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
@import '/assets/scss/_variables.scss';
@import '/assets/scss/_utilities.scss';
@import '/assets/scss/_common.scss';

body {
  font-family: 'Open Sans Condensed', 'Avenir', Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
