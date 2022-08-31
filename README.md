# izi-form-control
```js
main.js

import VFormControl from 'your path'
Vue.component('VFormControl', VFormControl)
```

## VFormControl config:
| Name 				| Type 					| Default 													| Description 																		|
| ---- 				| :--: 					| :-----: 												  	| --------------- 																|
| uid 				| `[Number, String]` | -															| Уникальный ключ, обязательный параметр									|
| reactive 			| `Boolean`				| **false** 												| Реактивно обрабатывать ошибки для каждого поля						|
| popub 				| `Boolean`				| **true** 													| Выводить ошибки в pupub режиме												|
| error 				| `Object`				| **{ result: null, text: '' }** 					| Обработка общих ошибок с сервера											|
| control 			| `Object`				| **{ errors: [ ], info: [ ], warnings: [ ] }** | Результат обработки ошибок, предупреждений 							|
| width 				| `[Number, String]` | **auto** 													| Ширина формы 																	|
| maxWidth 			| `[Number, String]` | **none** 													| Максимальная ширина формы 													|
| height 			| `[Number, String]` | **auto** 													| Высота формы 																	|
| padding 			| `[Number, String]` | **'40 80'** 												| Padding формы 																	|
| formStyle			| `Boolean`				| **true** 													| Подключить стили формы														|
| classes 			| `Array` 				| **[ ]**   												| Массив классов 																	|
| position 			| `String` 				| **'bottom'** 											| Выбор позиции окна ошибок, по умолчанию с низу bottom или top 	|

## VOverField config (дочерняя обертка для полей):
| Name 				| Type 					| Default 				| Description 																																								|
| ---- 				| :--: 					| :-----: 				| --------------- 																																						|
| uid 				| `[Number, String]` | -						| Уникальный ключ, обязательный параметр																															|
| verification 	| `Array`				| **['required']** 	| Условия валидации текущего поля, существующие: ['required', 'min', 'max', 'email', 'phone', 'samePassword', 'digit', 'string'] 	|
| info			 	| `String`				| **''** 				| Вывод информации (работает пока для режема popub: false)																									|
| success		 	| `String`				| **''** 				| Информирование о правильном формате записи (работает пока для режема popub: false) 																|
| value 				| `any`					| **null** 				| Текущее, изменяемое значение																																		|
| position 			| `String` 				| **'bottom'** 		| Выбор позиции окна ошибок, по умолчанию с низу bottom или top 																							|
| width 				| `[Number, String]`	| **'auto'**	 		| Высота поля																																								|
| margin 			| `[Number, String]`	| **0**	 				| margin поля																																								|
| radius 			| `[Number, String]`	| **8**	 				| Радиус границ поля																																						|
| classes 			| `Array` 				| **[ ]**   			| Массив классов 																																							|

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
	  uid="name"
	  :value="name"
	  :verification="['name', { name: 'min', text: `Имя не должен быть меньше ${data.max}` }]"
	  position="top"
	>
	  <input class="input" type="text" v-model="login">
  	</VOverField>
	  
	<VOverField
	  uid="login"
	  :value="login"
	  :verification="['phone', { name: 'required', text: 'Поле не может быть пустым!' }]"
	  position="top"
	>
	  <input class="input" type="text" v-model="login">
  	</VOverField>
	  
	<VOverField
	  uid="price"
	  :value="price"
	  :verification="[{ name: 'min', min: 0, text: 'Цена не может быть 0-я', type: 'number' }]"
	  position="top"
	>
	  <input class="input" type="text" v-model="price">
  	</VOverField>

	<VOverField
	  :uid="password"
	  :value="password"
	  :verification="['required', { name: 'min', min: 6 }]"
	>
	  <input class="input" type="text" v-model="password">
	</VOverField>
	<VOverField
	  :uid="password2"
	  :value="password2"
	  :verification="['required', { name: 'min', min: 6 }, { name: 'samePassword', password: passwordValue }]"
	>
	  <input class="input" type="text" v-model="password2">
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
