# izi-form-control
```js
main.js

import VFormControl from 'your path'
Vue.component('VFormControl', VFormControl)
```

## VFormControl config:
| Name 				| Type 					| Default 													| Description 													|
| ---- 				| :--: 					| :-----: 												  	| --------------- 											|
| uid 				| `[Number, String]` | -															| Уникальный ключ, обязательный параметр				|
| reactive 			| `Boolean`				| **false** 												| Реактивно обрабатывать ошибки для каждого поля	|
| error 				| `Object`				| **{ result: null, text: '' }** 					| Обработка общих ошибок с сервера						|
| control 			| `Object`				| **{ errors: [ ], info: [ ], warnings: [ ] }** | Результат обработки ошибок, предупреждений 		|
| width 				| `[Number, String]` | **auto** 													| Ширина формы 												|
| height 			| `[Number, String]` | **auto** 													| Высота формы 												|
| padding 			| `[Number, String]` | **'40 80'** 												| Padding формы 												|
| classes 			| `Array` 				| **[ ]**   												| Массив классов 												|
| buttonClose 		| `Boolean` 			| **false**   												| Показывать иконку закрытия формы						|

## VFormControl events:
```js
	// Если показана иконка закрытия формы, при нажатии возвращается emit - closed
	$emit('closed')
```

## VOverField config (дочерняя обертка для полей):
| Name 				| Type 					| Default 				| Description 																															|
| ---- 				| :--: 					| :-----: 				| --------------- 																													|
| uid 				| `[Number, String]` | -						| Уникальный ключ, обязательный параметр																						|
| verification 	| `Array`				| **['required']** 	| Условия валидации текущего поля, существующие: ['required', 'phone', 'password', 'digit', 'string'] 	|
| value 				| `any`					| **null** 				| Текущее, изменяемое значение																									|
| position 			| `String` 				| **'bottom'** 		| Выбор позиции окна ошибок, по умолчанию с низу bottom или top 														|
| classes 			| `Array` 				| **[ ]**   			| Массив классов 																														|

<!-- 
	Важно, для объводки полей с ошибками!
	Для того, что бы объвести конкретные поля, нужно в класс этого поля передать название uid текущего over-field
	иначе, будет объводиться весь over-field
 -->

 ## Example
 ```html
<VFormControl
  ...
>
  <VOverField
	  uid="auth"
	  ...
	>
	  <input class="input" type="text" v-model="login" class="auth">
  	</VOverField>
</VFormControl>
 ```

## VFormSubmit config (кнопка события submit / обработчик полей):
| Name 				| Type 					| Default 			| Description 										|
| ---- 				| :--: 					| :-----: 			| --------------- 								|
| uid 				| `[Number, String]` | -					| Уникальный ключ, обязательный параметр	|
| label 				| `String` 				| **'Войти'**		| Название кнопки									|
| width 				| `[String, Number]` | **'auto'**		| Ширина												|
| height 			| `[String, Number]` | **'auto'**		| Высота												|
| padding 			| `String` 				| **'16 0'**		| Высота												|
| color 				| `String` 				| **'#fff'**		| Цвет шрифта										|
| bColor 			| `String` 				| **'#1f1f33'**	| Цвет фона											|
| bHover 			| `String` 				| **'#a2a2b9'**	| Цвет фона при наведении						|
| isFetching 		| `Boolean` 			| **false**			| Отправлен ли заппрос на сервер				|
| disabled 			| `Boolean` 			| **false**			| Заблокировать кнопку							|

## VFormSubmit events:
```js
	// При отправки получаем объект данных:
	$emit('submit', {
		validated, // итоговая валидация всех полей
		control, // дополнительная ссылка на ошибки и предупрежения
		data // текущие данные и настройки
	})
```

## Example:
```html
<!-- Именя компонентов VOverField и VFormSubmit неизменямы, т.е. использовать можно только это название,
менять можно только натации PascalCase либо cebab-case в шаблоне -->

<VFormControl
  :reactive="true"
  :width="500"
  :height="550"
  :classes="['form-control']"
>
	<VOverField
	  uid="auth"
	  :value="login"
	  :verification="[{ name: 'required', text: 'Поле не может быть пустым!' }, 'phone']"
	  position="top"
	>
	  <input class="input" type="text" v-model="login">
  	</VOverField>

	<VOverField
	  :uid="password"
	  :value="password"
	  :verification="['required', { name: 'password', max: 6 }]"
	>
	  <input class="input" type="text" v-model="password">
	</VOverField>

	<VOverField
	  :uid="select"
	  :value="select"
	  :verification="['required']"
	>
	  <izi-select
	    width="300"
	    v-model="select"
	    :options="options"
	    :multiple="true"
	  />
	</VOverField>
	
	<VFormSubmit @submit="send" />
</VFormControl>

...
{
  methods: {
	send(result) {
	 	const { validated } = result
	 	if (validated) {
		 	...
	 	}
	}
  }
}
...

```
