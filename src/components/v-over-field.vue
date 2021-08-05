<template>
	<div class="v-over-field"
		:class="[classes]"
		:ref="uniqueField"
	>
		<slot />

		<!-- Error info -->
		<transition name="error-icon">
			<span v-if="currControl.error && !active && reactiveMode"
				title="Показать ошибку"
				class="error-call-icon v-over-field__error-call-icon"
				@click="checkField(false)"
			></span>
		</transition>
		
		<!-- Error popup message -->
		<transition name="error">
			<div v-if="'error' in currControl && currControl.error && active && reactiveMode"
				class="error-container v-over-field__error-container"
				:class="{ 'error-container--position-top': position === 'top' }"
				:style="setStylePositionError"
			>
				<span class="error-close error-container__error-close"
					@click="$formState.CLOSE_ERROR(uid)"
				></span>
				<p class="error-title error-container__error-title">
					Ошибка

					<span class="amount-error error-title__amount-error">
						<span class="counter-left-arrow" 
							:class="{ 'counter-last-arrow': $formState.IS_LAST_COUNTER(currCountError, getAmountErrors, 'left') }"
							@click="moveStepError(false)"
						></span>
						<span class="counter-text">
							{{ currCountError }} из {{ getAmountErrors }}
						</span>
						<span class="counter-right-arrow"
							:class="{ 'counter-last-arrow': $formState.IS_LAST_COUNTER(currCountError, getAmountErrors, 'right') }"
							@click="moveStepError(true)"
						></span>
					</span>
				</p>
				
				{{ currControl.text }}
			</div>
		</transition>
	</div>
</template>

<script>
export default {
	name: 'VOverField',
	props: {
		value: null,
		uid: {
			type: [String, Number],
			required: true,
		},
		verification: {
			type: Array,
			default: () => (['required'])
		},
		position: {
			type: String,
			default: 'bottom'
		},
		classes: {
			type: Array,
			default: () => ([])
		},
	},
	data: () => ({
		name: 'v-over-field',
		uniqueField: '',
		uniqueMarkError: '',
		currControl: {},
		currCountError: 1,
		maxPassword: 6,
		order: null,
		heightError: null,
		active: false,
		reactiveMode: false,
		reactive: false,
	}),
	computed: {
		getAmountErrors() {
			return this.$formState.GET_AMOUNT_ERRORS()
		},
		setStylePositionError() {
			if (this.heightError) return this.heightError
		},
		getMaxPassword() {
			const currEl = this.verification.find(curr => typeof curr === 'object' && curr.name === 'password')
			return currEl && 'max' in currEl && currEl.max && typeof currEl.max === 'number'
				? currEl.max : null
		},
	},
	methods: {
		verifyRequired(value) {
			return Array.isArray && !value.length || !value
		},
		verifyPhone(value) {
			const temp = process.env.NODE_ENV === 'development' ? 9 : ''
			const pattern = new RegExp(`^(\\+7|8|${temp}) ?\\(?\\d{3}\\)? ?\\d{3}( |-)?\\d{2}( |-)?\\d{2}$`)

			return !(pattern.test(value))
		},
		verifyPassword(value) {
			return value.length < (this.getMaxPassword ? this.getMaxPassword : this.maxPassword)
		},
		verifyDigit(value) {
			return /[\D]/.test(value)
		},
		verifyString(value) {
			return /[\W]/.test(value)
		},
		getText(name) {
			const currEl = this.verification.find(curr => typeof curr === 'object' && curr.name === name)

			return currEl && 'text' in currEl && currEl.text
				? currEl.text : null
		},
		orederError(value) {
			const verification = this.verification
				.map(curr => {
					const create_method = name => name.map((v, i) => i === 0 ? v.toUpperCase() : v).join('')
					const generate_method = typeof curr === 'string'
						? create_method(curr.split(''))
						: create_method(curr.name.split(''))
					const toggle_verification = `verify${generate_method}`
					
					return {
						name: typeof curr === 'string'
							? curr
							: curr.name,
						error: this[toggle_verification](value)
					}
				})

			return verification.reduce((acc, curr) => {
				acc = curr.name
				
				if (verification.every(v => v.error)) {
					acc = verification.includes('required')
						? 'required'
						: verification[verification.findIndex(i => i.error)].name
				} else {
					if (verification.some(v => v.error)) {
						acc = curr.name
					}
				}

				return acc
			}, '')
		},
		createErrorControl(text, error) {
			this.currControl = {
				uid: this.uid,
				verification: this.verification,
				status: true,
				text, error
			}
		},
		checkField(send, value = this.value) {
			const orederError = this.orederError(value)
			const text = this.getText(orederError)

			switch (orederError) {
				case 'required':
					this.createErrorControl(
						!text
							? 'Это поле не может быть пустым!'
							: text,
						this.verifyRequired(value)
					)
					break;

				case 'phone':
					this.createErrorControl(
						!text
							? 'Не верный формат номера!'
							: text,
						this.verifyPhone(value)
					)
					break;

				case 'password':
					this.createErrorControl(
						!text
							? `Пароль не может быть менее ${this.getMaxPassword ? this.getMaxPassword : this.maxPassword} символов!`
							: text,
						this.verifyPassword(value)
					)

					break;

				case 'digit':
					this.createErrorControl(
						!text
							? 'Допускается ввод только чисел!'
							: text,
						this.verifyDigit(value)
					)

					break;

				case 'string':
					this.createErrorControl(
						!text
							? 'Допускается ввод только чисел и букв!'
							: text,
						this.verifyString(value)
					)

					break;
			}

			this.$formState.SET_ERROR(this.currControl)

			if (!send) {
				this.$formState.SET_ACTIVE_FIELD(this.uid)
			}
		},
		moveStepError(side) {
			side ? this.currCountError++ : this.currCountError--

			this.currCountError = this.currCountError <= 1
				? 1
				: this.currCountError >= this.getAmountErrors
					? this.getAmountErrors : this.currCountError

			this.$formState.SYNC_COUNT_ERROR(this.currCountError)
			this.$formState.MOVE_ACTIVE_FIELD(this.currCountError)
		},
	},
	watch: {
		value(val) {
			this.checkField(false, val)
		},
		async currControl({ error }) {
			await this.$nextTick()
			const field_ref = this.$refs[this.uniqueField]
			
			if (error) {
				if (this.reactiveMode) {
					this.$formState.SET_ERROR_STYLE(field_ref, this.uniqueMarkError)

					if (this.position === 'top') {
						this.heightError = {
							top: `calc(0% - ${field_ref.lastChild.offsetHeight + 20}px)`
						}
					}
				}
			} else {
				if (this.reactiveMode) {
					this.$formState.DELETE_ERROR_STYLE(field_ref, this.uniqueMarkError)
				}
			}
		},
		reactive(isReactive) {
			if (isReactive) this.reactiveMode = true
		}
	},
	created() {
		this.uniqueField = `[field:${String(Math.random()).split('').slice(2, 12).join('')}]`
	},
	mounted() {
		const el_error = document.querySelectorAll(`.${this.uid}`)
		this.uniqueMarkError = `[${this.uid}:${String(Math.random()).split('').slice(2, 12).join('')}]`
		
		if (el_error) {
			for (let i = 0; i < el_error.length; i++) {
				el_error[i].setAttribute('error', this.uniqueMarkError)
			}
		}

	}
}
</script>

<style lang="scss">
	.v-over-field {
		width: 100%;
		position: relative;
		margin: 10px 0;
		border-radius: 8px;

		&__error-container {
			position: absolute;
			left: 0;
			top: calc(100% + 20px);
			z-index: 99999;
		}
		&__error-call-icon {
			position: absolute;
			right: -30px;
			bottom: 12px;
		}
	}
	.error-call-icon {
		width: 22px;
		height: 22px;
		font-size: 16px;
		color: #FEB2B2;
		border-radius: 50%;
		border: 2px solid #FEB2B2;
		background-color: #fff;
		cursor: pointer;
		transition: .2s;

		&::after, &::before {
			content: '';
			width: 2px;
			background-color: #FEB2B2;
			position: absolute;
			left: 50%;
			display: flex;
			justify-content: center;
		}
		&::after {
			height: 9px;
			border-radius: 30%;
			top: calc(50% - 2px);
			transform: translate(-50%, -50%);
		}
		&::before {
			height: 2px;
			border-radius: 50%;
			top: calc(100% - 4px);
			transform: translateX(-50%);
		}
		&:hover {
			border: 2px solid transparent;
			background-color: #FFF5F6;
			transform: scale(1.2)
		}
	}
	.error-container {
		min-width: 210px;
		max-width: calc(100% - 20px);
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

		&--position-top {
			&::before, &::after {
				clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
			}
			&::before {
				top: 100%;
			}
			&::after {
				top: calc(100% - 2px);
			}
		}

		&__error-close {
			position: absolute;
			top: 10px;
			right: 8px;
		}
	}
	.error-close {
		width: 20px;
		height: 20px;
		background: url('../assets/img/close.png') no-repeat 50% 50% / cover;
		cursor: pointer;
		transition: .2s;

		&:hover {
			opacity: .5;
			transform: scale(1.2) rotate(90deg);
		}
	}
	.error-title {
		font-size: 16px;
		font-weight: 600;
		margin-bottom: 8px;
		display: flex;
		align-items: center;

		&__amount-error {
			margin: 2px 0 0 15px;
			display: inline-flex;
			align-items: center;
		}
	}

	.counter-left-arrow,
	.counter-right-arrow {
		display: inline-block;
		width: 15px;
		height: 15px;
		background: url('../assets/img/arrow.png') no-repeat 50% 50% / cover;
		cursor: pointer;
		transition: .2s;

		&:hover {
			opacity: .8;
			transform: scale(1.5);
		}
	}
	.counter-left-arrow {
		transform: rotate(180deg);

		&:hover {
			transform: rotate(180deg) scale(1.5);
		}
	}
	.counter-last-arrow {
		opacity: .2;

		&:hover {
			opacity: .2;
			cursor: default;
			transform: scale(1);
		}
	}
	.counter-left-arrow.counter-last-arrow {
		&:hover {
			transform: rotate(180deg) scale(1);
		}
	}
	.counter-text {
		font-size: 12px;
		margin: 0 10px;
	}
	.error-icon-enter-active {
		animation: error-icon-enter .2s;

		@keyframes error-icon-enter {
			0% { transform: scale(0) }
			50% { transform: scale(1.2) }
			100% { transform: scale(1) }
		}
	}
	.error-icon-leave-active {
		animation: error-icon-leave .2s;

		@keyframes error-icon-leave {
			100% { transform: scale(0) }
		}
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