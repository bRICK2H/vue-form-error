<template>
  <div class="v-form-control"
    :class="[classes, setErrorForm]"
    :style="setFormStyles"
    @mouseup="$formState.SET_ACTIVE_FORM(uid)"
  >
    <span v-if="buttonClose"
      class="v-form-close v-form-control__v-form-close"
      @click="$emit('closed')"
    ></span>
  
      <p class="global-error v-form-control__global-error"
        v-if="error && error.result && error.text"
        :ref="uniqueError"
        :style="{ top: `calc(0% - ${errorHeight + 20}px)` }"
      >
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
    classes: {
      type: Array,
      default: () => ([])
    },
    buttonClose: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    uniqueError: null,
    errorHeight: null,
    active: false,
    alive: true
  }),
  computed: {
    setFormStyles() {
      return {
        width: this.width === 'auto' ? 'auto' : `${this.width}px`,
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
    async error(val) {
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
      left: 0;

      &::before, &::after {
        content: '';
        position: absolute;
        clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
      }
      &::before {
        width: 20px;
        height: 14px;
        left: 15px;
        top: 100%;
        background-color: #feb2b2;
      }
      &::after {
        width: 18px;
        height: 13px;
        left: 16px;
        top: calc(100% - 2px);
        background-color: #FFF5F6;
      }
    }
    &__v-form-close {
			position: absolute;
			top: 15px;
			right: 15px;
    }
	}

  .global-error {
    max-width: calc(100% - 100px);
    width: fit-content;
    border: 2px solid #feb2b2;
    background-color: #fff5f6;
    padding: 8px;
    border-radius: 8px;
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
</style>