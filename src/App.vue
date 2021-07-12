<template>
  <div class="container">

    <!-- <vForm
      @sendData="sendData"
    >
      <button style="width:300px;display:block;margin:auto;">Send</button>
    </vForm> -->

    <vForm
      :reactiveError="true"
      :control="control"
      @sendData="sendData"
    >
      {{ value1 }} {{ value2 }} {{ value3 }}
	
      <v-over-field
        :id="1"
        :required="true"
        :value="value1"
        @has-error="hasError"
      >
        <input type="text" v-model="value1">
      </v-over-field>

      <v-over-field
        :id="2"
        :value="value2"
        :required="true"
        @has-error="hasError"
      >
        <izi-select
          width="300"
          v-model="value2"
          :options="options"
          :multiple="true"
        />
      </v-over-field>

      <v-over-field
        :id="3"
        :required="true"
        :value="value3"
        @has-error="hasError"
      >
        <input type="text" v-model="value3">
      </v-over-field>
      
      <button style="width:300px;display:block;margin:auto;">Send</button>
    </vForm>

  </div>
</template>

<script>
import vForm from './components/plugins/app'

export default {
  name: 'App',
  components: {
    vForm
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
    hasError(val) {
			console.log('hasError', val)
			const x = this.$children.find(curr => curr.id === val.id)
			// x.error = true
			// this.$set(x, 'error', true)
			console.log('x: ', x, this.cData)
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