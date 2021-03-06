//var isMobile = { Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };

//let btn = document.querySelectorAll('button[type="submit"],input[type="submit"]');
let forms = document.querySelectorAll('form');
if (forms.length > 0) {
	for (let index = 0; index < forms.length; index++) {
		const el = forms[index];
		el.addEventListener('submit', form_submit);
	}
}
function form_submit(e) {
	let btn = event.target;
	let form = btn.closest('form');
	let message = form.getAttribute('data-message');
	let error = form_validate(form);

	if (error == 0) {
		//SendForm
		form_clean(form);
		if (message) {
			popup_open('message-' + message);
			e.preventDefault();
		}
	} else {
		let form_error = form.querySelectorAll('._error');
		if (form_error && form.classList.contains('_goto-error')) {
			_goto(form_error[0], 1000, 50);
		}
		event.preventDefault();
	}
}

function form_validate(form) {
	let error = 0;
	let form_req = form.querySelectorAll('._req');
	if (form_req.length > 0) {
		for (let index = 0; index < form_req.length; index++) {
			const el = form_req[index];
			if (!_is_hidden(el)) {
				error += form_validate_input(el);
			}
		}
	}
	return error;
}
function form_validate_input(input) {
	let error = 0;
	let input_g_value = input.getAttribute('data-value');

	if (input.getAttribute("name") == "email" || input.classList.contains("_email")) {
		if (input.value != input_g_value) {
			let em = input.value.replace(" ", "");
			input.value = em;
		}
		if (email_test(input) || input.value == input_g_value) {
			form_add_error(input);
			error++;
		} else {
			form_remove_error(input);
		}
	} else if (input.getAttribute("type") == "checkbox" && input.checked == false) {
		form_add_error(input);
		error++;
	} else {
		if (input.value == '' || input.value == input_g_value) {
			form_add_error(input);
			error++;
		} else {
			form_remove_error(input);
		}
	}
	return error;
}
function form_add_error(input) {
	input.classList.add('_error');
	input.parentElement.classList.add('_error');

	let input_error = input.parentElement.querySelector('.form__error');
	if (input_error) {
		input.parentElement.removeChild(input_error);
	}
	let input_error_text = input.getAttribute('data-error');
	if (input_error_text && input_error_text != '') {
		input.parentElement.insertAdjacentHTML('beforeend', '<div class="form__error">' + input_error_text + '</div>');
	}
}
function form_remove_error(input) {
	input.classList.remove('_error');
	input.parentElement.classList.remove('_error');

	let input_error = input.parentElement.querySelector('.form__error');
	if (input_error) {
		input.parentElement.removeChild(input_error);
	}
}
function form_clean(form) {
	let inputs = form.querySelectorAll('input,textarea');
	for (let index = 0; index < inputs.length; index++) {
		const el = inputs[index];
		el.parentElement.classList.remove('_focus');
		el.classList.remove('_focus');
		el.value = el.getAttribute('data-value');
	}
	let checkboxes = form.querySelectorAll('.checkbox__input');
	if (checkboxes.length > 0) {
		for (let index = 0; index < checkboxes.length; index++) {
			const checkbox = checkboxes[index];
			checkbox.checked = false;
		}
	}
	let selects = form.querySelectorAll('select');
	if (selects.length > 0) {
		for (let index = 0; index < selects.length; index++) {
			const select = selects[index];
			const select_default_value = select.getAttribute('data-default');
			select.value = select_default_value;
			select_item(select);
		}
	}
}

let viewPass = document.querySelectorAll('.form__viewpass');
for (let index = 0; index < viewPass.length; index++) {
	const element = viewPass[index];
	element.addEventListener("click", function (e) {
		if (element.classList.contains('_active')) {
			element.parentElement.querySelector('input').setAttribute("type", "password");
		} else {
			element.parentElement.querySelector('input').setAttribute("type", "text");
		}
		element.classList.toggle('_active');
	});
}


//Select
let selects = document.getElementsByTagName('select');
if (selects.length > 0) {
	selects_init();
}
function selects_init() {
	for (let index = 0; index < selects.length; index++) {
		const select = selects[index];
		select_init(select);
	}
	//select_callback();
	document.addEventListener('click', function (e) {
		selects_close(e);
	});
	document.addEventListener('keydown', function (e) {
		if (e.which == 27) {
			selects_close(e);
		}
	});
}
function selects_close(e) {
	const selects = document.querySelectorAll('.select');
	if (!e.target.closest('.select')) {
		for (let index = 0; index < selects.length; index++) {
			const select = selects[index];
			const select_body_options = select.querySelector('.select__options');
			select.classList.remove('_active');
			_slideUp(select_body_options, 100);
		}
	}
}
function select_init(select) {
	const select_parent = select.parentElement;
	const select_modifikator = select.getAttribute('class');
	const select_selected_option = select.querySelector('option:checked');
	select.setAttribute('data-default', select_selected_option.value);
	select.style.display = 'none';

	select_parent.insertAdjacentHTML('beforeend', '<div class="select select_' + select_modifikator + '"></div>');

	let new_select = select.parentElement.querySelector('.select');
	new_select.appendChild(select);
	select_item(select);
}
function select_item(select) {
	const select_parent = select.parentElement;
	const select_items = select_parent.querySelector('.select__item');
	const select_options = select.querySelectorAll('option');
	const select_selected_option = select.querySelector('option:checked');
	const select_selected_text = select_selected_option.text;
	const select_type = select.getAttribute('data-type');

	if (select_items) {
		select_items.remove();
	}

	let select_type_content = '';
	if (select_type == 'input') {
		select_type_content = '<div class="select__value icon-select-arrow"><input autocomplete="off" type="text" name="form[]" value="' + select_selected_text + '" data-error="Ошибка" data-value="' + select_selected_text + '" class="select__input"></div>';
	} else {
		select_type_content = '<div class="select__value icon-select-arrow"><span>' + select_selected_text + '</span></div>';
	}

	select_parent.insertAdjacentHTML('beforeend',
		'<div class="select__item">' +
		'<div class="select__title">' + select_type_content + '</div>' +
		'<div class="select__options">' + select_get_options(select_options) + '</div>' +
		'</div></div>');

	select_actions(select, select_parent);
}
function select_actions(original, select) {
	const select_item = select.querySelector('.select__item');
	const select_body_options = select.querySelector('.select__options');
	const select_options = select.querySelectorAll('.select__option');
	const select_type = original.getAttribute('data-type');
	const select_input = select.querySelector('.select__input');

	select_item.addEventListener('click', function () {
		let selects = document.querySelectorAll('.select');
		for (let index = 0; index < selects.length; index++) {
			const select = selects[index];
			const select_body_options = select.querySelector('.select__options');
			if (select != select_item.closest('.select')) {
				select.classList.remove('_active');
				_slideUp(select_body_options, 100);
			}
		}
		_slideToggle(select_body_options, 100);
		select.classList.toggle('_active');
	});

	for (let index = 0; index < select_options.length; index++) {
		const select_option = select_options[index];
		const select_option_value = select_option.getAttribute('data-value');
		const select_option_text = select_option.innerHTML;

		if (select_type == 'input') {
			select_input.addEventListener('keyup', select_search);
		} else {
			if (select_option.getAttribute('data-value') == original.value) {
				select_option.style.display = 'none';
			}
		}
		select_option.addEventListener('click', function () {
			for (let index = 0; index < select_options.length; index++) {
				const el = select_options[index];
				el.style.display = 'block';
			}
			if (select_type == 'input') {
				select_input.value = select_option_text;
				original.value = select_option_value;
			} else {
				select.querySelector('.select__value').innerHTML = '<span>' + select_option_text + '</span>';
				original.value = select_option_value;
				select_option.style.display = 'none';
			}
		});
	}
}
function select_get_options(select_options) {
	if (select_options) {
		let select_options_content = '';
		for (let index = 0; index < select_options.length; index++) {
			const select_option = select_options[index];
			const select_option_value = select_option.value;
			if (select_option_value != '') {
				const select_option_text = select_option.text;
				select_options_content = select_options_content + '<div data-value="' + select_option_value + '" class="select__option">' + select_option_text + '</div>';
			}
		}
		return select_options_content;
	}
}
function select_search(e) {
	let select_block = e.target.closest('.select ').querySelector('.select__options');
	let select_options = e.target.closest('.select ').querySelectorAll('.select__option');
	let select_search_text = e.target.value.toUpperCase();

	for (let i = 0; i < select_options.length; i++) {
		let select_option = select_options[i];
		let select_txt_value = select_option.textContent || select_option.innerText;
		if (select_txt_value.toUpperCase().indexOf(select_search_text) > -1) {
			select_option.style.display = "";
		} else {
			select_option.style.display = "none";
		}
	}
}
function selects_update_all() {
	let selects = document.querySelectorAll('select');
	if (selects) {
		for (let index = 0; index < selects.length; index++) {
			const select = selects[index];
			select_item(select);
		}
	}
}

//Placeholers
let inputs = document.querySelectorAll('input[data-value],textarea[data-value]');
inputs_init(inputs);

function inputs_init(inputs) {
	if (inputs.length > 0) {
		for (let index = 0; index < inputs.length; index++) {
			const input = inputs[index];
			const input_g_value = input.getAttribute('data-value');
			input_placeholder_add(input);
			if (input.value != '' && input.value != input_g_value) {
				input_focus_add(input);
			}
			input.addEventListener('focus', function (e) {
				if (input.value == input_g_value) {
					input_focus_add(input);
					input.value = '';
				}
				if (input.getAttribute('data-type') === "pass") {
					input.setAttribute('type', 'password');
				}
				if (input.classList.contains('_date')) {
					/*
					input.classList.add('_mask');
					Inputmask("99.99.9999", {
						//"placeholder": '',
						clearIncomplete: true,
						clearMaskOnLostFocus: true,
						onincomplete: function () {
							input_clear_mask(input, input_g_value);
						}
					}).mask(input);
					*/
				}
				if (input.classList.contains('_phone')) {
					//'+7(999) 999 9999'
					//'+38(999) 999 9999'
					//'+375(99)999-99-99'
					input.classList.add('_mask');
					Inputmask("+7(999) 999 9999", {
						//"placeholder": '',
						clearIncomplete: true,
						clearMaskOnLostFocus: true,
						onincomplete: function () {
							input_clear_mask(input, input_g_value);
						}
					}).mask(input);
				}
				if (input.classList.contains('_digital')) {
					input.classList.add('_mask');
					Inputmask("9{1,}", {
						"placeholder": '',
						clearIncomplete: true,
						clearMaskOnLostFocus: true,
						onincomplete: function () {
							input_clear_mask(input, input_g_value);
						}
					}).mask(input);
				}
				form_remove_error(input);
			});
			input.addEventListener('blur', function (e) {
				if (input.value == '') {
					input.value = input_g_value;
					input_focus_remove(input);
					if (input.classList.contains('_mask')) {
						input_clear_mask(input, input_g_value);
					}
					if (input.getAttribute('data-type') === "pass") {
						input.setAttribute('type', 'text');
					}
				}
			});
			if (input.classList.contains('_date')) {
				datepicker(input, {
					customDays: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
					customMonths: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
					formatter: (input, date, instance) => {
						const value = date.toLocaleDateString()
						input.value = value
					},
					onSelect: function (input, instance, date) {
						input_focus_add(input.el);
					}
				});
			}
		}
	}
}
function input_placeholder_add(input) {
	const input_g_value = input.getAttribute('data-value');
	if (input.value == '' && input_g_value != '') {
		input.value = input_g_value;
	}
}
function input_focus_add(input) {
	input.classList.add('_focus');
	input.parentElement.classList.add('_focus');
}
function input_focus_remove(input) {
	input.classList.remove('_focus');
	input.parentElement.classList.remove('_focus');
}
function input_clear_mask(input, input_g_value) {
	input.inputmask.remove();
	input.value = input_g_value;
	input_focus_remove(input);
}


let quantityButtons = document.querySelectorAll('.quantity__button');
if (quantityButtons.length > 0) {
	for (let index = 0; index < quantityButtons.length; index++) {
		const quantityButton = quantityButtons[index];
		quantityButton.addEventListener("click", function (e) {
			let value = parseInt(quantityButton.closest('.quantity').querySelector('input').value);
			if (quantityButton.classList.contains('quantity__button_plus')) {
				value++;
			} else {
				value = value - 1;
				if (value < 1) {
					value = 1
				}
			}
			quantityButton.closest('.quantity').querySelector('input').value = value;
		});
	}
};
// ==== Popup form handler====

const popupLinks = document.querySelectorAll('.popup-link');
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll('.lock-padding');
console.log(popupLinks)
console.log(body)
console.log(lockPadding)

let unlock = true;

const timeout = 800;

if(popupLinks.length > 0) {
	for (let index = 0; index < popupLinks.length; index++) {
		const popupLink = popupLinks[index];
		popupLink.addEventListener('click', function(e) {
			const popupName = popupLink.getAttribute('href').replace('#', '');
			const curentPopup = document.getElementById(popupName);
			popupOpen(curentPopup);
			e.preventDefault();
		});
	}
}


const popupCloseIcon = document.querySelectorAll('.close-popup');
if(popupCloseIcon.length > 0) {
	for(let index = 0; index < popupCloseIcon.length; index++) {
		const el = popupCloseIcon[index];
		el.addEventListener('click', function(e) {
			popupClose(el.closest('.popup'));
			e.preventDefault();
		});
	}
}

function popupOpen(curentPopup) {
	if(curentPopup && unlock) {
		const popupActive = document.querySelector('.popup.open');
		if (popupActive) {
			popupClose(popupActive, false);
		} else {
			bodyLock();
		}
		curentPopup.classList.add('open');
		curentPopup.addEventListener('click', function(e) {
			if(!e.target.closest('.popup_content')) {
				popupClose(e.target.closest('.popup'));
			}
		});

	}
}

function popupClose(popupActive, doUnlock = true) {
	if(unlock) {
		popupActive.classList.remove('open');
		if(doUnlock) {
			bodyUnlock();
		}
	}
}

function bodyLock() {
	const lockPaddingValue = window.innerWidth - document.querySelector('body').offsetWidth + 'px';

	if(lockPadding.length > 0) {
		for (let index = 0; index < lockPadding.length; index++) {
			const el = lockPadding[index];
			el.style.paddingRight = lockPaddingValue;
		}
	}

	body.style.paddingRight = lockPaddingValue;
	body.classList.add('lock');

	unlock = false;
	setTimeout(function() {
		unlock = true;
	}, timeout);
}

function bodyUnlock() {
	setTimeout(function() {
		for( let index = 0; index < lockPadding.length; index++) {
			const el = lockPadding[index];
			el.style.paddingRight = '0px';
		}

		body.style.paddingRight = '0px';
		body.classList.remove('lock');
	}, timeout);

	unlock = false;
	setTimeout(function() { 
		unlock = true;
	}, timeout);
}

document.addEventListener('keydown', function(e) {
	if(e.which === 27) {
		const popupActive = document.querySelector('.popup.open');
		popupClose(popupActive);
	}
});

// === Polyfill ===
	(function() {
		if(!Element.prototype.closest) {
			Element.prototype.closest = function(css) {
				var node = this;
				while(node) {
					if(node.matches(css)) return node;
					else node == node.parentElement;
				}
				return null;
			};
		}
	})();

	(function() {
		if(!Element.prototype.matches) {
			Element.prototype.matches = Element.prototype.matchesSelector ||
				Element.prototype.webkitMatchesSelector ||
				Element.prototype.mozMatchesSelector ||
				Element.prototype.mozMatchesSelector;
		}
	})();
// === AND Polyfill ===;

$(document).ready(function() {
	// === Burger Handler =====================================================================
{
	let isOpen = false;

	function burgerBtnAnimation(e) {
		$('.burger span:nth-child(1)').toggleClass('first');
		$('.burger span:nth-child(2)').toggleClass('second');
		$('.burger span:nth-child(3)').toggleClass('third');
		$('.burger span:nth-child(4)').toggleClass('fourth');
		let classNameElem = document.querySelector('.burger').dataset.activel;

		if(!isOpen) {
			document.querySelector(`.${classNameElem}`).classList.add('open');
			 document.querySelector('.top-header').classList.add('open');
			isOpen = true;
		} else {
			document.querySelector(`.${classNameElem}`).classList.remove('open');
			 document.querySelector('.top-header').classList.remove('open');
			 // document.querySelector(`.${classNameElem}`).classList.add('close');

			 // 	setTimeout(() => {
			 // 		document.querySelector(`.${classNameElem}`).classList.remove('close');
			 // 	}, 400)
			isOpen = false;
		}

	}
	$('.burger').click((e) => burgerBtnAnimation(e));
}
// === Burger Handler =====================================================================	;
	document.querySelector('body').classList.add('isload');

// === Проверка, поддержка браузером формата webp ==================================================================

	function testWebP(callback) {

	var webP = new Image();
	webP.onload = webP.onerror = function () {
	callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
	}

	testWebP(function (support) {

	if (support == true) {
	document.querySelector('body').classList.add('webp');
	}else{
	document.querySelector('body').classList.add('no-webp');
	}
	});

// === // Проверка, поддержка браузером формата webp ==================================================================


// === Плавный скрол на якорях ==================================================================
	if($('.anchor').length>0) {
		$(".anchor").click(function() {
		  var elementClick = $(this).attr("href")
		  var destination = $(elementClick).offset().top;
		  jQuery("html:not(:animated),body:not(:animated)").animate({
		    scrollTop: destination
		  }, 600);
		  return false;
		});
	}
// === Плавный скрол на якорях ==================================================================




// === slider-visit ==================================================================
{
	if($('.slider-visit').length>0) {
		$('.slider-visit').slick({
		  infinite: false,
		  slidesToShow: 1,
		  slidesToScroll: 1,
		  prevArrow: '<div class="slick-arrow slick-prev"><span class="icon-chevron-thin-left"></span></div>',
		  nextArrow: '<div class="slick-arrow slick-next"><span class="icon-chevron-thin-right"></span></div>',
		});
	}
}
// === // slider-visit ==================================================================



// === delivery-2 tab handler ==================================================================
{
	let block = document.querySelector('.aside-delivery2');
	if(block) {
		let top = block.querySelector('.aside-delivery2__top');
		let bottom = block.querySelector('.aside-delivery2__bottom');

		top.children[0].classList.add('_first');
		top.children[1].classList.add('_second');
		
		bottom.children[0].classList.add('_first');
		bottom.children[1].classList.add('_second');

		let firstBtn = top.querySelector('._first');
		let secondBtn = top.querySelector('._second');
		let firstTab = bottom.querySelector('._first');
		let secondTab = bottom.querySelector('._second');

		firstBtn.addEventListener('click', () => {
			firstBtn.classList.add('active');
			firstTab.classList.add('active');

			secondBtn.classList.remove('active');
			secondTab.classList.remove('active');
		})

		secondBtn.addEventListener('click', () => {
			secondBtn.classList.add('active');
			secondTab.classList.add('active');
			
			firstBtn.classList.remove('active');
			firstTab.classList.remove('active');

		})

	}
}
// === // delivery-2 tab handler ==================================================================



// === basket handler ==================================================================
{
	let basketHead = document.querySelector('.basket-head ');
	if(basketHead) {
		let btn = document.querySelector('.basket-head__icon');
		let btnClose = document.querySelector('.basket-head__close-btn');
		let basket = document.querySelector('.basket');
		let head = document.querySelector('.head-delivery_3');
		let menu = document.querySelector('.delivery-menu');
		let bodyDelivery_3 = document.querySelector('.body-delivery_3');

		btn.addEventListener('click', () => {
			basketHead.classList.toggle('_open');
			basket.classList.toggle('_open');
			head.classList.toggle('_isBasketOpen');
			menu.classList.toggle('_isBasketOpen');
			bodyDelivery_3.classList.toggle('_isBasketOpen');
		});

		btnClose.addEventListener('click', () => {
			basketHead.classList.remove('_open');
			basket.classList.remove('_open');
			head.classList.remove('_isBasketOpen');
			menu.classList.remove('_isBasketOpen');
			bodyDelivery_3.classList.remove('_isBasketOpen');
		})
	}
}
// === // basket handler ==================================================================



// === banner list info handler ==================================================================
{
	let infoBlock = document.querySelector('.banner-delivery__bottom');
	if(infoBlock) {
		let btn = document.querySelector('.banner-delivery__btn-mobile');
		btn.addEventListener('click', () => {
			btn.classList.toggle('_open');
			$('.banner-delivery__bottom').slideToggle(300);
		})
	}
}
// === // banner list info handler ==================================================================


// === delivery-menu scroll handler ==================================================================
{
	let deliveryMenu = document.querySelector('.aside-delivery3');
	if(deliveryMenu) {
		let list = document.querySelector('.aside-delivery3__list');
		let dishList = document.querySelector('.delivery-menu');
		window.addEventListener('scroll', () => {
			let headDeliveryHeight = document.querySelector('.head-delivery_3').clientHeight;

			if(deliveryMenu.getBoundingClientRect().top <= headDeliveryHeight) {
				list.classList.add('fixed');
				dishList.classList.add('_isListFixed');

			} else {
				list.classList.remove('fixed');
				dishList.classList.remove('_isListFixed');
			}
		});
	}
}
// === // delivery-menu scroll handler ==================================================================

// === aside-delivery3__list ==================================================================
	if($('.anchorMenu').length>0) {
		const remeveClass = (corentItem) => {
			let list = document.querySelector('.aside-delivery3__list')
			for(let item of list.children) {
				if(item == corentItem) {
					continue;
				}
				item.classList.remove('active');
			}
		}

		$(".anchorMenu").click(function() {
		  var elementClick = $(this).attr("href")
		 	$(this).parent().addClass('active');
		 	remeveClass($(this).parent()[0]);
		  var destination = $(elementClick).offset().top - 110;
		  jQuery("html:not(:animated),body:not(:animated)").animate({
		    scrollTop: destination
		  }, 600);
		  return false; 
		});
	}
// === // aside-delivery3__list==================================================================


// === delivery-menu ==================================================================
{
	let deliveryMenu = document.querySelector('.delivery-menu');
	if(deliveryMenu) {
		for(let i = 0; i < deliveryMenu.children.length; i++) {
			deliveryMenu.children[i].dataset.count = i;
		}

		let list = document.querySelector('.aside-delivery3__list');
		const leftScroll = (index, widthElem) => {
			let count = 0;

			for(let i = 0; i < index; i++) {
				count += list.children[i].getBoundingClientRect().width;
			}

			list.scrollLeft = count - widthElem;
		}

		window.addEventListener('scroll', () => {
			//console.log(list.scrollLeft)

			for(let item of deliveryMenu.children) {
				if(item.getBoundingClientRect().top <= (document.documentElement.clientHeight / 2) && item.getBoundingClientRect().bottom >= (document.documentElement.clientHeight / 2)) {
					for(let i of list.children) {
						i.classList.remove('active');

						if(i == list.children[item.dataset.count]) {
							i.classList.add('active');
							leftScroll(item.dataset.count, i.getBoundingClientRect().width / 2);
						}
					}
				}
			}
		})
	}
}
// === // delivery-menu ==================================================================



// === menu-table ==================================================================
{
	let menuTable = document.querySelector('.menu-table');
	if(menuTable) {
		document.querySelectorAll('.menu-table__triggers').forEach((item) => {
			item.addEventListener('click', function(e) {
				e.preventDefault();
				const id = e.target.getAttribute('href').replace('#','');

				document.querySelectorAll('.menu-table__triggers').forEach((child) => {
					child.classList.remove('active');
				});

				document.querySelectorAll('.menu-table__tabs-content').forEach((child) => {
					child.classList.remove('active');
				});

				item.classList.add('active');
				document.getElementById(id).classList.add('active');
			});
		});


		document.querySelectorAll('.menu-table__tabs-content').forEach((item) => {
			item.querySelectorAll('.menu-table__sub-triggers').forEach((i) => {
				i.addEventListener('click', function(e) {
					e.preventDefault();
					const id = e.target.getAttribute('href').replace('#','');

					item.querySelectorAll('.menu-table__sub-triggers').forEach((child) => {
						child.classList.remove('active');
					});

					item.querySelectorAll('.menu-table__tabs-sub-content').forEach((child) => {
						child.classList.remove('active');
					});

					i.classList.add('active');
					document.getElementById(id).classList.add('active');
				});
			});
		});

		// document.querySelectorAll('.menu-table__sub-triggers').forEach((item) => {
		// 	item.addEventListener('click', function(e) {
		// 		e.preventDefault();
		// 		const id = e.target.getAttribute('href').replace('#','');

		// 		document.querySelectorAll('.menu-table__sub-triggers').forEach((child) => {
		// 			child.classList.remove('active');
		// 		});

		// 		document.querySelectorAll('.menu-table__tabs-sub-content').forEach((child) => {
		// 			child.classList.remove('active');
		// 		});

		// 		item.classList.add('active');
		// 		document.getElementById(id).classList.add('active');
		// 	});
		// });
	}
}
// === // menu-table ==================================================================


// === order-list ==================================================================
{
	let orderList = document.querySelector('.order-list');
	if(orderList) {
		orderList.querySelectorAll('.item-order__quantity').forEach((item) => {
			item.addEventListener('click', (e) => {

				if(e.target.closest('.item-order__plus')) {
					item.querySelector('input').value = +item.querySelector('input').value + 1;
				}

				if(e.target.closest('.item-order__minus')) {
					if(item.querySelector('input').value > 1) {
						item.querySelector('input').value = +item.querySelector('input').value - 1;
					}
				}
			})
		})
	}
}

{
	let popupOrder = document.querySelector('.form-order2');
	if(popupOrder) {
		popupOrder.querySelectorAll('.item-order__quantity').forEach((item) => {
			item.addEventListener('click', (e) => {

				if(e.target.closest('.item-order__plus')) {
					item.querySelector('input').value = +item.querySelector('input').value + 1;
				}

				if(e.target.closest('.item-order__minus')) {
					if(item.querySelector('input').value > 1) {
						item.querySelector('input').value = +item.querySelector('input').value - 1;
					}
				}
			})
		})
	}
}
// === // order-list ==================================================================




});


// ==== //  google map ===============

{


	let isMap = document.getElementById("map");
	if(isMap) {
		var map;

		let center = {
			lat: 55.781977,
			lng: 37.469893,
		}

		let markerPosition = {
			lat: 55.781977,
			lng: 37.469893,
		}

		// Функция initMap которая отрисует карту на странице
		function initMap() {

			// В переменной map создаем объект карты GoogleMaps и вешаем эту переменную на <div id="map"></div>
			map = new google.maps.Map(document.getElementById('map'), {
				// При создании объекта карты необходимо указать его свойства
				// center - определяем точку на которой карта будет центрироваться
				center: {lat: center.lat, lng: center.lng},
				// zoom - определяет масштаб. 0 - видно всю платнеу. 18 - видно дома и улицы города.

				zoom: 17,

				// Добавляем свои стили для отображения карты
				//styles: 
			});

			// Создаем маркер на карте
			var marker = new google.maps.Marker({

				// Определяем позицию маркера
			    position: {lat: markerPosition.lat, lng: markerPosition.lng},

			    // Указываем на какой карте он должен появится. (На странице ведь может быть больше одной карты)
			    map: map,

			    // Пишем название маркера - появится если навести на него курсор и немного подождать
			    title: 'бульвар Генерала Карбышева',
			    label: '',

			    // Укажем свою иконку для маркера
			   // icon: 'img/contact/googlMarker.svg',
			});

		}
	}
}

