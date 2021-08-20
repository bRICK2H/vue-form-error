<template>
	<button class="v-form-submit"
		:class="setClassCursor"
		:style="setStyleToSumbit"
		:disabled="isFetching || disabled"
		@mouseenter="isHover = true"
		@mouseleave="isHover = false"
		@click="handler"
		@focus="isFocus = true"
		@blur="isFocus = false"
	>
		{{ label }}
	</button>
</template>

<script>
export default {
	name: 'vFormSubmit',
	props: {
		uid: {
			type: String,
			required: true
		},
		label: {
			type: String,
			default: 'Войти'
		},
		width: {
			type: [String, Number],
			default: 'auto'
		},
		height: {
			type: [String, Number],
			default: 'auto'
		},
		padding: {
			type: String,
			default: '16 0'
		},
		color: {
			type: String,
			default: '#fff' 
		},
		bColor: {
			type: String,
			default: '#1f1f33'
		},
		bHover: {
			type: String,
			default: '#a2a2b9'
		},
		isFetching: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	data: () => ({
		isHover: false,
		isFocus: false,
	}),
	computed: {
		setStyleToSumbit() {
			return {
				color: this.color,
				width: this.width === 'auto' ? 'auto' : `${parseFloat(this.width)}px`,
				height: this.height === 'auto' ? 'auto' : `${parseFloat(this.height)}px`,
				padding: String(this.padding).split(' ').map(p => `${p}px`).join(' '),
				backgroundColor:
					this.isHover
						? this.bHover
						: this.disabled
							? '#D0D0E2'
							: this.isFocus
									? '#3f3f58'
									: this.bColor
								
			}
		},
		setClassCursor() {
			return this.disabled ? 'v-form-submit--cursor' : ''
		}
	},
	methods: {
		handler() {
      	this.$formState.SUBMIT()
			this.$emit('submit', this.$formState.GET_RESULT())
			this.isHover = false
			this.isFocus = false
		}
	},
	created() {
		this.$formState.SET_BUTTON(this, this.uid)
	},
	destroyed() {
		this.$formState.DROP_BUTTON(this.uid)
	}
}
</script>

<style lang="scss">
	.v-form-submit {
		font-size: 16px;
		font-weight: 600;
		border-radius: 12px;
		border: none;
		cursor: pointer;
		transition: .2s;

		&:active {
			box-shadow: 0 3px 5px #5e5e6b;
		}
		&--cursor {
			cursor: no-drop;
		}
	}
</style>