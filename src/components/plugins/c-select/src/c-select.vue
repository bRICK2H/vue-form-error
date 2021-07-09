<template>
	<div class="select-container"
		:style="setStyleToSelect"
		ref="select-container"
	>

		<!-- Select -->
		<div class="v-selected select-container__v-selected"
			:class="[
				{ 'v-selected--only': !disabled && !multiple || (!selected.length && !cloneOptions.length)},
				{ 'v-selected--raise': multiple && selected.length && raisePlaceholder },
				{ 'v-selected--active': isOpenSelect },
				{ 'v-selected--disabled': disabled },
				...getSelectClass
			]"
			:ref="uniqueselected"
			:tabindex="tabindex"
			@blur="globalBlur($event, 'select')"
			@keydown.enter="enterToFocus"
			@keydown.up.down.prevent="arrowToFocus($event)"
			@click="!multiple && !disabled ? toggleSelect() : false"
		>

			<transition name="placeholder">
				<span v-if="raisePlaceholder && selected.length || searchable && isOpenSelect && !selected.length"
					class="select-title v-selected__select-title"
					:style="{ maxWidth: width === 'auto' ? `calc(100% - 10px)` : `${width - 20}px` }"
				>
					{{ placeholder }}
				</span>
			</transition>

			<template v-if="!selected.length">
				<template v-if="searchable && isOpenSelect" />
				<p v-else
					class="select-placeholder v-selected__select-placeholder"
					:class="{ 'select-placeholder--empty': !selected.length }"
					key="title"
				>
					* {{ placeholder }}
				</p>
			</template>
			<template v-else-if="multiple || !multiple && !searchable || !multiple && searchable && !isOpenSelect">
				<div class="select-name v-selected__select-name"
					:class="[
						{ 'select-name--multiple': multiple },
						{ 'select-name--disabled-multiple': multiple && disabled },
						{ 'select-name--single-arrow': !multiple && !clearable },
						{ 'select-name--single-clearable': !multiple && clearable },
					]"
					v-for="(select, i) of selected"
					:key="`sl${i}`"
				>
					<span class="select-box-name select-name__select-box-name"
						:class="{
							'select-box-name--pale': !multiple && isOpenSelect,
							'select-box-name--single': !multiple && !clearable,
							'select-box-name--multiple': multiple,
							'select-box-name--mr': multiple && (!clearable && selected.length !== 1 || clearable)
						}"
						:title="JSON.stringify(innerReduce(select))"
					>
						<slot name="select"
							v-bind="select"
						>
							{{ innerReduce(select) }}
						</slot>
					</span>
					<div class="select-box-close select-name__select-box-close">
						<i-close v-if="multiple && (!clearable && selected.length !== 1 || clearable)"
							class="select-box-close__close"
							:class="[
								{ 'select-box-close__close--hover': !disabled },
								{ 'select-box-close__close--disabled': disabled }
							]"
							@click.native="!disabled ? drop(i, select) : false"
						/>
					</div>
				</div>
			</template>

			<!-- Multiple icon - add -->
			<template v-if="multiple">
				<i-add v-if="cloneOptions.length"
					class="multiple-add"
					:ref="uniqueadd"
					:class="[
						{ 'multiple-add--hover': !disabled && cloneOptions.length },
						{ 'multiple-add--disabled': disabled },
					]"
					@click.native="!disabled ? toggleSelect() : false"
					:tabindex="!isOpenSelect ? null : tabindex"
				/>
			</template>

			<!-- Single icons - delete/arrow -->
			<template v-else>
				<div class="v-selected__wrap-icons"
					:class="[
						{ 'v-selected__wrap-icons--has-item': selected.length && clearable },
						{ 'v-selected__wrap-icons--disabled': disabled }
					]"
				>
					<template v-if="clearable">
						<i-close v-if="selected.length"
							:class="{ 'single-close--hover': !disabled }"
							@click.native.stop="!disabled ? drop(0) : false"
						/>
						<i-hor-line v-if="selected.length" />
					</template>
					<i-arrow-down class="rotate-arraw-down"
						:class="[
							{ 'rotate-arraw-down--active': isOpenSelect },
							{ 'rotate-arraw-down--hover': !disabled },
						]"
					/>
				</div>
			</template>

			<!-- Searchable -->
			<input v-if="searchable && isOpenSelect"
				type="text"
				class="v-searchable"
				:class="[
					{ 'v-searchable--single-clearable': !multiple && clearable },
					{ 'v-searchable--default': !multiple && !selected.length }
				]"
				:ref="uniquesearch"
				:placeholder="
					multiple
						? ''
						: arrayElementType(selected.map(val => innerReduce(val))) === 'object'
							? JSON.stringify(selected.map(val => innerReduce(val)))
							: selected.map(val => innerReduce(val)).join(', ')
				"
				@blur="globalBlur($event, 'search')"
				@focus="searchFocus($event)"
				@click.stop=""
				v-model="inputSearch"
			>
		</div>

		<!-- Optiions -->
		<transition name="dropdown-list">
			<ul v-show="isOpenSelect" class="dropdown-list select-container__dropdown-list"
				:class="[...getOptinsClass, { 'dropdown-list--active': isOpenSelect }]"
				:style="[setStylesToDropDownList]"
				:ref="uniqueddl"
				:tabindex="tabindex"
			>
				<li v-if="!filterOptions.length" class="option-empty">
					<template v-if="inputSearch">
						Совпадений не найдено
					</template>
					<template v-else>
						Список элементов пуст
					</template>
				</li>

				<template v-else>
					<li class="option" :class="{ 'option--arrow': currOptionArrow === i + 1 }"
						v-for="(option, i) of filterOptions"
						:key="i"
						@mouseenter="hoverOption(i + 1)"
						@click="select(option)"
						:title="JSON.stringify(innerReduce(option))">

						<div class="option__name">
							<slot name="option" v-bind="option">
								{{ innerReduce(option) }}
							</slot>
						</div>
					</li>
				</template>
			</ul>
		</transition>
	</div>
</template>

<script>
	import iClose from './components/svg/close-svg'
	import iAdd from './components/svg/add-svg'
	import iArrowDown from './components/svg/arrow-down-svg'
	import iHorLine from './components/svg/hor-line-svg'

	export default {
		name: 'iziSelect',
		components: {
			iAdd,
			iClose,
			iHorLine,
			iArrowDown
		},
		props: {
			placeholder: {
				type: String,
				default: 'Добавить'
			},
			raisePlaceholder: {
				type: Boolean,
				default: false
			},
			value: null,
			options: {
				type: Array,
				default: () => ([])
			},
			reduce: {
				type: Function,
				default: option => option,
			},
			label: {
				type: String,
				default: 'label'
			},
			multiple: {
				type: Boolean,
				default: false
			},
			clearable: {
				type: Boolean,
				default: true
			},
			searchable: {
				type: Boolean,
				default: true
			},
			saveable: {
				type: Boolean,
				default: false,
			},
			disabled: {
				type: Boolean,
				default: false
			},
			width: {
				type: [String, Number],
				default: 'auto'
			},
			behavior: {
				type: Boolean,
				default: false
			},
			classes: {
				type: Array,
				default: () => ([])
			}
		},
		data: () => ({
			uniqueddl: `dropdown-list:${Math.random()}`,
			uniquesearch: `searchable:${Math.random()}`,
			uniqueselected: `selected:${Math.random()}`,
			uniqueadd: `add:${Math.random()}`,
			name: 'select',
			tabindex: 0,
			inputSearch: '',
			currOptionArrow: 1,
			selected: [],
			cloneOptions: [],
			currSelectCoords: {},
			active: true,
			isOpenSelect: false,
			isPermissionToUpdate: false,
		}),
		computed: {
			getSelectClass() {
				return this.classes.filter(curr => /^select-/.test(curr))
			},
			getOptinsClass() {
				return this.classes.filter(curr => /^option-/.test(curr))
			},
			setStylesToDropDownList() {
				const { top, left, width, height } = this.currSelectCoords

				return {
					width: `${width}px`,
					top: this.behavior
						? `${top + height - 2}px`
						: `${height - 2}px`,
					left: this.behavior
						? `${left}px`
						: 0
				}
			},
			setStyleToSelect() {
				return {
					width: this.width === 'auto' ? '100%' : `${+this.width}px`,
				}
			},
			defineValue() {
				return this.value === null || this.value === undefined
					? []
					: Array.isArray(this.value)
						? this.value
						: [this.value]
			},
			modifyOptions() {
				const isArrayOption = this.options.some(curr => Array.isArray(curr))
				return isArrayOption ? this.options.flat() : this.options
			},
			filterOptions() {
				return this.cloneOptions.filter(curr => {
					curr = 'label' in this.$options.propsData
						&& typeof curr === 'object'
						&& this.label in curr
							? curr[this.label] : curr

					return String(curr).toLowerCase()
						.includes(this.inputSearch.toLowerCase())
				})
			},
		},
		methods: {
			select(option) {
				this.$emit('option:before-create', option)
				this.multiple
					? this.selected.push(option)
					: this.selected.splice(0, 1, option)
				
				this.isPermissionToUpdate = true
				this.$emit('option:created', option)
			},
			drop(i, option) {
				this.setActiveSelect()

				this.$emit('option:before-delete', option)
				this.multiple
					? this.selected.splice(i, 1)
					: this.selected = []

				this.isPermissionToUpdate = true
				this.$emit('option:deleted', option)
			},
			enterToFocus() {
				this.toggleSelect()

				if (this.filterOptions.length && !this.isOpenSelect) {
					this.select(this.filterOptions[this.currOptionArrow - 1])
					this.currOptionArrow = 1
				}
			},
			arrowToFocus(e) {
				if (!this.isOpenSelect) return

				const { key } = e
				this.currOptionArrow += key === 'ArrowUp' ? -1 : 1
				
				if (this.currOptionArrow > this.filterOptions.length) {
					this.currOptionArrow = 1
				} else if (this.currOptionArrow <= 0) {
					this.currOptionArrow = this.filterOptions.length
				}

				this.$nextTick(() => {
					const ddl = this.$refs[this.uniqueddl]
					
					if (key === 'ArrowUp') {
						if (this.currOptionArrow === this.filterOptions.length) {
							ddl.scrollTop = this.filterOptions.length * ddl.firstChild.offsetHeight
						} else if (this.currOptionArrow * ddl.firstChild.offsetHeight <= ddl.scrollTop) {
							ddl.scrollTop -= ddl.firstChild.offsetHeight
						}
					} else {
						if (ddl.firstChild.offsetHeight * this.currOptionArrow > ddl.offsetHeight) {
							ddl.scrollTop += ddl.firstChild.offsetHeight
						} else if (this.currOptionArrow === 1) {
							ddl.scrollTop = 0
						}
					}
				})
			},
			hoverOption(index) {
				this.currOptionArrow = index
			},
			globalBlur(e, type) {
				const { relatedTarget } = e

				if (relatedTarget && relatedTarget.classList.contains('dropdown-list')) return
				if (type === 'select') {
					if (!this.searchable) {
						if (this.multiple
							&& this.$refs[this.uniqueadd]
							&& relatedTarget === this.$refs[this.uniqueadd].$el) return

						this.isOpenSelect = false
					}
				} else {
					if (this.searchable) {
						if (!this.saveable) {
							this.inputSearch = ''
						} else {
							this.$emit('search:blur', this.inputSearch)
						}
					}
					
					if (this.multiple) {
						if (this.$refs[this.uniqueadd]
							&& relatedTarget === this.$refs[this.uniqueadd].$el) return
					} else {
						if (relatedTarget === this.$refs[this.uniqueselected]) return
					}
					
					this.isOpenSelect = false
				}
			},
			searchFocus(e) {
				const { target } = e

				if (this.searchable) {
					if (this.saveable) {
						this.inputSearch = target.placeholder
					}

					this.$emit('search:focus', target.placeholder)
				}
			},
			innerReduce(el) {
				return typeof el === 'object' && this.label in el
					? el[this.label] : el
			},
			toggleSelect() {
				this.isOpenSelect = !this.isOpenSelect
			},
			setCurrSelectCoords() {
				const { top, left, width } = this.$refs[this.uniqueselected].getBoundingClientRect()
				const height = this.$refs[this.uniqueselected].offsetHeight
	
				this.$nextTick(() => {
					this.$set(this.currSelectCoords, 'top', top)
					this.$set(this.currSelectCoords, 'left', left)
					this.$set(this.currSelectCoords, 'width', width)
					this.$set(this.currSelectCoords, 'height', height)
				})
			},
			setActiveSelect() {
				this.$parent.$children.forEach(curr => {
					if (curr.name === 'select' && JSON.stringify(this.value) === JSON.stringify(curr.value)) {
						curr.active = this.multiple === curr.multiple
					}
				})
			},
			isChosenExist(value) {
				return JSON.stringify(this.getCurrIndices(value)) === JSON.stringify(this.getCurrIndices(this.selected))
			},
			arrayElementType(data) {
				const [el] = data
				return typeof el
			},
			updateOptions(selected) {
				const indices = this.getCurrIndices(selected)
				this.cloneOptions= this.modifyOptions.filter((c, i) => !indices.includes(i))
			},
			updateValue() {
				const indices = this.getCurrIndices(this.defineValue)

				this.selected = indices.length
					? this.modifyOptions.filter((c, i) => indices.includes(i))
					: this.defineValue
			},
			formatToReduce(data, numberToString = true) {
				if (this.arrayElementType(data) === 'object') {
					const result = data.map(curr => {
						return Object.entries(curr).reduce((acc, val) => {
							const [key, value] = val
							acc[key] = typeof value === 'number' && numberToString
								? String(value)
								: value

							return acc
						}, {})
					})

					return 'reduce' in this.$options.propsData
						? result.map(curr => this.reduce(curr))
						: result
				} else {
					return data.map(curr => {
						return  typeof curr === 'number' && numberToString
							? String(curr)
							: curr
					})
				}
			},
			getCurrIndices(value) {
				const _value = this.formatToReduce(value)
				const _options = this.formatToReduce(this.modifyOptions)

				return _options.reduce((acc, curr, i) => {
					if (_value.map(JSON.stringify).includes(JSON.stringify(curr))) {
							acc.push(i)
						} else {
							if (this.arrayElementType(_options) === 'object') {
								if (this.arrayElementType(_value) === 'object') {
									const sameKeys = Object.keys(curr).filter(key => {
										return _value.map(Object.keys).every(keys => {
											return keys.includes(key)
										})
									})
									
									if (sameKeys.length) {
										const _jsonValues = _value.map(val => {
											return JSON.stringify(sameKeys.reduce((a, c) => (a[c] = val[c], a), {}))
										})
										const _jsonOption = JSON.stringify(sameKeys.reduce((a, c) => (a[c] = curr[c], a), {}))

										if (_jsonValues.includes(_jsonOption)) acc.push(i)
									}

								} else {
									if (Object.keys(curr).some(key => _value.includes(curr[key]))) {
										acc.push(i)
									}
								}
							}
						}

					return acc
					
				}, [])
			},
		},
		watch: {
			value: {
				deep: true,
				handler() {
					if (!this.active) {
						this.selected = []
						return
					}

					if (!this.isChosenExist(this.defineValue)) {
						const indices = this.getCurrIndices(this.defineValue)
						this.selected = this.modifyOptions.filter((c, i) => indices.includes(i))
					}
				}
			},
			selected: {
				deep: true,
				handler(selected) {
					this.updateOptions(selected)

					if (this.active && this.isPermissionToUpdate) {
						const outerResult = this.formatToReduce(selected, false)

						this.$emit(
							'input',
							this.multiple
								? outerResult
								: outerResult.length
									? outerResult[0]
									: null
						)

						this.isOpenSelect = false
						this.isPermissionToUpdate = false
					}
				}
			},
			options: {
				deep: true,
				handler(options) {
					this.updateValue()
					this.updateOptions(this.selected)
				}
			},
			isOpenSelect(opened) {
				this.setActiveSelect()

				this.$nextTick(() => {
					this.setCurrSelectCoords()
				})

				if (this.behavior && opened) {
					const DOMLocalNames = Object.values(document.body.children).map(curr => curr.localName)

					if (!(DOMLocalNames.includes('drop-down-container'))) {
						const DOMRef = document.createElement('drop-down-container')
						document.body.appendChild(DOMRef)
					}

					const DropDownContainer = document.querySelector('drop-down-container')
					this.$refs[this.uniqueddl].setAttribute('unique-name', this.uniqueddl)
					DropDownContainer.appendChild(this.$refs[this.uniqueddl])
				}

				if (opened) {
					this.$emit('options:opened')
					if (this.searchable) {
						this.$nextTick(() => {
							this.$refs[this.uniquesearch].focus()
						})
					} else {
						this.$refs[this.uniqueselected].focus()
					}
				} else {
					this.$refs[this.uniqueselected].focus()
					this.$emit('options:closed')
				}
			},
			inputSearch(value) {
				this.$emit('search', value)
			}
		},
		created() {
			if (this.disabled) {
				this.tabindex = null
			}

			this.updateValue()

			if ('label' in this.$options.propsData && this.arrayElementType(this.defineValue) === 'object') {
				this.defineValue.forEach(curr => {
					if (!(this.label in curr)) {
						console.warn(`[izi-select]: Указанный ключ label="${this.label}" не найден в представленных ключах объекта ${JSON.stringify(curr)}.`)
					}
				})
			}
		},
		async mounted() {
			await this.$nextTick()
			this.setCurrSelectCoords()

			if (this.behavior && this.$refs['select-container']) {
				let start = true
				let startScroll = 0
				let primaryEl = this.$refs['select-container'].parentElement

				while (start) {
					primaryEl = primaryEl.parentElement
					const primaryElOverfow = getComputedStyle(primaryEl).overflow

					if (primaryEl.tagName === 'BODY') start = false
					if (['auto', 'scroll', 'hidden scroll'].includes(primaryElOverfow)) {
						primaryEl.addEventListener('scroll', e => {
							if (this.isOpenSelect && this.behavior) {
								this.setCurrSelectCoords()

								this.isOpenSelect = startScroll < e.target.scrollTop ? false : false
								startScroll = e.target.scrollTop
							}
						})

						start = false
					}
				}
			}
		},
		beforeDestroy() {
			if (this.behavior) {
				const DropDownContainer = document.querySelector('drop-down-container')

				if (DropDownContainer && DropDownContainer.children.length) {
					DropDownContainer.children.forEach(curr => {
						if (curr.getAttribute('unique-name') === this.uniqueddl) {
							DropDownContainer.removeChild(curr)
						}
					})
				}
			}
		},
	}
</script>

<style lang="scss">
	// @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;500&display=swap');

	.select-container * {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		// font-family: 'Inter', sans-serif;
	}

	.select-container {
		user-select: none;
		min-height: 44px;
		position: relative;
		border-radius: 8px;

		&__v-selected {
			position: relative;
			top: 0;
			left: 0;
			z-index: 1000;
		}

		&__dropdown-list {
			position: absolute;
			left: 0;
			z-index: 1000;
			background-color: #fff;
		}
	}

	.v-selected {
		width: 100%;
		min-height: 44px;
		background: #fff;
		border: 2px solid #eeedf7;
		border-radius: 8px;
		padding: 2px;
		color: #000;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;

		&:focus {
			outline: none;
		}

		&:focus-visible {
			border: 2px solid #c4c4c4;
		}

		&--raise {
			padding: 6px 2px 2px;
		}
		&--only {
			cursor: pointer;
		}

		&--active {
			border: 2px solid #c4c4c4;
			border-bottom: 2px solid transparent;
			border-bottom-left-radius: 0;
			border-bottom-right-radius: 0;
		}

		&--disabled {
			border: 2px solid #eeedf7;
			background: #fbfbff;
			cursor: no-drop;
		}

		&__select-name {
			margin: 1.5px;
		}

		&__wrap-icons {
			width: auto;
			position: absolute;
			top: 50%;
			right: 10px;
			transform: translateY(-50%);
			display: flex;
			justify-content: space-between;
			align-items: center;

			&--has-item {
				width: 60px;
				height: 80%;
				background: #fff;
			}
			&--disabled {
				opacity: .5;
			}
		}
	}

	.select-name {
		width: auto;
		height: 32px;
		font-size: 14px;
		font-weight: 500;
		color: #1F1F33;
		padding: 0 12px;
		display: flex;
		justify-content: flex-start;
		align-items: center;

		&--single-arrow {
			max-width: calc(100% - 20px);
		}
		&--single-clearable {
			max-width: calc(100% - 70px);
		}
		&--multiple {
			max-width: calc(100% - 4px);
			background: #F6F6FB;
			border-radius: 8px;

			&:last-of-type {
				max-width: calc(100% - 40px);
			}
		}
		&--disabled-multiple {
			background: #fbfbfb;
		}
	}

	.select-box-name {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		display: inline-block;

		&--multiple {
			width: auto;
			overflow: hidden;
		}
		&--pale {
			color: #b7b7cc;
		}
		&--mr {
			margin-right: 10px;
		}
	}

	.select-box-close {
		line-height: 0;

		&__close {

			&--hover {
				cursor: pointer;

				&:hover {
					filter: invert(.5)
				}
			}
			&--disabled {
				opacity: .5;
			}
		}
	}

	.select-title {
		display: block;
		font-size: 14px;
		background-color: #fff;
		color: #b7b7cc;
		padding: 0 10px;
		position: absolute;
		top: -11px;
		left: 15px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.select-placeholder {
		padding: 0 2px 0 6px;
		color: #b7b7cc;
		font-weight: 300;

		&--empty {
			width: calc(100% - 40px);
			display: block;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	.v-searchable {
		min-width: 30px;
		max-width: calc(100% - 30px);
		width: 40px;
		height: 30px;
		flex: 1 1 auto;
		font-size: 14px;
		font-weight: normal;
		padding: 0 13.5px;
		border: none;
		outline: none;

		&::placeholder {
			font-size: 14px;
			font-weight: normal;
			color: #b7b7cc;
		}
		&--single-clearable {
			max-width: calc(100% - 70px);
		}
		&--default {
			max-width: calc(100% - 30px);
		}
	}

	.dropdown-list {
		// font-family: 'Inter', sans-serif;
		width: 100%;
		max-height: 285px;
    	overflow: auto;
		border: 2px solid #eeedf7;
		border-top: none;
		padding-top: 3px;
		border-bottom-right-radius: 8px;
		border-bottom-left-radius: 8px;
		color: #000;
		display: flex;
		flex-direction: column;
		box-shadow: 0 8px 7px -7px #828282;

		&--active {
			border: 2px solid #c4c4c4;
			border-top: none;
			z-index: 1110;
		}
	}

	.option,
	.option-empty {
		position: relative;
		list-style: none;
		cursor: pointer;
		padding: 10px 0;
	}

	.option-empty {
		font-size: 14px;
		text-align: center;
	}

	.option {
		padding: 20px 0;
		text-align: left;

		&--arrow {
			background: linear-gradient(#fff, #c4c4c4);
			font-weight: 600;
		}

		&__name {
			width: 100%;
			height: auto;
			display: inline-block;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			text-align: center;
			padding: 0 10px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	.multiple-add {
		outline: none;

		&--disabled {
			opacity: .5;
		}

		&--hover {
			cursor: pointer;

			&:hover {
				filter: invert(.03);
			}
		}
	}

	.rotate-arraw-down {
		transform: rotate(0);
		transition: 0.2s ease-out;

		&--active {
			transform: rotate(-180deg);
		}
		&--hover {
			&:hover {
				filter: invert(.5)
			}
		}
	}

	.single-close {
		&--hover {
			&:hover {
				filter: invert(.5)
			}
		}
	}

	.placeholder-enter-active {
		animation: open-placeholder .2s;

		@keyframes open-placeholder {
			0% { transform: perspective(100px) rotateX(-90deg) }
			100% { transform: perspective(100px) rotateX(0); }
		}
	}
	.placeholder-leave-active {
		animation: close-placeholder .2s;

		@keyframes close-placeholder {
			100% { transform: perspective(100px) rotateX(-90deg); }
		}
	}

	.dropdown-list-enter-active {
		animation: open-list .4s;

		@keyframes open-list {
			0% {
				opacity: 0;
				transform: translateX(50px);
			}
			20% {
				box-shadow: 0 3px 7px #fff;
			}
			100% {
				opacity: 1;
			}
		}
	}

	.dropdown-list-leave-active {
		animation: hide-list .4s;

		@keyframes hide-list {
			40% {
				box-shadow: 0 3px 7px #fff;
			}
			100% {
				opacity: 0;
				transform: translateY(100px);
				z-index: 1111;
			}
		}
	}
</style>