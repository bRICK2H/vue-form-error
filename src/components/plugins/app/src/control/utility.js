export const CHECK_ELEMENT = el => {
	const collection_tags = ['label']

	return collection_tags.includes(el.tagName.toLowerCase())
		? el.nextElementSibling
		: el
}

export const SET_STYLE = (el, styles) => {
	const element = CHECK_ELEMENT(el)

	for (let prop in styles) {
		element.style[prop] = styles[prop]
	}

}