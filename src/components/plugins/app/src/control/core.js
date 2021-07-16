import VOverField from '../components/v-over-field'
import { CHECK_ELEMENT, SET_STYLE } from './utility'

export default {
	install(Vue) {
		class FormState {
			constructor() {
				this.fields = []
				this.options = {}
				this.vm = new Vue
			}

			SET_FIELDS(data, options) {
				const fields = data.$children.filter(curr => curr.name === 'v-over-field')
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
				const { uid, status, text, error } = currError,
						{ control: { errors } } = this.options,
						exist_error = errors.find(err => err.uid === uid),
						index_error = errors.findIndex(err => err.uid === uid),
						curr_instance = this.GET_CURR_FIELD(uid),
						order = curr_instance.order

						
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
						errors.splice(index_error)
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

			SUBMIT_ACTIVE_FIELD() {
				const { control: { errors } } = this.options,
					uid = errors.length ? errors[0].uid : null

				if (!uid) return

				this.fields.forEach(curr => {
					curr.currCountError = 1
					curr.active = curr.uid === uid
				})
			}

			SET_ERROR_STYLE(ref) {
				const error_styles = {
					outline: 'none',
					borderRadius: '8px',
					border: '2px solid #FEB2B2'
				}

				ref.classList.contains('select-container')
					? SET_STYLE(ref.firstChild, error_styles)
					: SET_STYLE(ref, error_styles)
			}

			DELETE_ERROR_STYLE(ref) {
				ref.classList.contains('select-container')
					? CHECK_ELEMENT(ref.firstChild).style = ''
					: CHECK_ELEMENT(ref).style = ''
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

			GET_RESULT() {
				const keys = ['uid', 'value', 'verification']
				const { control } = this.options
				const validated = this.fields.every(curr => curr.currControl.error === false)
				const data = this.fields.reduce((acc, curr) => {
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
			
			SUBMIT() {
				this.fields.forEach(curr => {
					curr.reactiveMode = true
					curr.checkField(true)
				})

				this.SUBMIT_ACTIVE_FIELD()
			}
		}
		
		Vue.prototype.$formState = new FormState
		Vue.component('VOverField', VOverField)
	}
}