<template>
	<form class="c-main-form"
		@submit.prevent="$emit('sendData', cData); isSend = true"
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
				:classes="[
					isSend ? 'select-field-error' : '',
					'option-field-error'
				]"
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
		
		<slot />
	</form>
</template>

<script>
import vOverField from './v-over-field.vue'

export default {
	name: 'cMainForm',
	components: {
		vOverField
	},
	data: () => ({
		value1: '',
		value2: [5],
		value3: '',
		options: [1, 2, 3, 4, 5],
		isSend: false,
	}),
	computed: {
		cData() {
			const keys = ['id', 'required', 'value']
			return this.$children.reduce((acc, curr) => {
				acc.push(keys.reduce((a, key) => (a[key] = curr[key], a), {}))
				return acc
			}, [])
		}
	},
	methods: {
		hasError(val) {
			console.log('hasError', val)
			const x = this.$children.find(curr => curr.id === val.id)
			// x.error = true
			// this.$set(x, 'error', true)
			console.log('x: ', x, this.cData)
		},
	},
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