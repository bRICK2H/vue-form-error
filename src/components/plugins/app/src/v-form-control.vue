<template>
  <form class="v-form-control"
    :class="[classes, setErrorForm]"
    :style="setFormStyles"
    @submit.prevent="submit"
  >
    <transition name="global-error">
      <p class="global-error v-form-control__global-error"
        v-if="error && !error.result && error.text"
        :ref="uniqueError"
        :style="{ top: `calc(0% - ${errorHeight + 20}px)` }"
      >
        {{ error.text }}
      </p>
    </transition>
    <slot />
  </form>
</template>

<script>

export default {
	name: 'VFormControl',
  props: {
    control: {
      type: Object,
      default: () => ({
          errors: [],
          info: [],
          warnings: []
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
    height: {
      type: [String, Number],
      default: 'auto'
    },
    padding: {
      type: [String, Number],
      default: '40 80'
    },
    classes: {
      type: Array,
      default: () => ([])
    }
  },
  data: () => ({
    uniqueError: null,
    errorHeight: null,
  }),
  computed: {
    setFormStyles() {
      return {
        width: this.width === 'auto' ? 'auto' : `${this.width}px`,
        height: this.height === 'auto' ? 'auto' : `${this.height}px`,
        padding: String(this.padding).split(' ').map(p => `${p}px`).join(' ')
      }
    },
    setErrorForm() {
      if (!this.error || !this.error.result && !this.error.text) return
      const { result, text } = this.error

      return !result ? 'v-form-control--form-error' : 'v-form-control--form-success'
    }
  },
  methods: {
    submit() {
      this.$emit('submit', this.$formState.GET_RESULT())
      this.$formState.SUBMIT()
    },
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
    this.uniqueError = `error:${String(Math.random()).replace(/^.?\./, '')}`
  },
  mounted() {
    this.$formState.SET_FIELDS(this, {
      reactive: this.reactive,
      control: this.control
    })
  }
}
</script>

<style lang="scss">
	.v-form-control {
    background-color: #fff;
    border: 2px solid transparent;
		border-radius: 20px;
    box-shadow: 0 15px 25px rgba(0,0,0, .2);
    margin: auto;
    position: relative;

    &--form-error {
      animation: form-error .2s;
      border: 2px solid #FEB2B2;
      @keyframes form-error {
        0% { transform: translateX(30px); }
        33% { transform: translateX(-30px); }
        66% { transform: translateX(20px); }
        100% { transform: translateX(0); }
      }
    }
    &--form-success {
      border: 2px solid #d4edda;
    }
    &__global-error {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);

      &::before, &::after {
        content: '';
        position: absolute;
        clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
        transform: translateX(-50%);
      }
      &::before {
        width: 20px;
        height: 14px;
        left: 50%;
        top: 100%;
        background-color: #FEB2B2;
      }
      &::after {
        width: 18px;
        height: 13px;
        left: 50%;
        top: calc(100% - 2px);
        background-color: #FFF5F6;
      }
    }
	}

  .global-error {
    max-width: calc(100% - 20px);
    width: fit-content;
    border: 2px solid #FEB2B2;
    background-color: #FFF5F6;
    padding: 8px;
    border-radius: 8px;
  }

  .global-error-enter-active {
		animation: global-error-enter .1s;

		@keyframes global-error-enter {
			0% { opacity: 0; transform: translate(-50%, 30px); }
		}
	}
	.global-error-leave-active {
		animation: global-error-leave .1s;

		@keyframes global-error-leave {
			100% { opacity: 0; transform: translate(-50%, 30px); }
		}
	}
</style>