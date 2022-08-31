export const SET_STYLE = (el, styles) => {
	for (const e of el) {
		for (let prop in styles) {
			e.style[prop] = styles[prop]
		}
	}
}
export const DROP_STYLE = el => {
	const error_styles = [
		'outline',
		'borderRadius',
		'border'
	]
	
	for (const e of el) {
		for (const prop of error_styles) {
			e.style[prop] = ''
		}
	}
}