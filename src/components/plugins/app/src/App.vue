<template>
	<form class="c-main-form"
		@submit.prevent="$emit('sendData', cData); $formState.SUBMIT()"
	>
		<slot />
	</form>
</template>

<script>
import vOverField from './components/v-over-field.vue'

export default {
	name: 'cMainForm',
	components: {
		vOverField
	},
  props: {
    control: {
      type: Object,
      default: () => ({})
    },
    reactiveError: {
      type: Boolean,
      default: false
    }
  },
	data: () => ({}),
	computed: {
		cData() {
			const keys = ['id', 'required', 'value']
			return this.$children.reduce((acc, curr) => {
				acc.push(keys.reduce((a, key) => (a[key] = curr[key], a), {}))
				return acc
			}, [])
		}
	},
	methods: {},
  mounted() {
    console.log(this)
    this.$formState.SET_FIELDS(this, {
      reactiveError: this.reactiveError,
      control: this.control
    })
    console.log('get: ', this.$formState.GET_FIELDS())
  }
}
</script>

<style lang="scss">
	.c-main-form {
		width: 600px;
		padding: 30px;
		margin: auto;
		border: 1px solid #ccc;
		border-radius: 8px;
	}
	// .v-selected.select-field-error {
	// 	border: 2px solid tomato;
	// }
	// .dropdown-list.option-field-error {
	// 	border: 2px solid tomato;
	// }
</style>