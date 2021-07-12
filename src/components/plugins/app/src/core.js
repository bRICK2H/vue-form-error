import vOverField from './components/v-over-field'

export default {
	install(Vue) {
		class FormState {
			constructor() {
				this.fields = []
				this.options = {}
				this.vm = new Vue
			}

			SET_FIELDS(data, options) {
				this.options = { ...options }

				data.$children.forEach(curr => {
					Object.entries(options).forEach(opt => {
						const [name, value] = opt
						curr.$data[name] = value
					})
				})

				this.fields = data.$children
			}

			SET_ERROR(currError) {
				const { id, status, text, error } = currError,
						{ control: { errors } } = this.options,
						exist_error = errors.find(err => err.id === id),
						index_error = errors.findIndex(err => err.id === id)

				if (error) {

					if (exist_error === undefined) {
						errors.push({ id, status, text })
					} else {
						errors.splice(
							index_error, 1,
							{ id, status, text }
						)
					}

				} else {
					if (exist_error) {
						errors.splice(index_error)
					}
				}

				if (errors.length > 1) {
					errors.sort((a, b) => a.id - b.id)
				}
			}
			SET_ACTIVE_FIELD(id, send) {
				this.fields.forEach((curr, i) => {
					if (send) {
						this.vm.$set(curr, 'active', i === 0)
					} else {
						this.vm.$set(curr, 'active', curr.id === id)
					}
				})
			}

			SET_ERROR_STYLE(ref) {
				const error_styles = {
					border: '2px solid #FEB2B2',
    				borderRadius: '8px',
					outline: 'none'
				}

				const set_style = (el, styles) => {
					for (let prop in styles) {
						el.style[prop] = styles[prop]
					}
				}

				ref.classList.contains('select-container')
					? set_style(ref.firstChild, error_styles)
					: set_style(ref, error_styles)
			}

			DELETE_ERROR_STYLE(ref) {
				ref.classList.contains('select-container')
					? ref.firstChild.style = ''
					: ref.style = ''
			}
			
			GET_FIELDS() {
				return this.fields
			}
			
			GET_CURR_FIELD(id) {
				return this.fields.find(curr => curr.id === id)
			}

			GET_AMOUNT_ERRORS() {
				const { control: { errors } } = this.options

				return errors.length
			}
			
			SUBMIT() {
				this.fields.forEach(curr => {
					curr.$data.reactiveMode = true
					curr.checkField(true)
				})
			}
		}
		
		Vue.prototype.$formState = new FormState
		Vue.component('vOverField', vOverField)
	}
}