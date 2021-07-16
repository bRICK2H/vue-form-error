<template>
  <div class="container">

    <!-- <vForm
      @sendData="sendData"
    >
      <button style="width:300px;display:block;margin:auto;">Send</button>
    </vForm> -->

    <VFormControl
      :reactiveError="true"
      :height="500"
      :classes="['some']"
      :control="control"
      @submit="sendData"
    >
      <VOverField
        :uid="1"
        :required="true"
        :value="value1"
        position="top"
      >
        <input class="input" type="text" v-model="value1">
      </VOverField>

      <VOverField
        :uid="2"
        :value="value2"
        :required="true"
      >
        <izi-select
          width="300"
          v-model="value2"
          :options="options"
          :multiple="true"
        />
      </VOverField>

      <VOverField
        :uid="3"
        :required="true"
        :value="value3"
      >
        <input class="input" type="text" v-model="value3">
      </VOverField>
      
      <button style="width:150px;display:block;margin:auto;">Send</button>
    </VFormControl>

  </div>
</template>

<script>
import VFormControl from './components/plugins/app'

export default {
  name: 'App',
  components: {
    VFormControl
  },
  data: () => ({
    control: {
      errors: [],
      info: [],
      warnings: []
  },
    value1: '',
		value2: [5],
		value3: '',
		options: [1, 2, 3, 4, 5],
    isSend: false,
  }),
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

  .input {
    min-height: 44px;
    border: 2px solid #eeedf7;
    border-radius: 8px;
    outline: none;
    padding: 0 15px;
  }
</style>