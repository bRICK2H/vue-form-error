import VOverField from '../components/v-over-field'
import VFormSubmit from '../components/v-form-submit'
import { DROP_STYLE, SET_STYLE } from './utility'

export default {
	install(Vue) {
		class FormState {
			constructor() {
				this.forms = []
				this.fields = []
				this.buttons = []
				this.prev_new_fields = []
				this.options = {}
				this.vm = new Vue
			}

			INIT_FORM(form_instance) {
				const { uid } = form_instance
				
				if (!this.forms.length || !this.forms.some(curr => curr.uid === uid)) {
					this.forms.push(form_instance)
				}
				
				this.SET_ACTIVE_FORM(uid)
			}

			SET_ACTIVE_FORM(uid) {
				this.forms.forEach(curr => curr.active = curr.uid === uid)
			}

			CLOSED_FORM(uid, options) {
				const form_alive = this.forms.filter(curr => curr.alive)
				const closed_index = this.forms.findIndex(curr => curr.uid === uid)

				this.forms.splice(closed_index, 1)

				if (form_alive.length) {
					const form_alive_uid = form_alive[form_alive.length - 1].uid
					this.SET_ACTIVE_FORM(form_alive_uid)
					this.SET_FIELDS(form_alive[form_alive.length - 1], options)
				}
			}

			UPDATE_FIELDS(form_instance) {
				const { control: { errors } } = this.options,
					curr_fields = this.GET_FIELDS(),
					updated_fields = form_instance.$children.filter(c => c.name === 'v-over-field'),
					diff = !updated_fields.every(n => this.fields.map(f => f.uid).includes(n.uid))

				if (diff) {
					const new_fields = updated_fields.filter(curr => !(curr_fields.map(c => c.uid).includes(curr.uid)))

					if (this.prev_new_fields.length && errors.length) {
						this.prev_new_fields.forEach(curr => {
							const err_index = errors.findIndex(c => c.uid === curr.uid)

							if (err_index !== -1) {
								this.vm.$delete(errors, err_index)
							}

						})
					}
					
					this.prev_new_fields = new_fields
				}
				
			}

			SET_FIELDS(form_instance, options) {
				const fields = form_instance.$children.filter(curr => curr.name === 'v-over-field')
				this.options = { ...options }

				fields.forEach((curr, i) => {
					Object.entries(options).forEach(opt => {
						const [name, value] = opt
						curr[name] = value
						curr.order = i + 1
					})
				})

				this.fields = fields
			}

			SET_ERROR(currError) {
				const { uid, status, text, error } = currError
					,	{ control: { errors } } = this.options
					,	exist_error = errors.find(err => err.uid === uid)
					,	index_error = errors.findIndex(err => err.uid === uid)
					,	curr_instance = this.GET_CURR_FIELD(uid)
					, 	order = curr_instance ? curr_instance.order : 0

				if (error) {
					if (exist_error === undefined) {
						errors.push({ uid, status, text, order })
					} else {
						errors.splice(
							index_error, 1,
							{ uid, status, text, order }
						)
					}
				} else {
					if (exist_error) {
						errors.splice(index_error, 1)
					}
				}
				
				if (errors.length > 1) {
					errors.sort((a, b) => a.order - b.order)
				}
			}

			SET_ACTIVE_FIELD(uid) {
				this.fields.forEach(curr => {
					const { control: { errors } } = this.options,
					index = errors.findIndex(curr => curr.uid === uid)

					curr.currCountError = index + 1
					curr.active = curr.uid === uid
				})
			}

			MOVE_ACTIVE_FIELD(counter) {
				const { control: { errors } } = this.options,
					uid = errors[counter - 1].uid

				this.fields.forEach(curr => {
					curr.active = curr.uid === uid
				})
			}

			SUBMIT_ACTIVE_FIELD(fields) {
				const { control: { errors } } = this.options,
					uid = errors.length ? errors[0].uid : null

				if (!uid) return

				fields.forEach(curr => {
					curr.currCountError = 1
					curr.active = curr.uid === uid
				})
			}

			SET_ERROR_STYLE(uniqueField, uid, raduis) {
				const error_styles = {
					outline: 'none',
					borderRadius: `${raduis}px`,
					border: '2px solid #FEB2B2'
				}
				const el_error = document.querySelectorAll(`.${uid}`)
				
				el_error.length
					? SET_STYLE(el_error, error_styles)
					: SET_STYLE([uniqueField], error_styles)
			}

			DELETE_ERROR_STYLE(uniqueField, uid) {
				const el_error = document.querySelectorAll(`.${uid}`)

				el_error.length
					? DROP_STYLE(el_error)
					: DROP_STYLE([uniqueField])
			}
			
			GET_FIELDS() {
				return this.fields
			}

			GET_CURR_FIELD(uid) {
				return this.fields.find(curr => curr.uid === uid)
			}

			GET_INDEX_FIELD(uid) {
				return this.fields.findIndex(curr => curr.uid === uid)
			}

			GET_AMOUNT_ERRORS() {
				if (!Object.keys(this.options).length) return
				const { control: { errors } } = this.options

				return errors.length
			}

			GET_RESULT(fields) {
				const keys = ['uid', 'value', 'verification']
				const { control } = this.options
				const validated = fields.every(curr => curr.currControl.error === false)
				const data = fields.reduce((acc, curr) => {
					acc.push(keys.reduce((a, key) => (a[key] = curr[key], a), {}))
					return acc
				}, [])

				return {
					validated,
					control,
					data
				}
			}

			SYNC_COUNT_ERROR(counter) {
				this.fields.forEach(curr => {
					curr.currCountError = counter
				})
			}

			CLOSE_ERROR(uid) {
				this.GET_CURR_FIELD(uid).active = false
			}

			IS_LAST_COUNTER(curr, max, side) {
				return side === 'left'
					? curr === 1
					: side === 'right' && curr === max
			}
			
			SUBMIT(fields) {
				fields.forEach(curr => {
					curr.reactiveMode = true
					curr.checkField(true)
				})

				this.SUBMIT_ACTIVE_FIELD(fields)
			}

			SET_BUTTON(button, uid) {
				if (!this.buttons.length || !this.buttons.some(curr => curr.uid === uid)) {
					this.buttons.push(button)
				}
			}

			DROP_BUTTON(uid) {
				const curr_button_index = this.buttons.findIndex(curr => curr.uid === uid)
				this.buttons.splice(1, curr_button_index)
			}

			TRIGGER_SUBMIT(uid) {
				const curr_button = this.buttons.find(curr => curr.uid === uid)
	
				if (this.buttons.length && curr_button) {
					curr_button.handler()
				}
			}
		}
		
		Vue.prototype.$formState = new FormState
		Vue.component('VOverField', VOverField)
		Vue.component('VFormSubmit', VFormSubmit)
	}
}