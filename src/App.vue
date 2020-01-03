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

input {
    margin-left: 5px;
    margin-right: 50px;
    background: #192a56;
    border-radius: 10px;
    padding: 4px;
    color: #ffffff;
    border: 0;
    font-size: 16px;
}

button {
    float: left;
    background-color: #192a56;
    color: #ffffff;
    border: 0;
    border-radius: 10px;
    padding: 4px 6px;
    font-size: 16px;
    user-select: none;
}

button:hover {
    background-color: #273c75;
}

button:active {
    background-color: #40739e;
}
</style>
