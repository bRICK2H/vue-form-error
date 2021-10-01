<template>
  <div class="v-form-control"
    :class="[classes, setErrorForm]"
    :style="setFormStyles"
    @mouseup="$formState.SET_ACTIVE_FORM(uid)"
  >
      <transition name="error-icon">
				<span v-if="!activeError"
					title="Показать ошибку"
					class="v-info-error v-form-control__v-info-error"
					@click="activeError = true"
				></span>
			</transition>

      <p v-if="activeError && error && error.result && error.text"
        class="global-error v-form-control__global-error"
        :class="position === 'top' ? 'global-error--top' : ''"
        :ref="uniqueError"
        :style="position === 'top' ? { top: `calc(0% - ${errorHeight + 20}px)` } : { top: '20px' }"
      >
        <span
          class="v-form-close v-form-control__v-form-close"
          @click="activeError = false"
        ></span>

        {{ error.text }}

      </p>
    
    <slot />
    
  </div>
</template>

<script>

export default {
	name: 'VFormControl',
  props: {
    uid: {
      type: [String, Number],
      required: true
    },
    popub: {
      type: Boolean,
      default: true
    },
    control: {
      type: Object,
      default: () => ({
          errors: [],
          info: [],
          warnings: [],
          success: []
      })
    },
    error: {
      type: Object,
      default: () => ({
        result: null,
        text: ''
      })
    },
    reactive: {
      type: Boolean,
      default: false
    },
    width: {
      type: [String, Number],
      default: 'auto'
    },
    maxWidth: {
      type: [String, Number],
      default: 'none'
    },
    height: {
      type: [String, Number],
      default: 'auto'
    },
    formStyle: {
      type: Boolean,
      default: true
    },
    padding: {
      type: [String, Number],
      default: '40 80'
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
    active: false,
    activeError: true,
    uniqueError: null,
    errorHeight: null,
    alive: true
  }),
  computed: {
    setFormStyles() {
      return {
        width: this.width === 'auto' ? 'auto' : `${this.width}px`,
        maxWidth: this.maxWidth !== 'none' ? `${+this.maxWidth}px` : 'none',
        height: this.height === 'auto' ? 'auto' : `${this.height}px`,
        padding: this.formStyle
          ? String(this.padding).split(' ').map(p => `${p}px`).join(' ')
          : '0px',
        boxShadow: this.formStyle
          ? '0 15px 25px rgba(0,0,0, .2)'
          : 'none',
        borderRadius: this.formStyle
          ? '20px'
          : 'none',
        border: this.formStyle
          ? 'border: 2px solid transparent'
          : 'none'
      }
    },
    setErrorForm() {
      if (!this.error || !Object.keys(this.error).length) return
      const { result, text } = this.error

      return result && text ? 'v-form-control--form-error' : ''
    }
  },
  watch: {
    async error() {
      await this.$nextTick()

      if (this.$refs[this.uniqueError]) {
        this.errorHeight = this.$refs[this.uniqueError].offsetHeight
      }
    },
  },
  created() {
    this.alive = true
    this.$formState.INIT_FORM(this)
    this.uniqueError = `error:${String(Math.random()).replace(/^.?\./, '')}`
  },
  mounted() {
    this.$formState.SET_FIELDS(this, {
      popub: this.popub,
      reactive: this.reactive,
      control: this.control
    })
  },
  updated() {
    this.$formState.UPDATE_FIELDS(this)
    this.$formState.SET_FIELDS(this, {
      popub: this.popub,
      reactive: this.reactive,
      control: this.control
    })
    
  },
  destroyed() {
    this.alive = false
    this.$formState.CLOSED_FORM(this.uid, {
      reactive: this.reactive,
      control: this.control
    })
  }
}
</script>

<style lang="scss">
		.v-form-control {
    background-color: #fff;
    margin: auto;
    position: relative;

    &--form-error {
      animation: form-error .2s;
      border: 2px solid #feb2b2;

      @keyframes form-error {
        0% { transform: translateX(10px); }
        25% { transform: translateX(-10px); }
        50% { transform: translateX(5px); }
        75% { transform: translateX(-5px); }
        100% { transform: translateX(0); }
      }
    }
    &__global-error {
      position: absolute;
      left: 10px;
      top: 16px;
      z-index: 10;
      
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
        background-color: #feb2b2;
      }
      &::after {
        width: 18px;
        height: 13px;
        left: 16px;
        top: -12.5px;
        background-color: #FFF5F6;
      }
    }
    &__v-form-close {
      float: right;
      position: relative;
      top: -5px;
      right: -5px;
    }
    &__v-info-error {
			position: absolute;
			left: 25px;
      top: -30px;
      z-index: 10;
		}
	}

  .global-error {
    min-width: 210px;
		max-width: calc(100% - 20px);
		padding: 8px;
		border: 2px solid #FEB2B2;
		border-radius: 8px;
		background-color: #FFF5F6;

    &--top {
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
  }

  .v-form-close {
    width: 28px;
		height: 28px;
		background: url('./assets/img/close.png') no-repeat 50% 50% / cover;
		cursor: pointer;
		transition: .2s;

		&:hover {
			opacity: .5;
			transform: scale(1.2) rotate(90deg);
		}
  }
  .v-info-error {
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
</style>