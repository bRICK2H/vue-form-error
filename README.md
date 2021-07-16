# izi-form-control

## VFormControl config:
| Name 				| Type 					| Default 													| Description 													|
| ---- 				| :--: 					| :-----: 												  	| --------------- 											|
| reactive 			| `Boolean`				| **false** 												| Реактивно обрабатывать ошибки для каждого поля	|
| error 				| `Object`				| **{ result: null, text: '' }** 					| Обработка общих ошибок с сервера						|
| control 			| `Object`				| **{ errors: [ ], info: [ ], warnings: [ ] }** | Результат обработки ошибок, предупреждений 		|
| width 				| `[Number, String]` | **auto** 													| Ширина формы 												|
| height 			| `[Number, String]` | **auto** 													| Высота формы 												|
| padding 			| `[Number, String]` | **'40 80'** 												| Padding формы 												|
| classes 			| `Array` 				| **[ ]**   												| Массив классов 												|

## VOverField events:
```js
	// При отправки получаем объект данных:
	$emit('submit', {
		validated, // итоговая валидация всех полей
		control, // дополнительная ссылка на ошибки и предупрежения
		data // текущие данные и настройки
	})
```

## VOverField config (дочерняя обертка для полей):
| Name 				| Type 					| Default 				| Description 																											|
| ---- 				| :--: 					| :-----: 				| --------------- 																									|
| uid 				| `[Number, String]` | -						| Уникальный ключ, обязательный параметр																		|
| verification 	| `Array`				| **['required']** 	| Условия валидации текущего поля, существующие валидации ['required', 'phone', 'password'] 	|
| value 				| `any`					| **null** 				| Текущее, изменяемое значение																								|
| position 			| `String` 				| **'bottom'** 		| Выбор позиции окна ошибок, по умолчанию с низу bottom или top 										|
| classes 			| `Array` 				| **[ ]**   			| Массив классов 																										|

## Example:
```html
<VFormControl
  :reactive="true"
  :width="500"
  :height="550"
  :classes="['form-control']"
  @submit="submitData"
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
	
	<button>Send</button>
</VFormControl>
```
