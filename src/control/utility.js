export const SET_STYLE = (el, styles) => {
	for (const e of el) {
		for (let prop in styles) {
			e.style[prop] = styles[prop]
		}
	}
}
export const DROP_STYLE = el => {
	for (const e of el) {
		e.style = ''
	}
}