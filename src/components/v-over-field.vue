<template>
	<div class="v-over-field"
		:class="[classes]"
		:style="setStyleContainer"
		:ref="uniqueField"
	>
		<slot />

		<!-- POPUB ERROR -->
		<template v-if="popubMode">
			<!-- Error icon (show error) -->
			<transition name="error-icon">
				<span v-if="currControl.error && !active && reactiveMode"
					title="Показать ошибку"
					class="error-call-icon v-over-field__error-call-icon"
					@click="checkField(false)"
				></span>
			</transition>
			
			<!-- Error popup message -->
			<transition name="error-pupub">
				<div v-if="'error' in currControl && currControl.error && active && reactiveMode"
					class="error-popub-container v-over-field__error-popub-container"
					:class="{ 'error-popub-container--position-top': position === 'top' }"
					:style="setStylePositionError"
				>
					<span class="error-close error-popub-container__error-close"
						@click="$formState.CLOSE_ERROR(uid)"
					></span>
					<p class="error-title error-popub-container__error-title">
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
		</template>

		<!-- DEFAULT ERROR -->
		<template v-else>
			<div class="message-default-container">
				<transition :name="getStatusField" mode="out-in">
					<div v-if="getStatusField === 'error-default'"
						key="error-default"
						ref="error-default"
						class="default-container"
					>
						<img class="default-icon"
							src="../assets/img/error.png"
							alt="icon"
						>
						<p class="error-default-text">
							{{ currControl.text }}
						</p>
					</div>
					<div v-else-if="getStatusField === 'success-default'"
						key="success-default"
						class="default-container"
					>
						<img class="default-icon"
							src="../assets/img/success.png"
							alt="icon"
						>
						<p class="success-default-text">
							{{ success }}
						</p>
					</div>
					<div v-else-if="getStatusField === 'info-default' && info"
						key="info-default"
						class="default-container"
					>
						<img class="default-icon"
							src="../assets/img/info.png"
							alt="icon"
						>
						<p class="info-default-text">
							{{ info }}
						</p>
					</div>
				</transition>
			</div>
		</template>
	</div>
</template>

<script>
export default {
	name: 'VOverField',
	props: {
		value: null,
		// Rest error
		error: {
			type: Object,
			default: () => ({})
		},
		uid: {
			type: [String, Number],
			required: true,
		},
		verification: {
			type: Array,
			default: null
		},
		info: {
			type: String,
			default: ''
		},
		success: {
			type: String,
			default: ''
		},
		position: {
			type: String,
			default: 'bottom'
		},
		width: {
			type: [Number, String],
			default: 'auto'
		},
		margin: {
			type: [String, Number],
			default: 0
		},
		radius: {
			type: [String, Number],
			default: 8
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
		order: null,
		heightError: null,
		active: false,
		reactive: false,
		reactiveMode: false,
		popub: false,
		popubMode: false,
	}),
	computed: {
		getStatusField() {
			if ('error' in this.currControl && this.currControl.error && this.reactiveMode) {
				return 'error-default'
			} else if ('error' in this.currControl && !this.currControl.error && !this.currControl.empty && this.success && this.reactiveMode) {
				return 'success-default'
			} else if (this.info) {
				return 'info-default'
			} else {
				return ''
			}
		},
		getAmountErrors() {
			return this.$formState.GET_AMOUNT_ERRORS()
		},
		setStylePositionError() {
			if (this.heightError) return this.heightError
		},
		setStyleContainer() {
			return {
				width: this.width === 'auto' ? '100%' : `${this.width}px`,
				margin: String(this.margin).split(' ').map(p => `${p}px`).join(' ')
			}
		},
		verifyRequired() {
			const val = typeof this.value === 'number' || Array.isArray(this.value)
				? String(this.value) : this.value
				
			return !val || !String(val).length
		},
		verifySamePassword() {
			const field = this.verification.find(curr => {
				return curr?.name === 'samePassword' && curr?.password
			})

			return field?.password !== this.value 
		},
		verifyMax() {
			const max_options = this.verification.find(curr => {
				return typeof curr === 'object' && 'max' in curr && typeof curr.max === 'number'
			})

			return String(this.value).length > max_options.max
		},
		verifyMin() {
			const min_options = this.verification.find(curr => {
				if (typeof curr === 'object' && 'min' in curr && typeof curr.min === 'number') {
					return curr
				}
			})

			return min_options.type === 'number'
				? this.value <= min_options.min
				: String(this.value).length < min_options.min
		},
		verifyDigit() {
			return /[\D]/.test(this.value)
		},
		verifyString() {
			return /[\W]/.test(this.value)
		},
		verifyPhone() {
			// const temp = process.env.NODE_ENV === 'development' ? 9 : ''
			const pattern = new RegExp(`^(\\+7|7|8|9) ?\\(?\\d{3}\\)? ?\\d{3}( |-)?\\d{2}( |-)?\\d{2}$`)
			return !(pattern.test(this.value))
		},
		verifyEmail() {
			const pattern = /^"?[- \w\+\.]+"?@[\w-]+\.\w{2,6}$/
			return !(pattern.test(this.value))
		},
		verifySelf() {
			return this.value
		},
	},
	methods: {
		getEndingDigit(digit, words) {
			const [first, second, third, fourth] = words
			const n = Number(String(digit)[String(digit).length - 1])
			
			return [7, 8].includes(digit)
				? fourth
				: n === 1 && digit !== 11
					? first
					: [2, 3, 4].includes(n) && !([12, 13, 14].includes(digit))
						? second
						: third
		},
		getText(name) {
			if (!name) return ''
			const currEl = this.verification.find(curr => typeof curr === 'object' && curr.name === name)

			return currEl && 'text' in currEl && currEl.text
				? currEl.text : null
		},
		orderError(value) {
			if (!this.verification) return false
			
			const verification = this.verification
				.map(curr => {
					const create_property = name => name.map((v, i) => i === 0 ? v.toUpperCase() : v).join('')
					const generate_property = typeof curr === 'string'
						? create_property(curr.split(''))
						: create_property(curr.name.split(''))
					const computed_property = `verify${generate_property}`

					return {
						name: typeof curr === 'string'
							? curr
							: curr.name,
						error: this[computed_property]
					}
				})

			if (verification.length) {
				if (verification.map(c => c.name).includes('required')) {
					const required = verification.find(c => c.name === 'required')
					
					if (required.error) {
						return 'required'
					} else {
						const rest = verification.filter(c => c.name !== 'required' && c.error)
						return rest.length ? rest[0].name : false
					}
				} else {
					const rest = verification.filter(c => c.error)
					return rest.length ? rest[0].name : false
				}
			} else {
				return false
			}
		},
		createErrorControl(text, error) {
			this.currControl = {
				uid: this.uid,
				verification: this.verification,
				status: true,
				text,
				error
			}
		},
		checkField(send, value = this.value) {
			const orderError = this.orderError(value),
					text = this.getText(orderError)

			switch (orderError) {
				case false: this.createErrorControl(text, orderError)
					break
				
				case 'required': {
					this.createErrorControl(
						!text
							? 'Поле не может быть пустым'
							: text,

						this.verifyRequired
					)
				}
					break

				case 'min': {
					const min_options = this.verification.find(curr => {
						if (typeof curr === 'object' && 'min' in curr && typeof curr.min === 'number') {
							return curr
						}
					})
					
					this.createErrorControl(
						!text
							? `Минимальное количество символов не менее ${min_options.min}-${this.getEndingDigit(min_options.min, ['го', 'х', 'ти', 'ми'])}`
							: text,
						this.verifyMin
					)
				}
					break

				case 'max': {
					const max_options = this.verification.find(curr => {
						return typeof curr === 'object' && 'max' in curr && typeof curr.max === 'number'
					})
					
					this.createErrorControl(
						!text
							? `Максимальное количество символов не более ${max_options.max}-${this.getEndingDigit(max_options.max, ['го', 'х', 'ти', 'ми'])}`
							: text,
						this.verifyMax
					)
				}
					break

				case 'samePassword': {
					this.createErrorControl(
						!text
							? 'Пароли не совпадают'
							: text,
							
						this.verifySamePassword
					)
				}
					break

				case 'digit': {
					this.createErrorControl(
						!text
							? 'Допускается ввод только чисел'
							: text,
						this.verifyDigit
					)
				}
					break

				case 'string': {
					this.createErrorControl(
						!text
							? 'Допускается ввод только чисел и букв'
							: text,
						this.verifyString
					)
				}
					break

				case 'phone': {
					this.createErrorControl(
						!text
							? 'Неверный формат номера'
							: text,
						this.verifyPhone
					)
				}
					break

				case 'email': {
					this.createErrorControl(
						!text
							? 'Проверьте правильность введенных данных'
							: text,
						this.verifyEmail
					)
				}
					break

				case 'self': {
					this.createErrorControl(
						!text
							? 'Введено не корректное значение'
							: text,
						this.verifySelf
					)
				}
					break
			}

			this.$formState.SET_ERROR(this.currControl)
			// TODO На будущее На этом месте нужно реализовать метод SET_SUCCESS

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
			if (this.error && 'text' in this.error) {
				this.error.text = null
			}
		},
		verification: {
			deep: true,
			handler(options) {
				this.checkField(false, this.value)
			}
		},
		currControl: {
			deep: true,
			async handler({ error }) {
				await this.$nextTick()
				const field_ref = this.$refs[this.uniqueField]
				
				if (error) {
					if (this.reactiveMode) {
						this.$formState.SET_ERROR_STYLE(field_ref, this.uid, this.radius)

						if (this.position === 'top') {
							const el_error = document.querySelectorAll(`.${this.uid}`)

							this.heightError = {
								top: `-${field_ref.lastChild.offsetHeight - (el_error[0] ? el_error[0].offsetTop : 0) + 20}px`
							}
						}
					}
				} else {
					if (this.reactiveMode) {
						this.$formState.DELETE_ERROR_STYLE(field_ref, this.uid)
					}
				}
			}
		},
		reactive(isReactive) {
			this.reactiveMode = isReactive
		},
		popub(isPopub) {
			this.popubMode = isPopub
		},
		error(rError) {
			if (rError && 'text' in rError) {
				const { text } = rError
				this.createErrorControl(text, true, false)
			}
		}
	},
	created() {
		this.uniqueField = `[field:${String(Math.random()).split('').slice(2, 12).join('')}]`
	},
}
</script>

<style lang="scss">
	.v-over-field {
		position: relative;
		border-radius: 8px;

		&__error-popub-container {
			position: absolute;
			left: 0;
			top: calc(100% + 20px);
			z-index: 99999;
		}
		&__error-call-icon {
			position: absolute;
			right: 0;
    		top: -30px;
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

	.error-popub-container {
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
	.default-container {
		display: flex;
		align-items: center;
		position: relative;
		min-height: 18px;
		margin: 10px 0 0 0;
	}
	.default-icon {
		width: 16px;
		height: 16px;
		margin-right: 7px;
	}
	.error-default-text,
	.info-default-text,
	.success-default-text {
		font-size: 12px;
	}
	.error-default-text {
		color: #CA2E2E;
	}
	.info-default-text {
		color: #A2A2B9;
	}
	.success-default-text {
		color: #128788;
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
	.error-default-enter-active,
	.error-pupub-enter-active {
		animation: error-default-enter .2s;

		@keyframes error-default-enter {
			0% { opacity: 0; transform: translateX(100px); }
			50% { transform: translateX(-10px); }
			75% { transform: translateX(10px); }
			100% { transform: translateX(0); }
		}
	}
	.error-default-leave-active,
	.error-pupub-leave-active {
		animation: error-default-leave;

		@keyframes error-default-leave {
			100% { opacity: 0; }
		}
	}
	.info-default-enter-active {
		animation: info-default-enter .2s;

		@keyframes info-default-enter {
			0% { opacity: 0;}
		}
	}
	.info-default-leave-active {
		animation: info-default-leave;

		@keyframes info-default-leave {
			100% { opacity: 0; }
		}
	}
	.success-default-enter-active {
		animation: success-default-enter .2s;

		@keyframes success-default-enter {
			0% { transform: translateY(-25px) }
		}
	}
	.success-default-leave-active {
		animation: success-default-leave;

		@keyframes success-default-leave {
			100% { opacity: 0; }
		}
	}
</style>