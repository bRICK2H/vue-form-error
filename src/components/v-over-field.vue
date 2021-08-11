<template>
	<div class="v-over-field"
		:class="[classes]"
		:style="setStyleContainerMargin"
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
				<div v-else-if="getStatusField === 'info-default'"
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
		</template>
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
		margin: {
			type: [String, Number],
			default: '0'
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
		reactive: false,
		reactiveMode: false,
		popub: false,
		popubMode: false,
	}),
	computed: {
		getStatusField() {
			if ('error' in this.currControl && this.currControl.error && this.reactiveMode) {
				return 'error-default'
			} else if ('error' in this.currControl && !this.currControl.error && this.reactiveMode && this.success) {
				return 'success-default'
			} else if (this.info) {
				return 'info-default'
			}
		},
		getAmountErrors() {
			return this.$formState.GET_AMOUNT_ERRORS()
		},
		setStylePositionError() {
			if (this.heightError) return this.heightError
		},
		setStyleContainerMargin() {
			return {
				margin: String(this.margin).split(' ').map(p => `${p}px`).join(' ')
			}
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
			// const temp = process.env.NODE_ENV === 'development' ? 9 : ''
			const pattern = new RegExp(`^(\\+7|8|9) ?\\(?\\d{3}\\)? ?\\d{3}( |-)?\\d{2}( |-)?\\d{2}$`)

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
							? `Пароль должен содержать не менее ${this.getMaxPassword ? this.getMaxPassword : this.maxPassword} символов`
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
						const el_error = document.querySelector(`[error="${this.uniqueMarkError}"]`)

						this.heightError = {
							top: `-${field_ref.lastChild.offsetHeight - el_error.offsetTop}px`
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
			this.reactiveMode = isReactive
		},
		popub(isPopub) {
			this.popubMode = isPopub
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

		&__error-popub-container {
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
		margin: 10px 0 0 0;
		display: flex;
		align-items: center;
		position: relative;
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
			0% { opacity: 0; left: 100px; }
			50% { left: -10px; }
			75% { left: 10px; }
			100% { left: 0; }
		}
	}
	.error-default-leave-active,
	.error-pupub-leave-active {
		animation: error-default-leave .2s;

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
		animation: info-default-leave .2s;

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
		animation: success-default-leave .2s;

		@keyframes success-default-leave {
			100% { opacity: 0; }
		}
	}
</style>