<template>
  <div class="container">

    <vForm
      @sendData="sendData"
    >
      <button style="width:300px;display:block;margin:auto;">Send</button>
    </vForm>

  </div>
</template>

<script>
import vForm from './components/plugins/index/v-form.vue'

export default {
  name: 'App',
  components: {
    vForm
  },
  methods: {
    sendData(val) {
      console.log('send', val)
    },
  }
}
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;500&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Inter', sans-serif;
  }

  .container {
    width: 100vw;
    height: 100vh;
    display: flex;
  }
</style>