<template>
  <div id="app">
    <MenuBar/>
    <Tables/>
  </div>
</template>

<script>

import MenuBar from './components/MenuBar.vue'
import Tables from './components/Tables.vue'

export default {
  name: 'app',
  components: {
    MenuBar,
    Tables
  },
  metaInfo: {
    title: 'Seating Plan'
  }
}
</script>

<style>

@import url('https://fonts.googleapis.com/css?family=Work+Sans:400,600');

* {
    font-family: 'Work Sans', sans-serif;
    font-weight: 400;
}

html, body, #app {
    text-align: center;
    margin:0;
    padding:0;
    overflow: hidden;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
</style>
