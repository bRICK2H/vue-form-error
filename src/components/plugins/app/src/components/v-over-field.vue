<template>
	<div class="v-over-field"
		:ref="uniqueField"
	>
		<slot />

		<transition name="error">
			<div v-if="'error' in currControl && currControl.error && active && reactiveMode"
				class="error-container v-over-field__error-container"
			>
				<p class="error-title error-container__error-title">
					Ошибка

					<span class="amount-error error-title__amount-error">
						<span style="width:20px;height:20px;background:#000;display:inline-block"
							@click="moveNextError(0)"
						></span>
						<!-- <span style="display: none">{{ currentError }}</span> -->
						<!-- {{ currentOffsetError }} из {{ amountErrors }} -->
						0 из {{ $formState.GET_AMOUNT_ERRORS() }}
						<span style="width:20px;height:20px;background:#000;display:inline-block"
							@click="moveNextError(1)"
						></span>
					</span>
				</p>
				{{ currControl.text }}
			</div>
		</transition>

		<!-- <transition name="error">
			<div v-if="error && active"
				class="error-container v-over-field__error-container"
			>
				<p class="error-title error-container__error-title">
					Ошибка

					<span class="amount-error error-title__amount-error">
						<span style="width:20px;height:20px;background:#000;display:inline-block"
							@click="moveNextError(0)"
						></span>
						<span style="display: none">{{ currentError }}</span>
						{{ currentOffsetError }} из {{ amountErrors }}
						<span style="width:20px;height:20px;background:#000;display:inline-block"
							@click="moveNextError(1)"
						></span>
					</span>
				</p>
				{{ message }}
			</div>
		</transition> -->
	</div>
</template>

<script>
export default {
	name: 'vOverField',
	props: {
		value: null,
		id: {
			type: Number,
			required: true,
		},
		required: {
			type: Boolean,
			default: false
		},
	},
	data: () => ({
		uniqueField: '',
		currControl: {},
		reactiveError: false,
		reactiveMode: false,
		active: false,
		// amountErrors: 0,
		// currentOffsetError: 0,
	}),
	computed: {
		// generalData() {
		// 	const keys = ['id', 'required', 'value', 'error']
		// 	return this.$parent.$children.reduce((acc, curr) => {
		// 		acc.push(keys.reduce((a, key) => (a[key] = curr[key], a), {}))
		// 		return acc
		// 	}, [])
		// },
		// currentError() {
		// 	return this.currentOffsetError = this.generalData
		// 		.filter(curr => curr.error)
		// 		.findIndex(curr => curr.id === this.id) + 1
		// },
	},
	methods: {
		checkField(send = false, value = this.value) {
			if (this.required) {
				this.$formState.SET_ACTIVE_FIELD(this.id, send)

				this.currControl = {
					id: this.id,
					text: 'Это поле не может быть пустым!',
					status: true,
					error: Array.isArray && !value.length || !value
				}

				this.$formState.SET_ERROR(this.currControl)
			}
		}
		// moveNextError(flag) {

		// 	this.$parent.$children.forEach(curr => {
		// 		if (curr.amountErrors === 1) return
		// 		if (flag) {
		// 			if(curr.currentOffsetError < curr.amountErrors) {
		// 				curr.currentOffsetError++
		// 			}
		// 		} else {
		// 			if(curr.currentOffsetError > 1) {
		// 				curr.currentOffsetError--
		// 			}
		// 		}
		// 	})

		// 	const nextError = this.generalData
		// 		.filter(curr => curr.error)[this.currentOffsetError - 1]

		// 	console.log('moveNextError', this.currentOffsetError)
		// 	this.openActiveError(nextError.id)
			
		// },
		// openActiveError(id) {
		// 	this.$parent.$children.forEach(curr => {
		// 		curr.active = curr.id === id
		// 	})
		// }
	},
	watch: {
		value(val) {
			this.checkField(false, val)


			// this.$formState.GET_CURR_FIELD(this.id).reactiveError = !this.$formState.GET_CURR_FIELD(this.id).reactiveError
			// if (this.required) {
			// 	const message = 'Это поле не может быть пустым!'

			// 	if (Array.isArray && !val.length || !val) {
			// 		this.error = true
			// 		this.message = message

			// 		this.openActiveError(this.id)


			// 		this.$emit('has-error', this.generalData.find(curr => curr.id === this.id))
			// 	} else {
			// 		this.error = false

			// 		const nextError = this.generalData.find(curr => curr.error)
			// 		if (nextError) {
			// 			this.openActiveError(nextError.id)
			// 		}
			// 	}
			// }

			// this.$parent.$children.forEach(curr => {
			// 	curr.amountErrors = this.generalData.filter(curr => curr.error).length
			// })
			// console.log(this.amountErrors)
		},
		currControl({ error }) {
			const field_ref = this.$refs[this.uniqueField].firstChild
			
			if (error) {
				if (this.reactiveMode) {
					this.$formState.SET_ERROR_STYLE(field_ref)
				}
			} else {
				if (this.reactiveMode) {
					this.$formState.DELETE_ERROR_STYLE(field_ref)
				}
			}
		},
		reactiveError(isReactive) {
			if (isReactive) this.reactiveMode = true
		}
	},
	created() {
		this.uniqueField = `field:${String(Math.random()).replace(/^.?\./, "")}`
	}
}
</script>

<style lang="scss">
	.v-over-field {
		width: fit-content;
		position: relative;
		margin: 20px 0;
		border-radius: 8px;

		&__error-container {
			position: absolute;
			left: 0;
			top: calc(100% + 20px);
			z-index: 99999;
		}
	}
	.error-container {
		min-width: 313px;
		padding: 8px;
		border: 2px solid #FEB2B2;
		border-radius: 8px;
		background-color: #FFF5F6;

		&::before, &::after {
			content: '';
			position: absolute;
			clip-path: polygon(0% 100%, 50% 0%, 100% 100%);
		}
		&::before {
			width: 20px;
			height: 14px;
			left: 15px;
			top: -15.5px;
			background-color: #FEB2B2;
		}
		&::after {
			width: 18px;
			height: 13px;
			left: 16px;
			top: -12.5px;
			background-color: #FFF5F6;
			
		}
	}
	.error-title {
		font-weight: 600;
		margin-bottom: 8px;
	}
	.error-enter-active {
		animation: error-enter .2s;

		@keyframes error-enter {
			0% { opacity: 0; left: -100px; }
			50% { left: 10px; }
			75% { left: -10px; }
			100% { left: 0; }
		}
	}
	.error-leave-active {
		animation: error-leave .2s;

		@keyframes error-leave {
			100% { left: -100px; opacity: 0 }
		}
	}
</style>