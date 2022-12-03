function createElement(tagName, options) {
	let element = document.createElement(tagName);
	if (options) {
		for (let optionName in options) {
			let optionValue = options[optionName];
			switch (optionName) {
				case 'class':
					element.classList.add(...optionValue.split(' '));
					break;
				case 'i18n':
					element.setAttribute('data-i18n', optionValue);
					element.innerHTML = optionValue;
					element.classList.add('i18n');
					break;
				case 'i18n-title':
					element.setAttribute('data-i18n-title', optionValue);
					element.classList.add('i18n-title');
					break;
				case 'i18n-placeholder':
					element.setAttribute('data-i18n-placeholder', optionValue);
					element.classList.add('i18n-placeholder');
					break;
				case 'i18n-label':
					element.setAttribute('data-i18n-label', optionValue);
					element.classList.add('i18n-label');
					break;
				case 'parent':
					optionValue.append(element);
					break;
				case 'child':
					element.append(optionValue);
					break;
				case 'childs':
					element.append(...optionValue);
					break;
				case 'events':
					for (let eventType in optionValue) {
						let eventParams = optionValue[eventType];
						if (typeof eventParams === 'function') {
							element.addEventListener(eventType, eventParams);
						} else {
							element.addEventListener(eventType, eventParams.listener, eventParams.options);
						}
					}
					break;
				case 'hidden':
					if (optionValue) {
						hide(element);
					}
					break;
				case 'attributes':
					for (let attributeName in optionValue) {
						element.setAttribute(attributeName, optionValue[attributeName]);
					}
					break;
				case 'list':
					element.setAttribute(optionName, optionValue);
					break;
				default:
					if (optionName.startsWith('data-')) {
						element.setAttribute(optionName, optionValue);
					} else {
						element[optionName] = optionValue;
					}
					break;
			}
		}
	}
	return element;
}

function display(htmlElement, visible) {
	if (htmlElement == undefined) return;

	if (visible) {
		htmlElement.style.display = '';
	} else {
		htmlElement.style.display = 'none';
	}
}

function show(htmlElement) {
	display(htmlElement, true);
}

function hide(htmlElement) {
	display(htmlElement, false);
}

function styleInject$2(css) {
	document.head.append(createElement('style', {textContent: css}));
}

class MindalkaSelect extends HTMLElement {
	#htmlSelect;
	constructor() {
		super();
		this.#htmlSelect = createElement('select');
	}

	connectedCallback() {
		this.append(this.#htmlSelect);
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name == 'multiple') {
			this.#htmlSelect.setAttribute('multiple', newValue);
		}
	}

	addEventListener(type, listener) {
		this.#htmlSelect.addEventListener(type, listener);
	}

	onChange(event) {
		let newEvent = new event.constructor(event.type, event);
		this.dispatchEvent(newEvent);
	}

	addOption(value, text) {
		text = text || value;
		let option = document.createElement('option');
		option.value = value;
		option.innerHTML = text;
		this.#htmlSelect.append(option);
	}

	addOptions(values) {
		if (values && values.entries) {
			for (let [value, text] of values.entries()) {
				this.addOption(value, text);
			}
		}
	}

	setOptions(values) {
		this.removeAllOptions();
		this.addOptions(values);
	}

	removeOption(value) {
		let list = this.#htmlSelect.children;
		for (let i = 0; i < list.length; i++) {
			if (list[i].value === value) {
				list[i].remove();
			}
		}
	}

	removeAllOptions() {
		let list = this.#htmlSelect.children;
		while (list[0]) {
			list[0].remove();
		}
	}

	select(value) {
		let list = this.#htmlSelect.children;
		for (let i = 0; i < list.length; i++) {
			if (list[i].value === value) {
				list[i].selected = true;
			}
		}
	}

	selectFirst() {
		if (this.#htmlSelect.children[0]) {
			this.#htmlSelect.children[0].selected = true;
			this.#htmlSelect.dispatchEvent(new Event('input'));
		}
	}

	unselect(value) {
		let list = this.#htmlSelect.children;
		for (let i = 0; i < list.length; i++) {
			if (list[i].value === value) {
				list[i].selected = false;
			}
		}
	}
	unselectAll() {
		let list = this.#htmlSelect.children;
		for (let i = 0; i < list.length; i++) {
			list[i].selected = false;
		}
	}

	static get observedAttributes() {
		return ['multiple'];
	}
}

class MindalkaTab extends HTMLElement {
	#disabled = false;
	#active = false;
	#header;
	#group;
	constructor() {
		super();
		this.#header = createElement('div', {
			class: 'mindalka-tab-label',
			i18n: this.getAttribute('data-i18n'),
			events: {
				click: event => this.#click(event)
			}
		});
	}

	get htmlHeader() {
		return this.#header;
	}

	connectedCallback() {
		let parentElement = this.parentElement;
		if (parentElement && parentElement.tagName == 'MINDALKA-TAB-GROUP') {
			parentElement.addTab(this);
			this.#group = parentElement;
		}
	}

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
			case 'data-i18n':
				this.#header.setAttribute('data-i18n', newValue);
				break;
			case 'disabled':
				this.disabled = newValue;
				break;
		}
	}

	set disabled(disabled) {
		this.#disabled = disabled ? true : false;
		this.#header.classList[this.#disabled?'add':'remove']('disabled');
	}

	get disabled() {
		return this.#disabled;
	}

	activate() {
		this.active = true;
	}

	set active(active) {
		if (this.#active != active) {
			this.#active = active;
			if (active) {
				this.dispatchEvent(new CustomEvent('activated'));
			} else {
				this.dispatchEvent(new CustomEvent('deactivated'));
			}
		}
		display(this, active);
		if (active) {
			this.#header.classList.add('activated');
		} else {
			this.#header.classList.remove('activated');
		}

		if (active && this.#group) {
			this.#group.active = this;
		}
	}

	get active() {
		return this.#active;
	}

	#click() {
		if (!this.#disabled) {
			this.activate();
		}
	}

	static get observedAttributes() {
		return ['data-i18n', 'disabled'];
	}
}

class MindalkaTabGroup extends HTMLElement {
	#tabs = new Set();
	#header;
	#content;
	#activeTab;
	constructor() {
		super();
		this.#header = createElement('div', {class: 'mindalka-tab-group-header'});
		this.#content = createElement('div', {class: 'mindalka-tab-group-content'});
	}

	connectedCallback() {
		this.append(this.#header, this.#content);
	}

	addTab(tab) {
		this.#tabs.add(tab);
		if (!this.#activeTab) {
			this.#activeTab = tab;
		}
		this.#refresh();
	}

	#refresh() {
		for (let tab of this.#tabs) {
			this.#header.append(tab.htmlHeader);
			this.#content.append(tab);
			if (tab != this.#activeTab) {
				tab.active = false;
			}
		}

		this.#activeTab.active = true;
	}

	set active(tab) {
		if (this.#activeTab != tab) {
			this.#activeTab = tab;
			this.#refresh();
		}
	}

	clear() {
		this.#tabs.clear();
		this.#activeTab = undefined;
		this.#header.innerHTML = '';
		this.#content.innerHTML = '';
	}
}

function SaveFile(file) {
	var link = document.createElement('a');
	link.setAttribute('href', URL.createObjectURL(file));
	link.setAttribute('download', file.name);

	link.click();
}

const I18N_DELAY_BEFORE_REFRESH = 100;

const I18n = new (function () {
	class I18n extends EventTarget {
		#path = './json/i18n/';
		#lang = 'english';
		#translations = new Map();
		#executing = false;
		#refreshTimeout;

		constructor() {
			super();
		}

		start() {
			this.#initObserver();
			this.i18n();//Scan everything to get html elements created before I18n
		}

		setOptions(options) {
			if (options.path) {
				this.#path = options.path;
			}

			if (options.translations) {
				for (let file of options.translations) {
					this.#loaded(file);
				}
			}
		}

		#initObserver() {
			//const config = {attributes: true, childList: true, subtree: true, attributeFilter:['class', 'data-i18n', 'data-i18n-title', 'data-i18n-placeholder']};
			const config = {childList: true, subtree: true};
			const callback = async (mutationsList, observer) => {
				for(let mutation of mutationsList) {
					if (mutation.type === 'childList') {
						for (let node of mutation.addedNodes) {
							if (node instanceof HTMLElement) {
								this.updateElement(node);
							}
						}
					}
				}
			};
			new MutationObserver(callback).observe(document.body, config);
		}

		#processList(parentNode, className, attribute, subElement) {
			const elements = parentNode.querySelectorAll('.' + className);

			if (parentNode.classList?.contains(className)) {
				this.#processElement(parentNode, attribute, subElement);
			}

			for (let element of elements) {
				this.#processElement(element, attribute, subElement);
			}
		}

		#processElement(htmlElement, attribute, subElement) {
			let dataLabel = htmlElement.getAttribute(attribute);
			if (dataLabel) {
				htmlElement[subElement] = this.getString(dataLabel);
			}
		}

		i18n() {
			if (!this.#refreshTimeout) {
				this.#refreshTimeout = setTimeout((event) => this.#i18n(), I18N_DELAY_BEFORE_REFRESH);
			}
		}

		#i18n() {
			this.#refreshTimeout = null;
			if (this.#lang == '') {return;}
			if (this.#executing) {return;}
			this.#executing = true;
			this.#processList(document, 'i18n', 'data-i18n', 'innerHTML');
			this.#processList(document, 'i18n-title', 'data-i18n-title', 'title');
			this.#processList(document, 'i18n-placeholder', 'data-i18n-placeholder', 'placeholder');
			this.#processList(document, 'i18n-label', 'data-i18n-label', 'label');
			this.#executing = false;
			return;
		}

		updateElement(htmlElement) {
			if (this.#lang == '') {return;}

			this.#processList(htmlElement, 'i18n', 'data-i18n', 'innerHTML');
			this.#processList(htmlElement, 'i18n-title', 'data-i18n-title', 'title');
			this.#processList(htmlElement, 'i18n-placeholder', 'data-i18n-placeholder', 'placeholder');
			this.#processList(htmlElement, 'i18n-label', 'data-i18n-label', 'label');
		}

		set lang(lang) {
			if (this.#lang != lang) {
				this.dispatchEvent(new CustomEvent('langchanged', {detail: {oldLang: this.#lang, newLang: lang}}));
				this.#lang = lang;
				this.checkLang();
				this.i18n();
			}
		}

		getString(s) {
			if (this.checkLang()) {
				if (this.#translations.get(this.#lang).strings) {
					let s2 = this.#translations.get(this.#lang).strings[s];
					if (typeof s2 == 'string') {
						return s2;
					} else {
						console.warn('Missing translation for key ' + s);
						return s;
					}
				}
			}
			return s;
		}

		get authors() {
			if (this.checkLang()) {
				if (this.#translations.get(this.#lang).authors) {
					return this.#translations.get(this.#lang).authors;
				}
			}
			return [];
		}

		checkLang() {
			if (this.#translations.has(this.#lang)) {
				return true;
			} else {
				let url = this.#path + this.#lang + '.json';
				fetch(new Request(url)).then((response) => {
					response.json().then((json) => {
						this.#loaded(json);
					});
				});
				this.#translations.set(this.#lang, {});
				return false;
			}
		}

		#loaded(file) {
			if (file) {
				let lang = file.lang;
				this.#translations.set(lang, file);
				this.i18n();
				this.dispatchEvent(new CustomEvent('translationsloaded'));
			}
		}
	}
	return I18n;
}());

function styleInject$1(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z$1$1 = ".notification-manager{\r\n\tposition: absolute;\r\n\tz-index: 100;\r\n\tbottom: 0px;\r\n\twidth: 100%;\r\n\tdisplay: flex;\r\n\tflex-direction: column-reverse;\r\n\tmax-height: 50%;\r\n\toverflow-y: auto;\r\n}\r\n.notification-manager-notification{\r\n\tbackground-color: var(--theme-popup-bg-color);\r\n\tcolor: var(--theme-text-color);\r\n\tfont-size: 1.5em;\r\n\tpadding: 4px;\r\n\tdisplay: flex;\r\n\talign-items: center;\r\n}\r\n.notification-manager-notification-content{\r\n\toverflow: auto;\r\n\tflex: 1;\r\n\tmax-width: calc(100% - 20px);\r\n}\r\n.notification-manager-notification-close{\r\n\tfill: currentColor;\r\n\tcursor: pointer;\r\n}\r\n.notification-manager-notification-close > svg{\r\n\twidth: 20px;\r\n\tmargin: 5px;\r\n}\r\n.notification-manager-notification-success{\r\n\tbackground-color: #5aa822ff;\r\n}\r\n.notification-manager-notification-warning{\r\n\tbackground-color: #c78a17ff;\r\n}\r\n.notification-manager-notification-error{\r\n\tbackground-color: #c71717ff;\r\n}\r\n.notification-manager-notification-info{\r\n\tbackground-color: #2e88e8ff;\r\n}\r\n";
styleInject$1(css_248z$1$1);

const NOTIFICATION_CLASSNAME = 'notification-manager-notification';
const CLOSE_SVG = '<svg viewBox="0 0 357 357"><polygon points="357,35.7 321.3,0 178.5,142.8 35.7,0 0,35.7 142.8,178.5 0,321.3 35.7,357 178.5,214.2 321.3,357 357,321.3 214.2,178.5"/></svg>';

class Notification {
	constructor(content, type, ttl) {
		this.content = content;
		this.type = type;
		this.ttl = ttl;
	}

	set ttl(ttl) {
		if (ttl) {
			clearTimeout(this.timeout);
			this.timeout = setTimeout(() => NotificationManager.closeNofication(this), ttl * 1000);
		}
	}

	get view() {
		if (!this.htmlElement) {
			this.htmlElement = document.createElement('div');
			let htmlElementContent = document.createElement('div');
			htmlElementContent.className = NOTIFICATION_CLASSNAME + '-content';
			let htmlElementClose = document.createElement('div');
			htmlElementClose.className = NOTIFICATION_CLASSNAME + '-close';

			this.htmlElement.append(htmlElementContent, htmlElementClose);
			this.htmlElement.className = NOTIFICATION_CLASSNAME;
			if (this.type) {
				this.htmlElement.classList.add(NOTIFICATION_CLASSNAME + '-' + this.type);

			}
			if (this.content instanceof HTMLElement) {
			htmlElementContent.append(this.content);
			} else {
				htmlElementContent.innerHTML = this.content;
			}
			htmlElementClose.innerHTML = CLOSE_SVG;
			htmlElementClose.addEventListener('click', () => NotificationManager.closeNofication(this));
		}
		return this.htmlElement;
	}
}

const NotificationManager = new (function () {
	class NotificationManager extends EventTarget {//TODOv3 are we going to send events ?
		constructor() {
			super();
			this.htmlParent = document.body;
			this.nofifications = new Set();
			this.createHtml();
		}

		set parent(htmlParent) {
			this.htmlParent = htmlParent;
			this.htmlParent.append(this.htmlElement);
		}

		createHtml() {
			this.htmlElement = document.createElement('div');
			this.htmlElement.className = 'notification-manager';
			this.htmlParent.append(this.htmlElement);
		}

		_getNotification(content, type, ttl) {
			for (let notification of this.nofifications) {
				if ((notification.content ==content) && (notification.type == type)) {
					notification.ttl = ttl;
					return notification;
				}
			}
			return new Notification(content, type, ttl);
		}

		addNotification(content, type, ttl) {
			let notification = this._getNotification(content, type, ttl);
			this.nofifications.add(notification);
			this.htmlElement.append(notification.view);
		}

		closeNofication(notification) {
			this.nofifications.delete(notification);
			notification.view.remove();
		}
	}
	return NotificationManager;
}());

var css_248z$2 = "#options-manager-outer{\r\n\tposition: absolute;\r\n\twidth: 100%;\r\n\theight: 100%;\r\n\toverflow: auto;\r\n\tz-index: 10000;\r\n\tdisplay: flex;\r\n\talign-items: center;\r\n\tjustify-content: center;\r\n\ttop:0px;\r\n\tleft: 0px;\r\n}\r\n\r\n#options-manager-intermediate{\r\n\toverflow: visible;\r\n\twidth: 0px;\r\n\theight: 0px;\r\n\tposition: absolute;\r\n\tleft: 50%;\r\n\ttop: 50%;\r\n\tdisplay: flex;\r\n\talign-items: center;\r\n\tjustify-content: center;\r\n}\r\n\r\n#options-manager-inner{\r\n\tposition: relative;\r\n\t/*background-color: rgba(255, 255, 255, 1.0);*/\r\n\tbackground-color: var(--theme-popup-bg-color);\r\n\tcolor: var(--main-text-color-dark2);\r\n\tpadding:10px;\r\n\toverflow: hidden;\r\n\tmax-height: 70%;\r\n\tmax-width: 75%;\r\n\tdisplay: flex;\r\n\tflex-direction: column;\r\n\topacity: 0.9;\r\n}\r\n\r\n#options-manager-inner h1{\r\n\ttext-transform: capitalize;\r\n\ttext-align: center;\r\n}\r\n\r\n#options-manager-inner-filter{\r\n\twidth:100%;\r\n}\r\n\r\n.options-manager-button{\r\n\tcursor:pointer;\r\n\twhite-space: nowrap;\r\n\ttext-transform: capitalize;\r\n}\r\n\r\n#options-manager-inner table{\r\n\ttext-align: left;\r\n\toverflow: hidden auto;\r\n\tdisplay: block;\r\n\theight: 100%;\r\n}\r\n\r\n#options-manager-inner thead{\r\n\tposition: sticky;\r\n\t/*display: block;*/\r\n\ttop: 0px;\r\n\tbackground-color: var(--theme-popup-bg-color);\r\n}\r\n\r\n#options-manager-inner thead th{\r\n\tposition: sticky;\r\n\ttop: 0px;\r\n\tbackground-color: var(--theme-popup-bg-color);\r\n}\r\n\r\n#options-manager-inner th{\r\n\ttext-transform: capitalize;\r\n}\r\n\r\n#options-manager-inner th button, #options-manager-inner td button{\r\n\twidth: 100%;\r\n}\r\n\r\n#options-manager-title{\r\n\tcursor:move;\r\n}\r\n\r\n[draggable=true] {\r\n\tcursor: move;\r\n}\r\n\r\n[draggable=true] *{\r\n\tcursor: initial;\r\n}\r\n\r\n#options-manager-outer kbd{\r\n\tbackground-color: #eee;\r\n\tborder-radius: 0.25rem;\r\n\tborder: 0.1rem solid #b4b4b4;\r\n\tbox-shadow: 0 0.06rem 0.06rem rgba(0, 0, 0, .2), 0 0.1rem 0 0 rgba(255, 255, 255, .7) inset;\r\n\tcolor: #333;\r\n\tdisplay: inline-block;\r\n\tline-height: 1;\r\n\tpadding: 0.15rem;\r\n\twhite-space: nowrap;\r\n\tfont-weight: 1000;\r\n\tfont-size: 1.3rem;\r\n}\r\n";
styleInject$1(css_248z$2);

new (function () {
	class OptionsManager extends EventTarget {
		#defaultValues = new Map();
		#currentValues = new Map();
		#categories = new Map();
		#dirtyCategories = true;
		#initPromiseResolve;
		#initPromise = new Promise((resolve) => this.#initPromiseResolve = resolve);
		#currentFilter = '';
		#optionsManagerRows = new Set();
		#htmlOptionsManagerContainer;
		#htmlOptionsTable;
		#htmlOptionsManagerContentThead;
		static #uniqueId = 0;

		constructor() {
			super();

			this.#defaultValues[Symbol.iterator] = function* () {
				yield* [...this.entries()].sort(
					(a, b) => {return a[0] < b[0] ? -1 : 1;}
				);
			};
		}

		async init(parameters) {
			if (parameters.url) {
				await this.#initFromURL(parameters.url);
			} else if (parameters.json) {
				this.#initFromJSON(parameters.json);
			}
		}

		async #initFromURL(url) {
			let response = await fetch(url);
			this.#initFromJSON(await response.json());
		}

		#initFromJSON(json) {
			if (json) {
			 	if (json.categories) {
					json.categories.forEach((category) => this.#addCategory(category));
				}
				this.#addCategory('');
			 	if (json.options) {
					json.options.forEach((option) => this.addOption(option));
				}
				this.#initPromiseResolve();
			}
		}

		#addCategory(name) {
			this.#categories.set(name.toLowerCase(), []);
			this.#dirtyCategories = true;
		}

		#refreshCategories(name) {
			if (this.#dirtyCategories) {
				for (let [categoryName, category] of this.#categories) {
					category.length = 0;
				}

				for (let [optionName, option] of this.#defaultValues) {
					let maxLength = -1;
					let cat = null;
					for (let [categoryName, category] of this.#categories) {
						if (categoryName.length > maxLength) {
							if (optionName.startsWith(categoryName) || categoryName === '') {
								maxLength = categoryName.length;
								cat = category;
							}
						}
					}
					if (cat !== null) {
						cat.push(option);
					}
				}
			}
			this.#dirtyCategories = false;
		}

		addOption(option) {
			if (!option) {return;}
			let name = option.name.toLowerCase();

			let type = option.type;
			let defaultValue = option.default;
			let datalist = option.datalist;
			let editable = option.editable;
			let dv = this.#defaultValues.get(name) || {};
			this.#defaultValues.set(name, dv);
			dv.name = name;
			if (type !== undefined) {
				dv.type = type;
			}
			if (defaultValue !== undefined) {
				dv.dv = defaultValue;
			}
			if (datalist !== undefined) {
				dv.datalist = datalist;
			}
			if (editable !== undefined) {
				dv.editable = editable;
			}

			try {
				if (typeof localStorage != 'undefined') {
					let value = this.getItem(name);
					if (value === undefined) {
						this.setItem(name, defaultValue);
					} else {
						this.setItem(name, value);
					}
				}
			} catch (exception) {
				if (OptionsManager.logException) {
					console.error(exception);
				}
			}
		}

		setItem(name, value) {
			try {
				if (typeof localStorage != 'undefined') {
					localStorage.setItem(name, JSON.stringify(value));
					if (this.#currentValues.has(name)) {
						if (value == this.#currentValues.get(name)) {
							return;
						}
					}
					this.#currentValues.set(name, value);
					this.#valueChanged(name, value);
				}
			} catch (exception) {
				if (OptionsManager.logException) {
					console.error(exception);
				}
			}
		}

		getSubItem(name, subName) {
			try {
				let map = this.#currentValues.get(name) ?? {};
				if (map && (typeof map == 'object')) {
					return map[subName];
				}
			} catch (exception) {
				if (OptionsManager.logException) {
					console.error(exception);
				}
			}
		}

		async setSubItem(name, subName, value) {
			try {
				let option = await this.getOption(name);
				if (option && option.type == 'map') {
					let map = this.#currentValues.get(name) ?? {};

					if (map[subName] == value) {
						return;
					}
					map[subName] = value;
					this.#valueChanged(name, map);

					localStorage.setItem(name, JSON.stringify(map));
				}
			} catch (exception) {
				if (OptionsManager.logException) {
					console.error(exception);
				}
			}
		}

		removeSubItem(name, subName) {
			try {
				let map = this.#currentValues.get(name) ?? {};
				if (map && (typeof map == 'object')) {
					delete map[subName];
					this.#valueChanged(name, map);
					localStorage.setItem(name, JSON.stringify(map));
				}
			} catch (exception) {
				if (OptionsManager.logException) {
					console.error(exception);
				}
			}
		}

		#valueChanged(name, value) {
			this.dispatchEvent(new CustomEvent(name, {detail:{name:name, value:value}}));
			let lastIndex = name.lastIndexOf('.');
			while (lastIndex != -1) {
				let wildCardName = name.slice(0, lastIndex);
				this.dispatchEvent(new CustomEvent(wildCardName + '.*', {detail:{name:name, value:value}}));
				lastIndex = name.lastIndexOf('.', lastIndex - 1);
			}

			this.dispatchEvent(new CustomEvent('*', {detail:{name:name, value:value}}));
		}

		getItem(name) {
			try {
				if (typeof localStorage != 'undefined') {
					let value = localStorage.getItem(name);
					if (value) {
						let parsedValue = JSON.parse(value);
						return parsedValue;
					}
				}
			} catch (exception) {
				if (OptionsManager.logException) {
					console.error(exception);
				}
			}
			if (this.#defaultValues.get(name)) {
				return this.#defaultValues.get(name).dv;
			}
		}

		removeItem(name) {
			this.#defaultValues.delete(name);
			try {
				if (typeof localStorage != 'undefined') {
					localStorage.removeItem(name);
				}
				this.#currentValues.delete(name);
			} catch (exception) {
				if (OptionsManager.logException) {
					console.error(exception);
				}
			}
		}

		resetItem(name) {
			let item = this.#defaultValues.get(name);
			if (item) {
				let defaultValue = item.dv;
				if (defaultValue !== undefined) {
					this.#currentValues.delete(name);
					this.setItem(name, defaultValue);
				}
			}
		}

		resetItems(names) {
			for (name of names) {
				this.resetItem(name);
			}
		}

		resetAllItems(name) {
			for (let item of this.#defaultValues.keys()) {
				this.resetItem(item);
			}
		}

		clear() {
			this.#defaultValues.clear();
			try {
				if (typeof localStorage != 'undefined') {
					localStorage.clear();
				}
				this.#currentValues.clear();
			} catch (exception) {
				if (OptionsManager.logException) {
					console.error(exception);
				}
			}
		}

		#filter(filter) {
			this.#currentFilter = String(filter).toLowerCase();
			this.#applyFilter();
		}

		#applyFilter() {
			for (let row of this.#optionsManagerRows) {
				//let row = i[0];
				let optionName = row.getAttribute('user-data-option-name').toLowerCase();

				if (!this.#currentFilter || optionName.indexOf(this.#currentFilter) != -1) {
					row.style.display = '';
				} else {
					row.style.display = 'none';
				}
			}
		}

		#initPanel() {
			this.#htmlOptionsManagerContainer = createElement('div', {
				id: 'options-manager-outer',
				parent: document.body,
				events: {
					click: event => hide(this.#htmlOptionsManagerContainer)
				}
			});

			let options_manager_inner = createElement('div', {
				id: 'options-manager-inner',
				draggable: true,
				'data-left': 0,
				'data-top': 0,
				parent: this.#htmlOptionsManagerContainer,
				events: {
					click: event => event.stopPropagation(),
					dragstart: event => handleDragStart(event),
					dragend: event => handleDragEnd(event),
				}
			});

			let handleDragStart = function(event) {
				let target = event.target;

				target.setAttribute('data-drag-start-layerx', event.layerX);
				target.setAttribute('data-drag-start-layery', event.layerY);
			};

			let handleDragEnd = function(event) {
				let target = event.target;

				let startEventX = target.getAttribute('data-drag-start-layerx');
				let startEventY = target.getAttribute('data-drag-start-layery');

				target.style.left = (event.layerX - startEventX) + 'px';
				target.style.top = (event.layerY - startEventY) + 'px';

				let dataTop = target.getAttribute('data-top') * 1 + (event.layerY - startEventY);
				let dataLeft = target.getAttribute('data-left') * 1 + (event.layerX - startEventX);

				target.style.left = dataLeft + 'px';
				target.style.top = dataTop + 'px';

				options_manager_inner.setAttribute('data-left', dataLeft);
				options_manager_inner.setAttribute('data-top', dataTop);
			};

			createElement('h1', {id: 'options-manager-title', i18n: '#manage_options', parent: options_manager_inner});

			createElement('input', {
				id: 'options-manager-inner-filter',
				'i18n-placeholder': '#filter',
				parent: options_manager_inner,
				events: {
					input: event => this.#filter(event.target.value)
				}
			});

			this.#htmlOptionsTable = createElement('table', {parent: options_manager_inner});
			this.#htmlOptionsManagerContentThead = createElement('thead', {parent: this.#htmlOptionsTable});
		}

		#populateOptionRow(option) {
			let htmlRow = createElement('tr');
			let htmlResetButtonCell = createElement('td');
			let htmlOptionNameCell = createElement('td', {innerHTML: option.name});
			let htmlDefaultValueCell = createElement('td');
			let htmlUserValueCell = createElement('td');

			JSON.stringify(option.dv);
			let myValue = this.getItem(option.name);

			this.#fillCell(htmlDefaultValueCell, option.type, option.dv);

			createElement('button', {
				class: 'options-manager-button',
				i18n: '#reset',
				parent: htmlResetButtonCell,
				events: {
					click: (event) => {this.resetItem(option.name);this.#refreshPanel();}
				}
			});

			let valueEdit = this.#createInput(option.name, this.#defaultValues.get(option.name), myValue, htmlResetButtonCell);
			htmlUserValueCell.appendChild(valueEdit);
			htmlRow.append(htmlResetButtonCell, htmlOptionNameCell, htmlDefaultValueCell, htmlUserValueCell);
			return htmlRow;
		}

		#populateMapOptionRow(option) {
			let htmlRow = createElement('tbody', {innerHTML: `<td></td><td colspan="3">${option.name}</td>`});

			let userValue = this.getItem(option.name);
			if (userValue && typeof userValue === 'object') {
				for (let key in userValue) {
					let htmlSubRow = createElement('tr', {parent: htmlRow});
					let value = userValue[key];

					let htmlRemoveButtonCell = createElement('td');
					let htmlSubNameCell = createElement('td', {innerHTML: key});
					let htmlSubValueCell = createElement('td');
					htmlSubRow.append(htmlRemoveButtonCell, htmlSubNameCell, htmlSubValueCell);

					createElement('input', {value: value, parent: htmlSubValueCell});
				}
			}
			return htmlRow;
		}

		#addOptionRow(option) {
			if (option.editable === false) {
				return;
			}

			let htmlRow;
			if (option.type == 'map') {
				htmlRow = this.#populateMapOptionRow(option);
			} else {
				htmlRow = this.#populateOptionRow(option);
			}

			htmlRow.setAttribute('user-data-option-name', option.name);

			return htmlRow;
		}

		#refreshPanel() {
			this.#refreshCategories();
			this.#htmlOptionsManagerContentThead.innerHTML = '';

			this.#htmlOptionsManagerContentThead.append(
				createElement('th', {child: createElement('button', {
					class: 'options-manager-button',
					i18n: '#reset_all',
					events: {
						click: (event) => {this.resetAllItems();this.#refreshPanel();}
					}
				})}),
				createElement('th', {i18n: '#option_name'}),
				createElement('th', {i18n: '#option_default_value'}),
				createElement('th', {i18n: '#option_user_value'}),
			);

			for (let row of this.#optionsManagerRows) {
				row.remove();
			}
			this.#optionsManagerRows.clear();

			for (let [categoryName, category] of this.#categories) {
				for (let option of category) {
					let htmlRow = this.#addOptionRow(option);
					if (htmlRow) {
						this.#optionsManagerRows.add(htmlRow);
						this.#htmlOptionsTable.append(htmlRow);
					}
				}
			}
			I18n.i18n();
			this.#applyFilter();
		}

		#fillCell(cell, type, value) {
			switch (type) {
				case 'string':
					cell.innerHTML = value;
					break;
				case 'shortcut':
					let arr = value.split('+');
					for (let key of arr) {
						createElement('kbd', {
							innerHTML: key,
							parent: cell,
						});
					}
					//cell.innerHTML = value;
					break;
				default:
					cell.innerHTML = value;
			}
		}

		static #getUniqueId() {
			return 'options-manager-' + (this.#uniqueId++);
		}

		#createInput(optionName, option, value, resetButton) {
			let showHideResetButton = () => {
				let defaultValue = this.#defaultValues.get(optionName).dv;
				defaultValue = defaultValue === null ? null : JSON.stringify(defaultValue);
				let optionValue = this.getItem(optionName);
				optionValue = optionValue === null ? null : JSON.stringify(optionValue);
				if ((optionValue) != defaultValue) {
					resetButton.style.opacity = '';
				} else {
					resetButton.style.opacity = '0';
				}
			};

			let htmlElement;
			switch (option.type) {
				case 'number':
				case 'integer':
					htmlElement = createElement('input', {
						value: value,
						events: {
							change: event => {
								let value = event.target.value.trim();
								this.setItem(optionName, value === '' ? null : Number(value));
								showHideResetButton();
							}
						}
					});
					break;
				case 'object':
					htmlElement = createElement('input',  {
						value: JSON.stringify(value),
						events: {
							change: event => {this.setItem(optionName, JSON.parse(event.target.value));showHideResetButton();}
						}
					});
					break;
				case 'boolean':
					htmlElement = createElement('input', {
						type: 'checkbox',
						checked: value,
						events: {
							change: event => {this.setItem(optionName, event.target.checked);showHideResetButton();}
						}
					});
					break;
				case 'list':
					OptionsManager.#getUniqueId();
					htmlElement = createElement('select', {
						value: value,
						events: {
							change: event => {this.setItem(optionName, event.target.value);showHideResetButton();}
						}
					});
					if (option.datalist) {
						for(let o of option.datalist) {
							createElement('option', {innerHTML: o, parent: htmlElement});
						}
					}
					break;
				case 'vec2':
					htmlElement = createElement('input', {
						value: value,
						events: {
							change: event => {this.setItem(optionName, (readVec2Value(event.target.value)));showHideResetButton();}
						}
					});
					break;
				/*case 'editablelist':
					let dataListId = OptionsManager.#getUniqueId();
					htmlElement = createElement('input');
					let datalist = createElement('datalist');
					datalist.id = dataListId;
					htmlElement.setAttribute('list', dataListId);
					document.body.appendChild(datalist);
					if (option.datalist) {
						for(let o of option.datalist) {
							let htmlOption = createElement('option');
							datalist.appendChild(htmlOption);
							htmlOption.innerHTML = o;
						}
					}
					htmlElement.addEventListener('change', event => {this.setItem(optionName, event.target.value);showHideResetButton();});
					break;*/
	/*			case 'vec4':
					htmlElement = createElement('input');
					htmlElement.value = value;//value.join(',');
					function readValue(value) {
						let v = value.split(',');
						if (v.length == 4) {
							return quat.fromValues(v[0] * 1, v[1] * 1, v[2] * 1, v[3] * 1);
						}
						return null;
					}
					htmlElement.addEventListener('change', event => {this.setItem(optionName, (readValue(event.target.value)));showHideResetButton();});
					break;*/
				case 'string':
				case 'color':
				default:
					htmlElement = createElement('input', {
						value: value,
						events: {
							change: event => {this.setItem(optionName, (event.target.value));showHideResetButton();}
						}
					});
					break;
			}
			showHideResetButton();
			return htmlElement;
		}

		showOptionsManager() {
			if (!this.#htmlOptionsManagerContainer) {
				this.#initPanel();
			}
			this.#refreshPanel();
			show(this.#htmlOptionsManagerContainer);
		}

		async getOptionsPerType(type) {
			await this.#initPromise;
			let ret = new Set();

			for (let option of this.#defaultValues.values()) {
				if (option.type == type) {
					let optionName = option.name;
					ret.add([optionName, this.#currentValues.get(optionName)]);
				}
			}
			return ret;
		}

		async getOption(name) {
			await this.#initPromise;
			return this.#defaultValues.get(name);
		}

		async getOptionType(name) {
			await this.#initPromise;
			return this.#defaultValues.get(name)?.type;
		}

		async getList(name) {
			await this.#initPromise;
			 let option = this.#defaultValues.get(name);
			 if (option && option.type == 'list') {
				 return option.datalist;
			 }
		}
	}
	return OptionsManager;
}());


function readVec2Value(value) {
	let v = value.split(',');
	if (v.length == 2) {
		return [v[0] * 1, v[1] * 1];
	}
	return null;
}

class Shortcut {
	constructor(shortcut) {
		this.alt = false;
		this.ctrl = false;
		this.meta = false;
		this.shift = false;
		let keys = shortcut.toUpperCase().split('+');
		for (let key of keys)  {
			switch (key) {
				case 'ALT':
					this.alt = true;
					break;
				case 'CTRL':
					this.ctrl = true;
					break;
				case 'META':
					this.meta = true;
					break;
				case 'SHIFT':
					this.shift = true;
					break;
				case 'PLUS':
					this.key = '+';
					break;
				default:
					this.key = key;
			}
		}
	}

	match(keyBoardEvent) {
		return	(keyBoardEvent.altKey == this.alt) &&
				(keyBoardEvent.ctrlKey == this.ctrl) &&
				(keyBoardEvent.metaKey == this.meta) &&
				(keyBoardEvent.shiftKey == this.shift) &&
				(keyBoardEvent.key.toUpperCase() == this.key);
	}
}

new (function () {
	class ShortcutHandler extends EventTarget {
		constructor() {
			super();
			this.shortcuts = new Map();
			window.addEventListener('keydown', (event) => this.handleKeyDown(event));
		}

		handleKeyDown(event) {
			if (event.target instanceof HTMLInputElement ||
				event.target instanceof HTMLTextAreaElement
				) {
				return;
			}
			for (let [name, shortcuts] of this.shortcuts) {
				for (let shortcut of shortcuts) {
					if (shortcut.match(event)) {
						this.dispatchEvent(new CustomEvent(name, {detail:event}));
						event.preventDefault();
						event.stopPropagation();
					}
				}
			}
		}

		setShortcuts(shortcutMap) {
			if (!shortcutMap) {
				return;
			}
			this.shortcuts.clear();
			for (let [name, shortcut] of shortcutMap) {
				this.addShortcut(name, shortcut);
			}
		}

		setShortcut(name, shortcut) {
			this.shortcuts.delete(name);
			this.addShortcut(name, shortcut);
		}

		addShortcut(name, shortcut) {
			let shortcuts = shortcut.split(';');
			let shortcutSet = this.shortcuts.get(name);
			if (!shortcutSet) {
				shortcutSet = new Set();
				this.shortcuts.set(name, shortcutSet);
			}
			for (let shortcut of shortcuts)  {
				shortcutSet.add(new Shortcut(shortcut));
			}
		}
	}
	return ShortcutHandler;
}());

class EntityAttribute {
	constructor(multiple = false) {
		if (multiple) {
			this._value = new Set();
		} else {
			this._value = undefined;
		}
		this._multiple = multiple;
	}

	clear() {
		if (this._multiple) {
			this._value.clear();
		} else {
			this._value = undefined;
		}
	}

	setValue(value) {
		if (this._multiple) {
			this._value.add(value);
		} else {
			this._value = value;
		}
	}

	removeValue(value) {
		if (this._multiple) {
			this._value.delete(value);
		} else {
			this._value = undefined;
		}
	}
}

class Entity {
	constructor() {
		this._parent = undefined;
		this._childs = new Set();
		this._attributes = new Map();

		this.declareAttribute('Where', true);
		this.declareAttribute('Attributes', true);
		this.declareAttribute('Item', true);
		this.declareAttribute('Tag', true);
		this.declareAttribute('TeleportWhere', true);

		this._attributes[Symbol.iterator] = function* () {
			for (let [name, set] of this.entries()) {
				if (set._multiple) {
					for (let [value] of set._value.entries()) {
						yield [name, value];
					}
				} else {
					yield [name, set._value];
				}
			}
		};
	}

	clear() {
		this._parent = undefined;
		this._childs.clear();
		this._attributes.clear();
	}

	get parent() {
		return this._parent;
	}

	set parent(parent) {
		this._parent = parent;
	}

	/*select(select) {
		this._selected = select;
	}

	get selected() {
		return this._selected;
	}*/

	addChild(child) {
		this._childs.add(child);
	}

	removeChild(child) {
		this._childs.delete(child);
	}

	declareAttribute(attribute, multiple) {
		if (!this._attributes.has(attribute)) {
			let att = new EntityAttribute(multiple);
			this._attributes.set(attribute, att);
		}
	}

	setAttribute(attribute, value) {
		if (this._attributes.has(attribute)) {
			this._attributes.get(attribute).setValue(value);
		} else {
			let att = new EntityAttribute();
			att.setValue(value);
			this._attributes.set(attribute, att);
		}
	}

	hasAttribute(attribute) {
		let attrib = this._attributes.get(attribute);
		if (!attrib) {
			return false;
		} else {
			if (attrib._multiple) {
				return attrib._value.size > 0;
			} else {
				return true;
			}
		}
	}

	getAttribute(attribute) {
		throw 'Error';
	}

	removeAttribute(attribute) {
		throw 'Error';
	}

	removeValues(attribute) {
		if (this._attributes.has(attribute)) {
			this._attributes.get(attribute).clear();
		}
	}

	validate() {
		this.check();
		for (let child of this._childs) {
			child.validate();
		}
	}

	check() {
	}

	write() {
		return true;
	}
}
Entity.prototype.isEntity = true;

class CharacterAttributes extends Entity {
	constructor() {
		super();
	}
}
CharacterAttributes.prototype.isCharacterAttributes = true;

class ItemAttributes extends Entity {
	constructor() {
		super();
	}
}
ItemAttributes.prototype.isItemAttributes = true;

class Mission extends Entity {
	constructor(entity) {
		super(entity);
	}

	check() {
		if (!this.hasAttribute('Where')) {
			this.setAttribute('Where', 'spawnbot');
		}
	}
}
Mission.prototype.isMission = true;
Mission.objectives = new Set().add('').add('DestroySentries').add('Engineer').add('Sniper').add('Spy');

class Output extends Entity {
	constructor() {
		super();
	}
}

class StartWaveOutput extends Output {
	constructor() {
		super();
	}
}

class DoneOutput extends Output {
	constructor() {
		super();
	}
}

class InitWaveOutput extends Output {
	constructor() {
		super();
	}
}

class FirstSpawnOutput extends Output {
	constructor() {
		super();
	}
}

class OnKilledOutput extends Output {
	constructor() {
		super();
	}
}

class OnBombDroppedOutput extends Output {
	constructor() {
		super();
	}
}

class RandomChoice extends Entity {
	constructor() {
		super();
	}
}
RandomChoice.prototype.isRandomChoice = true;

class Squad extends Entity {
	constructor(name = '') {
		super();
	}
}
Squad.prototype.isSquad = true;

class Tank extends Entity {
	constructor(name = '') {
		super();
	}
}
Tank.prototype.isTank = true;

class TFBot extends Entity {
	constructor() {
		super();
	}

	check() {
		if (!this.hasAttribute('Class')) {
			this.setAttribute('Class', 'scout');
		}
	}
}
TFBot.prototype.isTFBot = true;

class Template extends TFBot {
	constructor() {
		super();
	}
}
Template.prototype.isTemplate = true;

class Templates extends Entity {
	constructor(entity) {
		super(entity);
	}

	write() {
		return this._childs.size > 0;
	}
}
Templates.prototype.isTemplates = true;

class Wave extends Entity {
	constructor() {
		super();
		this.name = '';
		this.template = '';
		this.checkpoint = '';
		this.waitwhendone = '';
		this.totalCurrency = 0;
		this.waveDescription = '';
		this.waveStartingSound = '';
	}
}
Wave.prototype.isWave = true;

//import {TFBot, RandomChoice} from '../internal.js';

class Wavespawn extends Entity {
	constructor(entity) {
		super(entity);
		this.setAttribute('TotalCount', 1);
	}

	check() {
		if (!this.hasAttribute('Where')) {
			this.setAttribute('Where', 'spawnbot');
		}
	}

	set randomChoice(randomChoice) {
		let randomChoiceEntity = undefined;
		// Find a RandomChoice child
		for (let child of this._childs) {
			switch (true) {
				case child.isRandomChoice:
					randomChoiceEntity = child;
					break;
			}
		}
		if (randomChoice) {
			if (randomChoiceEntity === undefined) {
				// Create the RandomChoice and re-parent the bots to the RandomChoice
				let random = Application.addRandomChoice(this);
				for (let child of this._childs) {
					if (child.isTFBot) {
						Application.setParent(child, random);
					}
				}
			}
		} else {
			if (randomChoiceEntity !== undefined) {
				// delete the RandomChoice and re-parent the bots to the Wavespawn
				this._childs.delete(randomChoiceEntity);
				for (let child of randomChoiceEntity._childs) {
					if (child.isTFBot) {
						Application.setParent(child, this);
					}
				}
			}
		}
	}
}
Wavespawn.prototype.isWavespawn = true;

class WaveSchedule extends Entity {
	constructor() {
		super();
		this.base = new Set();
		this.currency = "";
		this.respawnTime = "";
		//this.waves = [];
		this.canBotsAttackWhileInSpawnRoom = "";
		this.addSentryBusterWhenDamageDealtExceeds = "";
		this.addSentryBusterWhenKillCountExceeds = "";
		this.advanced = "";
		this.fixedRespawnWaveTime = false;
		this.zombieBots = false;
		//this.currentTab = 'Waves';

		/*this.mapChangeListenerList = new Array();
		this.waitAction = false;
		this.abortAction = false;
		this.resetBomb = false;*/

		this._navigationTags = new Set();
		this._where = new Set();

		this._startingPathTrackNode = new Set();
		this._maps = undefined;
	}

	get maps() {
		if (this._maps) {
			let maps = new Set(['']);
			for (let map in this._maps) {
				maps.add(map);
			}
			return maps;
		}
		return null;
	}

	get map() {
		return this._map;
	}

	set map(map) {
		this._map = map;
		this._navigationTags.clear();
		this._where.clear();
		this._startingPathTrackNode.clear();
		if (this._maps) {
			let mapData = this._maps[map];
			if (mapData) {
				for (let spawn of mapData.spawns) {
					this._where.add(spawn);
				}
				for (let tag of mapData.tags) {
					this._navigationTags.add(tag);
				}
				for (let tankpath of mapData.tankpaths) {
					this._startingPathTrackNode.add(tankpath);
				}
			}
		}
	}

	reset() {
		this.base.clear();
		this.base.add('robot_standard.pop');
		this.base.add('robot_giant.pop');
		this.base.add('robot_gatebot.pop');

		this._navigationTags.clear();
		this._where.clear();
		this._startingPathTrackNode.clear();
	}

	addBase(base) {
		this.base.add(base);
	}

	get navigationTags() {
		return this._navigationTags;
	}

	get where() {
		return this._where;
	}

	get startingPathTrackNode() {
		return this._startingPathTrackNode;
	}

	set startingPathTrackNode(startingPathTrackNode) {
		startingPathTrackNode = startingPathTrackNode.toLowerCase();
		if (!this._startingPathTrackNode.has(startingPathTrackNode)) {
			this._startingPathTrackNode.add(startingPathTrackNode);
		}
	}

}

const PopParser = /*
 * Generated by PEG.js 0.10.0.
 *
 * http://pegjs.org/
 */
(function() {

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function peg$SyntaxError(message, expected, found, location) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.location = location;
    this.name     = "SyntaxError";

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, peg$SyntaxError);
    }
  }

  peg$subclass(peg$SyntaxError, Error);

  peg$SyntaxError.buildMessage = function(expected, found) {
    var DESCRIBE_EXPECTATION_FNS = {
          literal: function(expectation) {
            return "\"" + literalEscape(expectation.text) + "\"";
          },

          "class": function(expectation) {
            var escapedParts = "",
                i;

            for (i = 0; i < expectation.parts.length; i++) {
              escapedParts += expectation.parts[i] instanceof Array
                ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1])
                : classEscape(expectation.parts[i]);
            }

            return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
          },

          any: function(expectation) {
            return "any character";
          },

          end: function(expectation) {
            return "end of input";
          },

          other: function(expectation) {
            return expectation.description;
          }
        };

    function hex(ch) {
      return ch.charCodeAt(0).toString(16).toUpperCase();
    }

    function literalEscape(s) {
      return s
        .replace(/\\/g, '\\\\')
        .replace(/"/g,  '\\"')
        .replace(/\0/g, '\\0')
        .replace(/\t/g, '\\t')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
        .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
    }

    function classEscape(s) {
      return s
        .replace(/\\/g, '\\\\')
        .replace(/\]/g, '\\]')
        .replace(/\^/g, '\\^')
        .replace(/-/g,  '\\-')
        .replace(/\0/g, '\\0')
        .replace(/\t/g, '\\t')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
        .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
    }

    function describeExpectation(expectation) {
      return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
    }

    function describeExpected(expected) {
      var descriptions = new Array(expected.length),
          i, j;

      for (i = 0; i < expected.length; i++) {
        descriptions[i] = describeExpectation(expected[i]);
      }

      descriptions.sort();

      if (descriptions.length > 0) {
        for (i = 1, j = 1; i < descriptions.length; i++) {
          if (descriptions[i - 1] !== descriptions[i]) {
            descriptions[j] = descriptions[i];
            j++;
          }
        }
        descriptions.length = j;
      }

      switch (descriptions.length) {
        case 1:
          return descriptions[0];

        case 2:
          return descriptions[0] + " or " + descriptions[1];

        default:
          return descriptions.slice(0, -1).join(", ")
            + ", or "
            + descriptions[descriptions.length - 1];
      }
    }

    function describeFound(found) {
      return found ? "\"" + literalEscape(found) + "\"" : "end of input";
    }

    return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
  };

  function peg$parse(input, options) {
    options = options !== void 0 ? options : {};

    var peg$FAILED = {},

        peg$startRuleFunctions = { Population: peg$parsePopulation },
        peg$startRuleFunction  = peg$parsePopulation,

        peg$c0 = function(base, waveschedule) { return {base:base, WaveSchedule:waveschedule}},
        peg$c1 = "#base",
        peg$c2 = peg$literalExpectation("#base", false),
        peg$c3 = /^[a-zA-Z0-9_]/,
        peg$c4 = peg$classExpectation([["a", "z"], ["A", "Z"], ["0", "9"], "_"], false, false),
        peg$c5 = ".pop",
        peg$c6 = peg$literalExpectation(".pop", false),
        peg$c7 = function(popname) { return popname.reduce((result, element) => result+=element)+'.pop'; },
        peg$c8 = function(attribute) { return attribute;},
        peg$c9 = "{",
        peg$c10 = peg$literalExpectation("{", false),
        peg$c11 = "}",
        peg$c12 = peg$literalExpectation("}", false),
        peg$c13 = function(attributes) { return attributes;},
        peg$c14 = function(attributes) {return attributes;},
        peg$c15 = function(name, value) { return {name:name, value:value};},
        peg$c16 = peg$otherExpectation("whitespace"),
        peg$c17 = /^[ \t\n\r]/,
        peg$c18 = peg$classExpectation([" ", "\t", "\n", "\r"], false, false),
        peg$c19 = "//",
        peg$c20 = peg$literalExpectation("//", false),
        peg$c21 = /^[^\n]/,
        peg$c22 = peg$classExpectation(["\n"], true, false),
        peg$c23 = "\n",
        peg$c24 = peg$literalExpectation("\n", false),
        peg$c25 = /^[a-zA-Z_]/,
        peg$c26 = peg$classExpectation([["a", "z"], ["A", "Z"], "_"], false, false),
        peg$c27 = function(name) { return name.reduce((result, element) => result+=element); },
        peg$c28 = "\"",
        peg$c29 = peg$literalExpectation("\"", false),
        peg$c30 = /^[^"""]/,
        peg$c31 = peg$classExpectation(["\"", "\"", "\""], true, false),
        peg$c32 = /^[a-zA-Z0-9_.\-+]/,
        peg$c33 = peg$classExpectation([["a", "z"], ["A", "Z"], ["0", "9"], "_", ".", "-", "+"], false, false),
        peg$c34 = function(value) { return value.reduce((result, element) => result+=element); },

        peg$currPos          = 0,
        peg$posDetailsCache  = [{ line: 1, column: 1 }],
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function peg$literalExpectation(text, ignoreCase) {
      return { type: "literal", text: text, ignoreCase: ignoreCase };
    }

    function peg$classExpectation(parts, inverted, ignoreCase) {
      return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
    }

    function peg$endExpectation() {
      return { type: "end" };
    }

    function peg$otherExpectation(description) {
      return { type: "other", description: description };
    }

    function peg$computePosDetails(pos) {
      var details = peg$posDetailsCache[pos], p;

      if (details) {
        return details;
      } else {
        p = pos - 1;
        while (!peg$posDetailsCache[p]) {
          p--;
        }

        details = peg$posDetailsCache[p];
        details = {
          line:   details.line,
          column: details.column
        };

        while (p < pos) {
          if (input.charCodeAt(p) === 10) {
            details.line++;
            details.column = 1;
          } else {
            details.column++;
          }

          p++;
        }

        peg$posDetailsCache[pos] = details;
        return details;
      }
    }

    function peg$computeLocation(startPos, endPos) {
      var startPosDetails = peg$computePosDetails(startPos),
          endPosDetails   = peg$computePosDetails(endPos);

      return {
        start: {
          offset: startPos,
          line:   startPosDetails.line,
          column: startPosDetails.column
        },
        end: {
          offset: endPos,
          line:   endPosDetails.line,
          column: endPosDetails.column
        }
      };
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildStructuredError(expected, found, location) {
      return new peg$SyntaxError(
        peg$SyntaxError.buildMessage(expected, found),
        expected,
        found,
        location
      );
    }

    function peg$parsePopulation() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseBase();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseBase();
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseWaveSchedule();
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                s1 = peg$c0(s2, s4);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseBase() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c1) {
        s1 = peg$c1;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c2); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = [];
          if (peg$c3.test(input.charAt(peg$currPos))) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c4); }
          }
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            if (peg$c3.test(input.charAt(peg$currPos))) {
              s4 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c4); }
            }
          }
          if (s3 !== peg$FAILED) {
            if (input.substr(peg$currPos, 4) === peg$c5) {
              s4 = peg$c5;
              peg$currPos += 4;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c6); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                s1 = peg$c7(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseWaveSchedule() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseAttribute();
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            s1 = peg$c8(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseEntity() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 123) {
        s1 = peg$c9;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c10); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseAttributes();
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 125) {
                s5 = peg$c11;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c12); }
              }
              if (s5 !== peg$FAILED) {
                s1 = peg$c13(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseAttributes() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseAttribute();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parseAttribute();
      }
      if (s1 !== peg$FAILED) {
        s1 = peg$c14(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseAttribute() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseName();
        if (s2 === peg$FAILED) {
          s2 = peg$parseQuotedName();
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseValue();
            if (s4 === peg$FAILED) {
              s4 = peg$parseQuotedValue();
              if (s4 === peg$FAILED) {
                s4 = peg$parseEntity();
              }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                s1 = peg$c15(s2, s4);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parse_() {
      var s0, s1;

      peg$silentFails++;
      s0 = [];
      if (peg$c17.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c18); }
      }
      if (s1 === peg$FAILED) {
        s1 = peg$parseComment();
      }
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        if (peg$c17.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c18); }
        }
        if (s1 === peg$FAILED) {
          s1 = peg$parseComment();
        }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c16); }
      }

      return s0;
    }

    function peg$parseComment() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c19) {
        s1 = peg$c19;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c20); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c21.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c22); }
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          if (peg$c21.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c22); }
          }
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 10) {
            s3 = peg$c23;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c24); }
          }
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseName() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      if (peg$c25.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c26); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c25.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c26); }
          }
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        s1 = peg$c27(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseQuotedName() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 34) {
        s1 = peg$c28;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c29); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c30.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c31); }
        }
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            if (peg$c30.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c31); }
            }
          }
        } else {
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 34) {
            s3 = peg$c28;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c29); }
          }
          if (s3 !== peg$FAILED) {
            s1 = peg$c27(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseValue() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      if (peg$c32.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c33); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c32.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c33); }
          }
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        s1 = peg$c34(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseQuotedValue() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 34) {
        s1 = peg$c28;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c29); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c30.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c31); }
        }
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            if (peg$c30.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c31); }
            }
          }
        } else {
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 34) {
            s3 = peg$c28;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c29); }
          }
          if (s3 !== peg$FAILED) {
            s1 = peg$c34(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail(peg$endExpectation());
      }

      throw peg$buildStructuredError(
        peg$maxFailExpected,
        peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
        peg$maxFailPos < input.length
          ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
          : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
      );
    }
  }

  return {
    SyntaxError: peg$SyntaxError,
    parse:       peg$parse
  };
})();

class PopReader {
	constructor() {
	}

	read(content, isStockTemplate){
		Application.updating = false;
		let parsed = PopParser.parse(content);
		if (parsed) {
			this.entities = [];
			this.currentEntity = null;
			for (let i in parsed.base) {
				Application.addBase(parsed.base[i]);
			}
			this.parseAttribute(parsed.WaveSchedule, isStockTemplate);
		}
		Application.updating = true;
	}

	parseAttribute(attribute, isStockTemplate) {
		if (attribute.value instanceof Array) {
			let entity = null;
			switch (attribute.name.toLowerCase()) {
				case 'waveschedule':
					entity = Application.waveSchedule;
					break;
				case 'mission':
					entity = Application.addMission();
					break;
				case 'wave':
					entity = Application.addWave();
					break;
				case 'wavespawn':
					entity = Application.addWavespawn(this.currentEntity);
					break;
				case 'tfbot':
					entity = Application.addBot(this.currentEntity);
					break;
				case 'tank':
					entity = Application.addTank(this.currentEntity);
					break;
				case 'squad':
					entity = Application.addSquad(this.currentEntity);
					break;
				case 'randomchoice':
					entity = Application.addRandomChoice(this.currentEntity);
					break;
				case 'characterattributes':
					entity = Application.addCharacterAttributes(this.currentEntity);
					break;
				case 'itemattributes':
					entity = Application.addItemAttributes(this.currentEntity);
					break;
				case 'startwaveoutput':
					entity = Application.addOutput(StartWaveOutput, this.currentEntity);
					break;
				case 'doneoutput':
					entity = Application.addOutput(DoneOutput, this.currentEntity);
					break;
				case 'initwaveoutput':
					entity = Application.addOutput(InitWaveOutput, this.currentEntity);
					break;
				case 'firstspawnoutput':
					entity = Application.addOutput(FirstSpawnOutput, this.currentEntity);
					break;
				case 'onkilledoutput':
					entity = Application.addOutput(OnKilledOutput, this.currentEntity);
					break;
				case 'onbombdroppedoutput':
					entity = Application.addOutput(OnBombDroppedOutput, this.currentEntity);
					break;
				case 'templates':
					entity = Application.getTemplates();
					break;
				default:
					if (this.currentEntity.isTemplates) {
						entity = Application.addTemplate(this.currentEntity);
						if (isStockTemplate) {
							entity.isStockTemplate = true;
						}
					} else {
						//console.error('Unknown attribute ', attribute.name);
						// add a basic entity
						entity = Application.addEntity(this.currentEntity);
					}
					entity.entityName = attribute.name.toLowerCase();
			}
			if (entity) {
				this.entities.push(entity);
				this.currentEntity = entity;
				attribute.value.forEach(element => this.parseAttribute(element, isStockTemplate));
				Application.updateView(entity);
				this.entities.pop();
				this.currentEntity = this.entities[this.entities.length - 1];
			}

		} else {
			if (this.currentEntity) {
				this.currentEntity.setAttribute(attribute.name, attribute.value);
			}
		}

	}
}

//import {Entity, Template, WaveSchedule} from './internal.js';

const endLine = '\r\n';
class PopWriterEntity {
	constructor(name) {
		this.name = name;
		this.values = new Set();
	}

	add(entity) {
		this.values.add(entity);
	}

	toString(tabs = '') {
		let s = '';
		if (this.base) {
			for (let base of this.base) {
				s += '#base ' + base + endLine;
			}
		}

		s = s + tabs + this.name + endLine + tabs +'{' + endLine;
		let tabs2 = tabs + '\t';
		for (let value of this.values) {
			s += value.toString(tabs2);
		}
		s = s + tabs + '}' + endLine;
		return s;
	}
}
function formatString(str) {
	if (str)
	if ((typeof str === 'string') && str.includes(' ')) {
		return '\"' + str + '\"';
	}
	return str;
}
class PopWriterAttribute {
	constructor(name, value) {
		this.name = name;
		this.value = value;
	}

	toString(tabs) {
		let s = tabs + formatString(this.name) + ' ' + formatString(this.value) + endLine;
		return s;
	}
}

class PopWriter {
	constructor() {
		this.begin();
	}

	write(entity) {
		this.begin();
		this._writeEntity(entity);
		return this.toString();
	}

	_writeEntity(entity) {
		if (entity.isEntity && !entity.isStockTemplate) {
			let className = entity.constructor.name;
			if (entity.entityName !== undefined) {
				className = entity.entityName;
			}
			this.beginEntity(className);

			if (entity.isWaveSchedule) {
				if (this.currentEntity) {
					this.currentEntity.base = entity.base;
				}
			}

			for (let [name, value] of entity._attributes) {
				this.addAttribute(name, value);
			}
			for (let child of entity._childs) {
				this._writeEntity(child);
			}
			this.endEntity();
		}
	}

	begin() {
		this.currentEntity = null;
		this.entities = [];
	}

	beginEntity(name) {
		let entity = new PopWriterEntity(name);
		if (this.currentEntity) {
			this.currentEntity.add(entity);
			this.entities.push(this.currentEntity);
		}
		this.currentEntity = entity;
	}

	endEntity() {
		let entity = this.entities.pop();
		if (entity) {
			this.currentEntity = entity;
		}
		return entity;
	}

	addAttribute(name, value) {
		let attribute = new PopWriterAttribute(name, value);
		if (this.currentEntity) {
			this.currentEntity.add(attribute);
		}
	}

	toString() {
		while(this.endEntity());
		if (this.currentEntity) {
			return this.currentEntity.toString();
		}
		return null;
	}
}

var img = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 0 24 24' width='24'%3e%3cpath d='M0 0h24v24H0z' fill='none'/%3e%3cpath d='M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'/%3e%3c/svg%3e";

const DataURL = {
	'remove_circle_outline-24px.svg': img,
};

const Images = new Map();

async function getImg(name) {
	if (Images.has(name)) {
		return Images.get(name)
	}

	let promise = new Promise(async resolve => {
		let res = await fetch(DataURL[name]);
		resolve(await res.text());
	});

	Images.set(name, promise);
	return promise;
}

class EntityView {
	constructor(entity) {
		this.entity = entity;
	}

	create() {
		this.htmlElement = createElement('div');

		this.htmlremoveButton = createElement('button', {
			class: 'entity-remove-button',
			events: {
				click: () => {
					Application.removeEntity(this.entity);
				}
			},
		});

		(async () => {
			this.htmlremoveButton.innerHTML = await getImg('remove_circle_outline-24px.svg');
		})();
	}

	update() {
	}
}

class CharacterAttributesView extends EntityView {
	constructor(entity) {
		super(entity);
		this.create();
	}

	create() {
		super.create();
		this.htmlElement.className = 'entity-view-characterattributes';
		this.htmlElement.innerHTML = 'characterattributes';

		//this.htmlremoveButton.className = 'entity-view-characterattributes-remove';
		this.htmlremoveButton.innerHTML = 'Remove characterattributes';

		this.htmlElement.append(this.htmlremoveButton);
	}

	update() {
		this.htmlElement.innerHTML = 'characterattributes';
		for (let [name, value] of this.entity._attributes) {
			//console.error(name, value);
			this.htmlElement.innerHTML += (name + ' ' + value + ' ');

			/*switch (name.toLowerCase()) {
				case 'Template' :
			}*/
		}
	}
}

class ItemAttributesView extends EntityView {
	constructor(entity) {
		super(entity);
		this.create();
	}

	create() {
		super.create();
		this.htmlElement.className = 'entity-view-itemattributes';
		this.htmlElement.innerHTML = 'itemattributes';

		//this.htmlremoveButton.className = 'entity-view-itemattributes-remove';
		this.htmlremoveButton.innerHTML = 'Remove itemattributes';

		this.htmlElement.append(this.htmlremoveButton);
	}

	update() {
		this.htmlElement.innerHTML = 'characterattributes';
		for (let [name, value] of this.entity._attributes) {
			//console.error(name, value);
			this.htmlElement.innerHTML += (name + ' ' + value + ' ');

			/*switch (name.toLowerCase()) {
				case 'Template' :
			}*/
		}
	}
}

((function () {
	styleInject$2(`@media (prefers-color-scheme:light){:root{--mindalka-ui-background-primary:#ccc;--mindalka-ui-background-secondary:#f9f9fb;--mindalka-ui-background-tertiary:#fff;--mindalka-ui-input-background-primary:#aaa;--mindalka-ui-input-background-secondary:#ccc;--mindalka-ui-input-background-tertiary:#4e4e4e;--mindalka-ui-border-primary:#222;--mindalka-ui-border-secondary:#222;--mindalka-ui-input-border-primary:#222;--mindalka-ui-input-border-secondary:#222;--mindalka-ui-text-primary:#222;--mindalka-ui-text-secondary:#222;--mindalka-ui-text-inactive:#9e9e9ea6;--mindalka-ui-text-link:#0069c2;--mindalka-ui-text-invert:#fff;--mindalka-ui-accent-primary:#1072eb;--mindalka-ui-accent-secondary:#1040c1;--mindalka-ui-scrollbar-bg:transparent;--mindalka-ui-scrollbar-color:rgba(0,0,0,.25)}}@media (prefers-color-scheme:dark){:root{--mindalka-ui-background-primary:#1b1b1b;--mindalka-ui-background-secondary:#464747;--mindalka-ui-background-tertiary:#4e4e4e;--mindalka-ui-input-background-primary:#555;--mindalka-ui-input-background-secondary:#333;--mindalka-ui-input-background-tertiary:#fff;--mindalka-ui-border-primary:#858585;--mindalka-ui-border-secondary:#696969;--mindalka-ui-input-border-primary:#aaa;--mindalka-ui-input-border-secondary:#696969;--mindalka-ui-text-primary:#fff;--mindalka-ui-text-secondary:#cdcdcd;--mindalka-ui-text-inactive:#cdcdcda6;--mindalka-ui-text-link:#8cb4ff;--mindalka-ui-text-invert:#1b1b1b;--mindalka-ui-accent-primary:#1072eb;--mindalka-ui-accent-secondary:#1040c1;--mindalka-ui-scrollbar-bg:transparent;--mindalka-ui-scrollbar-color:hsla(0,0%,100%,.25)}}`);
})());

if (window.customElements) {
	styleInject$2(``);
	customElements.define('mindalka-select', MindalkaSelect);
}

class MissionView extends EntityView {
	constructor(entity) {
		super(entity);
		this.create();
	}

	create() {
		super.create();
		this.htmlElement.className = 'entity-view-mission';
		this.htmlElement.innerHTML = 'mission';

		//this.htmlremoveButton.className = 'entity-view-mission-remove';
		//this.htmlremoveButton.innerHTML = 'Remove mission';

		this.htmlAddBotButton = document.createElement('button');//removeme
		this.htmlAddBotButton.id = 'entity-view-wavespawn-add-bot';
		this.htmlAddBotButton.innerHTML = 'Add bot';
		this.htmlAddBotButton.addEventListener('click', (event) => Application.addBot(this.entity));

		this.htmlObjective = document.createElement('label');
		this.htmlObjectiveInput = createElement('mindalka-select');
		this.htmlObjectiveInput.setOptions(Mission.objectives);
		this.htmlObjective.append('Objective', this.htmlObjectiveInput);

		this.htmlWhere = document.createElement('label');
		this.htmlWhereInput = createElement('mindalka-select');
		this.htmlWhereInput.setAttribute('multiple', true);
		this.htmlWhere.append('Where', this.htmlWhereInput);

		this.htmlCooldownTime = document.createElement('label');
		this.htmlCooldownTimeInput = document.createElement('input');
		this.htmlCooldownTimeInput.addEventListener('input', (event) => this.entity.setAttribute('CooldownTime', event.target.value));
		this.htmlCooldownTime.append('Cooldown time', this.htmlCooldownTimeInput);

		this.htmlInitialCooldown = document.createElement('label');
		this.htmlInitialCooldownInput = document.createElement('input');
		this.htmlInitialCooldownInput.addEventListener('input', (event) => this.entity.setAttribute('InitialCooldown', event.target.value));
		this.htmlInitialCooldown.append('Initial cooldown', this.htmlInitialCooldownInput);

		this.htmlBeginAtWave = document.createElement('label');
		this.htmlBeginAtWaveInput = document.createElement('input');
		this.htmlBeginAtWaveInput.addEventListener('input', (event) => this.entity.setAttribute('BeginAtWave', event.target.value));
		this.htmlBeginAtWave.append('Begin at wave', this.htmlBeginAtWaveInput);

		this.htmlRunForThisManyWaves = document.createElement('label');
		this.htmlRunForThisManyWavesInput = document.createElement('input');
		this.htmlRunForThisManyWavesInput.addEventListener('input', (event) => this.entity.setAttribute('RunForThisManyWaves', event.target.value));
		this.htmlRunForThisManyWaves.append('Run for this many waves', this.htmlRunForThisManyWavesInput);

		this.htmlDesiredCount = document.createElement('label');
		this.htmlDesiredCountInput = document.createElement('input');
		this.htmlDesiredCountInput.addEventListener('input', (event) => this.entity.setAttribute('DesiredCount', event.target.value));
		this.htmlDesiredCount.append('Desired count', this.htmlDesiredCountInput);


		this.botContainer = document.createElement('div');
		this.botContainer.className = 'entity-view-mission-bots';

		this.htmlElement.append(this.htmlremoveButton, /*this.htmlAddBotButton, */this.htmlObjective, this.htmlWhere,
			this.htmlCooldownTime, this.htmlInitialCooldown, this.htmlBeginAtWave, this.htmlRunForThisManyWaves, this.htmlDesiredCount,
			this.botContainer);
	}

	update() {
		this.htmlWhereInput.setOptions(Application.where);
		this.botContainer.innerHTML = '';
		this.htmlAddBotButton.disabled = false;
		this.htmlWhereInput.unselectAll();
		this.htmlObjectiveInput.unselectAll();
		this.htmlCooldownTimeInput.value = '';
		this.htmlInitialCooldownInput.value = '';
		this.htmlBeginAtWaveInput.value = '';
		this.htmlRunForThisManyWavesInput.value = '';
		this.htmlDesiredCountInput.value = '';
		for (let child of this.entity._childs) {
			let view = Application.getView(child);
			switch (true) {
				case child.isTFBot:
					this.botContainer.append(view.htmlElement);
					this.htmlAddBotButton.disabled = true;
					break;
			}
		}
		for (let [name, value] of this.entity._attributes) {
			switch (name.toLowerCase()) {
				case 'where' :
					this.htmlWhereInput.select(value.toLowerCase());
					break;
				case 'objective' :
					this.htmlObjectiveInput.select(value.toLowerCase());
					break;
				case 'cooldowntime' :
					this.htmlCooldownTimeInput.value = value;
					break;
				case 'initialcooldown' :
					this.htmlInitialCooldownInput.value = value;
					break;
				case 'beginatwave' :
					this.htmlBeginAtWaveInput.value = value;
					break;
				case 'runforthismanywaves' :
					this.htmlRunForThisManyWavesInput.value = value;
					break;
				case 'desiredcount' :
					this.htmlDesiredCountInput.value = value;
					break;
				default:
					console.error(name, value);
					break;
			}
		}
	}
}

class OutputView extends EntityView {
	constructor(entity) {
		super(entity);
		this.create();
	}

	create() {
		super.create();
		this.htmlElement.className = 'entity-view-output';
		this.htmlElement.innerHTML = 'Output';

		//this.htmlremoveButton.className = 'entity-view-tank-remove';
		this.htmlremoveButton.innerHTML = 'Remove tank';//?

		this.htmlElement.append(this.htmlremoveButton);
	}

	update() {

	}
}

class RandomChoiceView extends EntityView {
	constructor(entity) {
		super(entity);
		this.create();
	}

	create() {
		super.create();
		this.htmlElement.className = 'entity-view-randomchoice';

		this.htmlAddBotButton = document.createElement('button');
		this.htmlAddBotButton.className = 'entity-view-wavespawn-add-bot';
		this.htmlAddBotButton.innerHTML = 'Add bot';
		this.htmlAddBotButton.addEventListener('click', (event) => Application.addBot(this.entity));

		this.botContainer = document.createElement('div');
		this.botContainer.className = 'entity-view-randomchoice-bots';
		this.htmlElement.append(this.htmlAddBotButton, this.botContainer);
	}

	update() {
		this.botContainer.innerHTML = '';
		for (let child of this.entity._childs) {
			//console.error('child : ', child);
			let view = Application.getView(child);
			switch (true) {
				case child.isTFBot:
					this.botContainer.append(view.htmlElement);
					break;
			}
		}
	}
}

class SquadView extends EntityView {
	constructor(entity) {
		super(entity);
		this.create();
	}

	create() {
		super.create();
		this.htmlElement.className = 'entity-view-squad';
		this.htmlElement.innerHTML = 'Squad';


		this.htmlFormationSize = document.createElement('label');
		this.htmlFormationSizeInput = document.createElement('input');
		this.htmlFormationSizeInput.addEventListener('input', (event) => this.entity.setAttribute('FormationSize', event.target.value));
		this.htmlFormationSize.append('FormationSize', this.htmlFormationSizeInput);

		this.htmlAddBotButton = document.createElement('button');
		this.htmlAddBotButton.id = 'entity-view-wavespawn-add-bot';
		this.htmlAddBotButton.innerHTML = 'Add bot';
		this.htmlAddBotButton.addEventListener('click', (event) => Application.addBot(this.entity));

		this.botContainer = document.createElement('div');
		this.botContainer.className = 'entity-view-squad-bots';

		this.htmlElement.append(this.htmlremoveButton, this.htmlFormationSize, this.htmlAddBotButton, this.botContainer);
	}

	update() {
		this.botContainer.innerHTML = '';
		for (let child of this.entity._childs) {
			let view = Application.getView(child);
			switch (true) {
				case child.isTFBot:
					this.botContainer.append(view.htmlElement);
					break;
			}
		}

		for (let [name, value] of this.entity._attributes) {
			switch (name.toLowerCase()) {
				case 'formationsize' :
					this.htmlFormationSizeInput.value = value;
					break;
				default:
					console.error(name, value);
					break;
			}
		}
	}
}

class TankView extends EntityView {
	constructor(entity) {
		super(entity);
		this.create();
	}

	create() {
		super.create();
		this.htmlElement.className = 'entity-view-tank';
		this.htmlElement.innerHTML = 'Tank';

		//this.htmlremoveButton.className = 'entity-view-tank-remove';
		this.htmlremoveButton.innerHTML = 'Remove tank';

		this.htmlName = document.createElement('label');
		this.htmlNameInput = document.createElement('input');
		this.htmlNameInput.addEventListener('input', (event) => this.entity.setAttribute('Health', event.target.value));
		this.htmlName.append('Name', this.htmlNameInput);

		this.htmlHealth = document.createElement('label');
		this.htmlHealthInput = document.createElement('input');
		this.htmlHealthInput.addEventListener('input', (event) => this.entity.setAttribute('Health', event.target.value));
		this.htmlHealth.append('Health', this.htmlHealthInput);

		this.htmlSpeed = document.createElement('label');
		this.htmlSpeedInput = document.createElement('input');
		this.htmlSpeedInput.addEventListener('input', (event) => this.entity.setAttribute('Speed', event.target.value));
		this.htmlSpeed.append('Speed', this.htmlSpeedInput);

		this.htmlSkin = document.createElement('label');
		this.htmlSkinInput = document.createElement('input');
		this.htmlSkinInput.addEventListener('input', (event) => this.entity.setAttribute('Speed', event.target.value));
		this.htmlSkin.append('Skin', this.htmlSkinInput);

		this.htmlStartingPathTrackNode = document.createElement('label');
		this.htmlStartingPathTrackNodeInput = document.createElement('mindalka-select');
		this.htmlStartingPathTrackNode.append('Starting path track node', this.htmlStartingPathTrackNodeInput);
		this.htmlStartingPathTrackNodeInput.addEventListener('input', (event) => this.entity.setAttribute('StartingPathTrackNode', event.target.value));

		this.htmlElement.append(this.htmlremoveButton, this.htmlName, this.htmlHealth, this.htmlSpeed, this.htmlSkin, this.htmlStartingPathTrackNode);
	}

	update() {
		this.htmlStartingPathTrackNodeInput.setOptions(Application.startingPathTrackNode);
		this.htmlNameInput.value = '';
		this.htmlHealthInput.value = '';
		this.htmlSpeedInput.value = '';
		this.htmlSkinInput.value = '';
		this.htmlStartingPathTrackNodeInput.unselectAll();


		for (let child of this.entity._childs) {
			Application.getView(child);
			switch (true) {
				default:
					console.error(child);
					break;
			}
		}

		let nonePathSelected = true;
		for (let [name, value] of this.entity._attributes) {
			switch (name.toLowerCase()) {
				case 'name' :
					this.htmlNameInput.value = value;
					break;
				case 'health' :
					this.htmlHealthInput.value = value;
					break;
				case 'speed' :
					this.htmlSpeedInput.value = value;
					break;
				case 'skin' :
					this.htmlSkinInput.value = value;
					break;				case 'startingpathtracknode' :
					this.htmlStartingPathTrackNodeInput.select(value.toLowerCase());
					Application.startingPathTrackNode = value;
					nonePathSelected = false;
					break;
				default:
					console.error(name, value);
					break;
			}
		}
		if (nonePathSelected) {
			this.htmlStartingPathTrackNodeInput.selectFirst();
		}
	}
}

const NEW_TEMPLATE_NAME = 'new_template';
class TemplatesView extends EntityView {
	constructor(entity) {
		super(entity);
		this.create();
		this.templates = new Set();
		this.selectedTemplate = '';
	}

	create() {
		super.create();
		this.htmlElement.className = 'entity-view-templates';

		//this.htmlremoveButton.className = 'entity-view-mission-remove';
		this.htmlremoveButton.innerHTML = 'Remove mission';

		this.htmlAddTemplateButton = document.createElement('button');
		this.htmlAddTemplateButton.className = 'entity-view-wavespawn-add-bot';
		this.htmlAddTemplateButton.innerHTML = 'Add template';
		this.htmlAddTemplateButton.addEventListener('click', (event) => {
			let entity = Application.addTemplate(this.entity);
			entity.entityName = NEW_TEMPLATE_NAME;
			entity.entityNameEditable = true;
			this.selectedTemplate = NEW_TEMPLATE_NAME;
			this.templates.add(NEW_TEMPLATE_NAME);
			this.update();
			Application.updateView(entity);
		});

		this.htmlSelect = document.createElement('label');
		this.htmlSelectInput = document.createElement('mindalka-select');
		this.htmlSelect.append('Template', this.htmlSelectInput);


		this.htmlSelectInput.addEventListener('input', (event) => {
			//console.error(event);
			this.selectedTemplate = event.target.value.toLowerCase();
			setTimeout(() => this.update2(), 10);
		});

		this.botContainer = document.createElement('div');
		this.botContainer.className = 'entity-view-mission-bots';

		this.templateDataList = document.createElement('datalist');
		this.templateDataList.id = 'entity-view-waveschedule-template-datalist';

		this.htmlElement.append(this.htmlAddTemplateButton, this.htmlSelect, this.botContainer, this.templateDataList);
	}

	update() {
		this.templateDataList.innerHTML = '';
		this.templates.clear();
		this.update2();
		this.htmlSelectInput.setOptions(this.templates);
		this.htmlSelectInput.select(this.selectedTemplate);

		for (let template of this.templates) {
			let option = document.createElement('option');
			option.innerHTML = option.value = template;
			this.templateDataList.append(option);
		}
	}

	update2() {
		this.htmlAddTemplateButton.disabled = false;
		this.botContainer.innerHTML = '';
		for (let child of this.entity._childs) {
			let view = Application.getView(child);
			switch (true) {
				case child.isTemplate:
					if (child.entityName === NEW_TEMPLATE_NAME) {
						this.htmlAddTemplateButton.disabled = true;
					}
					if (this.selectedTemplate === child.entityName) {
						this.botContainer.append(view.htmlElement);
					}
					//this.htmlSelectInput.select(value.toLowerCase());
					this.templates.add(child.entityName);
					break;
				default:
					console.error(child);
					break;
			}
		}
	}
}

const TF2_CLASSES = new Set().add(' ').add('scout').add('soldier').add('pyro').add('demoman').add('heavyweapons').add('medic').add('sniper').add('spy').add('engineer');
const BOT_SKILLS = new Set().add('').add('easy').add('normal').add('hard').add('expert');


const WEAPON_RESTRICTION = new Set().add('all').add('primaryonly').add('secondaryonly').add('meleeonly');//new Array('All', 'PrimaryOnly', 'SecondaryOnly', 'MeleeOnly');
const BOT_BEHAVIOUR = new Set().add('none').add('push').add('iddler').add('mobber');//new Array('none', 'push', 'iddler', 'mobber');
//TFBot.slots = new Array('Primary weapon', 'Secondary weapon', 'Melee weapon', 'Hat', 'Misc 1', 'Misc 2', 'Misc 3', 'Misc 4');
const BOT_ATTRIBUTES = new Set().add('SpawnWithFullCharge').add('AlwaysCrit').add('HoldFireUntilFullReload').add('RemoveOnDeath').add('SuppressFire').add('DisableDodge').add('BecomeSpectatorOnDeath').add('RetainBuildings').add('MiniBoss').add('UseBossHealthBar').add('TeleportToHint').add('AlwaysFireWeapon').add('IgnoreFlag').add('AutoJump');
														//new Array('SpawnWithFullCharge','AlwaysCrit', 'HoldFireUntilFullReload', 'RemoveOnDeath', 'SuppressFire', 'DisableDodge', 'BecomeSpectatorOnDeath', 'RetainBuildings', 'MiniBoss', 'UseBossHealthBar', 'TeleportToHint', /*'DefensiveBuffHigh', */ 'AlwaysFireWeapon', 'IgnoreFlag', 'AutoJump');

class TFBotView extends EntityView {
	constructor(entity) {
		super(entity);
		this.create();
	}

	create() {
		super.create();
		this.htmlElement.className = 'entity-view-bot';
		this.htmlTitle = document.createElement('div');
		this.htmlElement.append(this.htmlTitle);

		//this.htmlremoveButton.className = 'entity-view-bot-remove';
		//this.htmlremoveButton.innerHTML = 'Remove bot';
		if (!(this.entity.isTemplate)) {
			this.htmlElement.append(this.htmlremoveButton);
		}

		this.htmlClassIcon = document.createElement('div');

		this.htmlName = document.createElement('label');
		this.htmlNameInput = document.createElement('input');
		this.htmlNameInput.addEventListener('input', (event) => this.entity.setAttribute('Name', event.target.value));
		this.htmlName.append('Name', this.htmlNameInput);

		this.htmlTemplateName = document.createElement('label');
		this.htmlTemplateNameInput = document.createElement('input');
		this.htmlTemplateNameInput.addEventListener('change', (event) => {
			if (this.entity.entityNameEditable) {
				this.entity.entityName = event.target.value;
				Application.getView(this.entity.parent).selectedTemplate = this.entity.entityName;
				Application.updateView(this.entity.parent);
				this.update();
			}
		});
		this.htmlTemplateName.append('Template name', this.htmlTemplateNameInput);

		this.htmlTemplate = document.createElement('label');
		this.htmlTemplateInput = document.createElement('input');
		this.htmlTemplateInput.datalist = 'entity-view-waveschedule-template-datalist';
		this.htmlTemplateInput.setAttribute('list', 'entity-view-waveschedule-template-datalist');
		this.htmlTemplateInput.addEventListener('input', (event) => this.entity.setAttribute('Template', event.target.value));
		this.htmlTemplate.append('Template', this.htmlTemplateInput);

		this.htmlClass = document.createElement('label');
		this.htmlClassInput = createElement('mindalka-select');
		this.htmlClassInput.setOptions(TF2_CLASSES);
		this.htmlClassInput.addEventListener('input', (event) => this.entity.setAttribute('Class', event.target.value));
		this.htmlClass.append('Class', this.htmlClassInput);

		this.htmlSkill = document.createElement('label');
		this.htmlSkillInput = document.createElement('mindalka-select');
		this.htmlSkillInput.setOptions(BOT_SKILLS);
		this.htmlSkillInput.addEventListener('input', (event) => this.entity.setAttribute('Skill', event.target.value));
		this.htmlSkill.append('Skill', this.htmlSkillInput);

		this.htmlMaxVisionRange = document.createElement('label');
		this.htmlMaxVisionRangeInput = document.createElement('input');
		this.htmlMaxVisionRangeInput.addEventListener('input', (event) => this.entity.setAttribute('MaxVisionRange', event.target.value));
		this.htmlMaxVisionRange.append('Max vision range', this.htmlMaxVisionRangeInput);

		this.htmlHealth = document.createElement('label');
		this.htmlHealthInput = document.createElement('input');
		this.htmlHealthInput.addEventListener('input', (event) => this.entity.setAttribute('Health', event.target.value));
		this.htmlHealth.append('Health', this.htmlHealthInput);

		this.htmlScale = document.createElement('label');
		this.htmlScaleInput = document.createElement('input');
		this.htmlScaleInput.addEventListener('input', (event) => this.entity.setAttribute('Scale', event.target.value));
		this.htmlScale.append('Scale', this.htmlScaleInput);

		this.htmlAttributes = document.createElement('label');
		this.htmlAttributesInput = document.createElement('mindalka-select');
		this.htmlAttributesInput.setOptions(BOT_ATTRIBUTES);
		this.htmlAttributesInput.setAttribute('multiple', true);
		this.htmlAttributesInput.addEventListener('input', (event) => {
			this.entity.removeValues('Attributes');
			for (let option of event.target.selectedOptions) {
				this.entity.setAttribute('Attributes', option.value);
			}
		});
		this.htmlAttributes.append('Attributes', this.htmlAttributesInput);

		this.htmlWeaponRestriction = document.createElement('label');
		this.htmlWeaponRestrictionInput = document.createElement('mindalka-select');
		this.htmlWeaponRestrictionInput.setOptions(WEAPON_RESTRICTION);
		this.htmlWeaponRestrictionInput.addEventListener('input', (event) => this.entity.setAttribute('WeaponRestriction', event.target.value));
		this.htmlWeaponRestriction.append('Weapon restriction', this.htmlWeaponRestrictionInput);

		this.htmlNavigationTags = document.createElement('label');
		this.htmlNavigationTagsInput = document.createElement('mindalka-select');
		this.htmlNavigationTagsInput.setOptions(BOT_ATTRIBUTES);
		this.htmlNavigationTagsInput.setAttribute('multiple', true);
		this.htmlNavigationTagsInput.addEventListener('input', (event) => {
			this.entity.removeValues('Tag');
			for (let option of event.target.selectedOptions) {
				this.entity.setAttribute('Tag', option.value);
			}
		});
		this.htmlNavigationTags.append('Navigation tags', this.htmlNavigationTagsInput);

		this.htmlBehaviorModifiers = document.createElement('label');
		this.htmlBehaviorModifiersInput = document.createElement('mindalka-select');
		this.htmlBehaviorModifiersInput.setOptions(BOT_BEHAVIOUR);
		this.htmlBehaviorModifiersInput.addEventListener('input', (event) => this.entity.setAttribute('BehaviorModifiers', event.target.value));
		this.htmlBehaviorModifiers.append('Behavior modifiers', this.htmlBehaviorModifiersInput);

		this.htmlTeleportWhere = document.createElement('label');
		this.htmlTeleportWhereInput = document.createElement('mindalka-select');
		this.htmlTeleportWhereInput.setAttribute('multiple', true);
		this.htmlTeleportWhereInput.addEventListener('input', (event) => {
			this.entity.removeValues('TeleportWhere');
			for (let option of event.target.selectedOptions) {
				this.entity.setAttribute('TeleportWhere', option.value);
			}
		});
		this.htmlTeleportWhere.append('Teleport where', this.htmlTeleportWhereInput);

		this.htmlAutoJumpMin = document.createElement('label');
		this.htmlAutoJumpMinInput = document.createElement('input');
		this.htmlAutoJumpMinInput.addEventListener('input', (event) => this.entity.setAttribute('AutoJumpMin', event.target.value));
		this.htmlAutoJumpMin.append('Auto jump min', this.htmlAutoJumpMinInput);

		this.htmlAutoJumpMax = document.createElement('label');
		this.htmlAutoJumpMaxInput = document.createElement('input');
		this.htmlAutoJumpMaxInput.addEventListener('input', (event) => this.entity.setAttribute('AutoJumpMax', event.target.value));
		this.htmlAutoJumpMax.append('Auto jump max', this.htmlAutoJumpMaxInput);

		this.itemsContainer = document.createElement('div');
		this.itemsContainer.className = 'entity-view-bot-items-container';
		this.itemsContainerItems = document.createElement('div');
		this.itemsContainerAdd = document.createElement('div');
		this.itemsContainerAdd.innerHTML = 'Add Item';
		this.itemsContainerAdd.className = 'entity-view-bot-items-container-add';
		this.itemsContainerAdd.addEventListener('click', (event) => {
			this.entity.setAttribute('Item', 'test');
			this.update();
		});
		this.itemsContainer.append(this.itemsContainerItems, this.itemsContainerAdd);

		this.attributesContainer = document.createElement('div');
		this.attributesContainer.className = 'entity-view-bot-attributes-container';
		this.htmlElement.append(this.htmlClassIcon, this.htmlName, this.htmlTemplateName, this.htmlTemplate, this.htmlClass,
			this.htmlSkill, this.htmlMaxVisionRange, this.htmlHealth, this.htmlScale, this.htmlAttributes,
			this.htmlWeaponRestriction, this.htmlNavigationTags, this.htmlBehaviorModifiers, this.htmlTeleportWhere,
			this.htmlAutoJumpMin, this.htmlAutoJumpMax,
			this.attributesContainer, this.itemsContainer);
	}

	update() {
		if (this.entity.isTemplate) {
			this.htmlTitle.innerHTML = this.entity.entityName;
		} else {
			this.htmlTitle.innerHTML = 'TFBot';
		}
		if (this.entity._parent.isMission) {
			this.htmlremoveButton.style.display = 'none';
		} else {
			this.htmlremoveButton.style.display = '';
		}
		if (this.entity.entityNameEditable) {
			this.htmlTemplateNameInput.value = this.entity.entityName;
			this.htmlTemplateName.style.display = '';
		} else {
			this.htmlTemplateName.style.display = 'none';
		}
		this.htmlNavigationTagsInput.setOptions(Application.navigationTags);
		this.htmlTeleportWhereInput.setOptions(Application.where);
		this.htmlClassInput.unselectAll();
		this.htmlSkillInput.unselectAll();
		this.htmlAttributesInput.unselectAll();
		this.htmlWeaponRestrictionInput.unselectAll();
		this.htmlNavigationTagsInput.unselectAll();
		this.htmlBehaviorModifiersInput.unselectAll();
		this.htmlTeleportWhereInput.unselectAll();

		this.htmlClassIcon.innerHTML = '';

		this.htmlNameInput.value = '';
		this.htmlTemplateInput.value = '';
		this.htmlClassInput.value = '';
		this.htmlSkillInput.value = '';

		this.htmlScaleInput.value = '';
		this.attributesContainer.innerHTML = '';
		this.itemsContainerItems.innerHTML = '';

		this.htmlHealth.value = '';
		this.htmlAutoJumpMinInput.value = '';
		for (let child of this.entity._childs) {
			//console.error('child : ', child);
			let view = Application.getView(child);
			switch (true) {
				case child.isCharacterAttributes:
					this.attributesContainer.append(view.htmlElement);
					break;
				case child.isItemAttributes:
					this.attributesContainer.append(view.htmlElement);
					break;
				default:
					console.error(child);
					break;
			}
		}
		for (let [name, value] of this.entity._attributes) {
			switch (name.toLowerCase()) {
				case 'classicon' :
					this.htmlClassIcon.innerHTML = value;
					break;
				case 'name' :
					this.htmlNameInput.value = value;
					break;
				case 'template' :
					this.htmlTemplateInput.value = value;
					break;
				case 'class' :
					this.htmlClassInput.select(value.toLowerCase());
					break;
				case 'skill' :
					this.htmlSkillInput.select(value.toLowerCase());
					break;
				case 'maxvisionrange' :
					this.htmlMaxVisionRange.value = value;
					break;
				case 'health' :
					this.htmlHealth.value = value;
					break;
				case 'scale' :
					this.htmlScaleInput.value = value;
					break;
				case 'attributes' :
					this.htmlAttributesInput.select(value);
				case 'weaponrestrictions' :
					this.htmlWeaponRestrictionInput.select(value.toLowerCase());
					break;
				case 'tag' :
					this.htmlNavigationTagsInput.select(value.toLowerCase());
					break;
				case 'item' :
					//this.htmlNavigationTagsInput.select(value.toLowerCase());
					let div = document.createElement('div');
					this.itemsContainerItems.append(div);
					div.innerHTML = value;
					break;
				case 'behaviormodifiers' :
					this.htmlBehaviorModifiersInput.select(value.toLowerCase());
					break;
				case 'teleportwhere' :
					this.htmlTeleportWhereInput.value = value;
					break;
				case 'autojumpmin' :
					this.htmlAutoJumpMinInput.value = value;
					break;
				case 'autojumpmax' :
					this.htmlAutoJumpMaxInput.value = value;
					break;
				default:
					console.error(name, value);
					break;
			}
		}
	}
}

if (window.customElements) {
	styleInject$2(`mindalka-tab{display:block;height:100%;overflow:auto}mindalka-tab:first-letter{text-transform:uppercase}.mindalka-tab-label{background-color:var(--main-bg-color-bright);border:1px solid #000;border-top:0;color:var(--main-text-color-dark2);cursor:pointer;display:inline-block;flex:0 1 150px;padding:10px;pointer-events:all;position:relative;text-align:center;user-select:none;white-space:nowrap}.mindalka-tab-label.activated{background-color:var(--main-bg-color-dark);border-bottom:1px solid var(--main-bg-color-dark);border-left:1px solid #fff;z-index:2}`);
	customElements.define('mindalka-tab', MindalkaTab);
}

if (window.customElements) {
	styleInject$2(`mindalka-tab-group{display:flex;flex-direction:column;height:100%;overflow:hidden;position:relative;width:100%}.mindalka-tab-group-header{background-color:var(--main-bg-color-bright);display:flex;flex:0 0}.mindalka-tab-group-content{background-color:var(--main-bg-color-dark);flex:1;overflow:auto}`);
	customElements.define('mindalka-tab-group', MindalkaTabGroup);
}

//import {EntityView, Mission, PopReader, Templates, Wave} from '../internal.js';

function processFileInput(event) {
	let files = [];
	if (event.target) {
		files = event.target.files;
	}

	for (let i = 0, f; f = files[i]; i++) {
		if (!f.name.toLowerCase().endsWith('.pop')) {
			continue;
		}

		let reader = new FileReader();

		// Closure to capture the file information.
		reader.onload = ((theFile) => {
			return (e) => {
				Application.updating = false;
				Application.resetPopulation();
				new PopReader().read(e.target.result);
				Application.updating = true;
				Application.updateAll();
			};
		})();

		// Read in the image file as a data URL.
		reader.readAsText(f);
	}
}

class WaveScheduleView extends EntityView {
	#htmlElement;
	constructor(entity) {
		super(entity);
		this.create();
	}

	create() {
		super.create();
		this.#htmlElement = createElement('div', {class: 'entity-view-waveschedule'});
		//.className = 'entity-view-waveschedule';
		document.body.appendChild(this.#htmlElement);

		let buttonsHeader = document.createElement('div');
		buttonsHeader.className = 'entity-view-waveschedule-buttons';

		let htmlLoadPopFile = document.createElement('div');
		htmlLoadPopFile.id = 'entity-view-waveschedule-load-pop-file-outer';
		htmlLoadPopFile.className = 'button';
		htmlLoadPopFile.innerHTML = 'Import pop file';
		this.htmlLoadPopFile = document.createElement('input');
		this.htmlLoadPopFile.type = 'file';
		this.htmlLoadPopFile.id = 'entity-view-waveschedule-load-pop-file';
		this.htmlLoadPopFile.addEventListener('change', (event) => processFileInput(event));
		htmlLoadPopFile.append(this.htmlLoadPopFile);

		this.htmlGenerateButton = document.createElement('div');
		this.htmlGenerateButton.id = 'button entity-view-waveschedule-generate';
		this.htmlGenerateButton.className = 'button';
		this.htmlGenerateButton.innerHTML = 'Export pop file';
		this.htmlGenerateButton.addEventListener('click', (event) => Application.exportWaveSchedule());

		this.htmlMapSelect = document.createElement('label');
		this.htmlMapSelectInput = createElement('mindalka-select');
		this.htmlMapSelect.append('Map', this.htmlMapSelectInput);
		this.htmlMapSelectInput.addEventListener('input', (event) => {this.entity.map = event.target.value.toLowerCase();Application.updateAll();});

		this.htmlStartingCurrency = document.createElement('label');
		this.htmlStartingCurrencyInput = document.createElement('input');
		this.htmlStartingCurrencyInput.addEventListener('input', (event) => this.entity.setAttribute('StartingCurrency', event.target.value));
		this.htmlStartingCurrency.append('Starting currency', this.htmlStartingCurrencyInput);

		this.htmlRespawnWaveTime = document.createElement('label');
		this.htmlRespawnWaveTimeInput = document.createElement('input');
		this.htmlRespawnWaveTimeInput.addEventListener('input', (event) => this.entity.setAttribute('RespawnWaveTime', event.target.value));
		this.htmlRespawnWaveTime.append('Respawn time', this.htmlRespawnWaveTimeInput);

		this.htmlCanBotsAttackWhileInSpawnRoom = document.createElement('label');
		this.htmlCanBotsAttackWhileInSpawnRoomInput = document.createElement('input');
		this.htmlCanBotsAttackWhileInSpawnRoomInput.type = 'checkbox';
		this.htmlCanBotsAttackWhileInSpawnRoomInput.addEventListener('input', (event) => this.entity.setAttribute('CanBotsAttackWhileInSpawnRoom', event.target.checked ? 'yes' : 'no'));
		this.htmlCanBotsAttackWhileInSpawnRoom.append('Bots can attack in spawn', this.htmlCanBotsAttackWhileInSpawnRoomInput);

		this.htmlAdvanced = document.createElement('label');
		this.htmlAdvancedInput = document.createElement('input');
		this.htmlAdvancedInput.type = 'checkbox';
		this.htmlAdvancedInput.addEventListener('input', (event) => this.entity.setAttribute('Advanced', event.target.checked));
		this.htmlAdvanced.append('Advanced', this.htmlAdvancedInput);

		this.htmlEventPopfile = document.createElement('label');
		this.htmlEventPopfileInput = document.createElement('input');
		this.htmlEventPopfileInput.addEventListener('input', (event) => this.entity.setAttribute('EventPopfile', event.target.value));
		this.htmlEventPopfile.append('EventPopfile', this.htmlEventPopfileInput);

		this.htmlFixedRespawnWaveTime = document.createElement('label');
		this.htmlFixedRespawnWaveTimeInput = document.createElement('input');
		this.htmlFixedRespawnWaveTimeInput.type = 'checkbox';
		this.htmlFixedRespawnWaveTimeInput.addEventListener('input', (event) => this.entity.setAttribute('FixedRespawnWaveTime', event.target.checked));
		this.htmlFixedRespawnWaveTime.append('Fixed respawn wave time', this.htmlFixedRespawnWaveTimeInput);

		this.htmlTabPanels = createElement('mindalka-tab-group');
		/*this.htmlTabPanels.setAttribute('tabs-classname', 'entity-view-waveschedule-tabs');
		this.htmlTabPanels.setAttribute('panels-classname', 'entity-view-waveschedule-panel');
		this.htmlTabPanels.setAttribute('tab-classname', 'entity-view-waveschedule-tab');*/

		this.htmlWaves = createElement('mindalka-tab', {
			parent: this.htmlTabPanels,
			class: 'entity-view-waveschedule-waves-tab-panel',
			'data-i18n': '#waves',
		});

		this.htmlAddWaveButton = createElement('button', {
			parent: this.htmlWaves,
			class: 'entity-view-waveschedule-add-wave',
			i18n: '#add_wave',
			events: {
				click: () => {
					let wave = Application.addWave();
					let view = Application.getView(wave);
					//this.htmlWavesTabs.select(view.htmlElement);
					this.htmlWavesTabs.active = view.htmlElement.parentElement;
				}
			}
		});

		this.htmlWavesTabs = createElement('mindalka-tab-group', {
			parent: this.htmlWaves,
			class: 'entity-view-waveschedule-waves-tabs',
		});
		/*this.htmlWavesTabs.setAttribute('tabs-classname', 'entity-view-waveschedule-waves-tabs');
		this.htmlWavesTabs.setAttribute('panels-classname', 'entity-view-waveschedule-waves');
		this.htmlWavesTabs.setAttribute('tab-classname', 'entity-view-waveschedule-waves-tab');*/
		//this.htmlWavesTabs.appendExtra(this.htmlAddWaveButton);/*TODO*/
		//this.htmlWaves.append(/*this.htmlAddWaveButton, */this.htmlWavesTabs);

		this.htmlMissions = createElement('mindalka-tab', {
			parent: this.htmlTabPanels,
			class: 'entity-view-waveschedule-missions-tab-panel',
			'data-i18n': '#missions',
		});


		this.htmlAddMissionButton = createElement('button', {
			parent: this.htmlMissions,
			class: 'entity-view-waveschedule-add-mission',
			i18n: '#add_mission',
			events: {
				click: () => Application.addBot(Application.addMission()),
			},
		});

		this.htmlMissionsTabs = createElement('mindalka-tab-group', {
			parent: this.htmlMissions,
			class: 'entity-view-waveschedule-missions-tabs',
		});
		/*this.htmlMissionsTabs.setAttribute('tabs-classname', '');
		this.htmlMissionsTabs.setAttribute('panels-classname', 'entity-view-waveschedule-missions');
		this.htmlMissionsTabs.setAttribute('tab-classname', 'entity-view-waveschedule-missions-tab');*/
		//this.htmlMissionsTabs.appendExtra(this.htmlAddMissionButton);/*TODO*/
		//this.htmlMissions.append(this.htmlMissionsTabs);

		this.htmlTemplates = createElement('mindalka-tab', {
			parent: this.htmlTabPanels,
			'data-i18n': '#templates',
		});

		//this.htmlTabPanels.addPanel(this.htmlWaves, 'Waves');/*TODO*/
		//this.htmlTabPanels.addPanel(this.htmlMissions, 'Missions');/*TODO*/
		//this.htmlTabPanels.addPanel(this.htmlTemplates, 'Templates');/*TODO*/
		this.#htmlElement.append(buttonsHeader, this.htmlMapSelect, this.htmlStartingCurrency, this.htmlRespawnWaveTime, this.htmlCanBotsAttackWhileInSpawnRoom, this.htmlAdvanced, this.htmlEventPopfile, this.htmlFixedRespawnWaveTime, this.htmlTabPanels);

		buttonsHeader.append(htmlLoadPopFile, this.htmlGenerateButton);
	}

	update() {
		this.htmlStartingCurrencyInput.value = '';
		this.htmlRespawnWaveTimeInput.value = '';
		this.htmlFixedRespawnWaveTimeInput.checked = false;
		this.htmlAdvancedInput.checked = false;
		this.htmlCanBotsAttackWhileInSpawnRoomInput.checked = false;
		this.htmlEventPopfileInput.value = '';
		this.htmlMapSelectInput.setOptions(this.entity.maps);
		this.htmlMapSelectInput.select(this.entity.map);

		this.htmlWavesTabs.clear();
		this.htmlMissionsTabs.clear();
		this.htmlTemplates.innerHTML = '';
		let iWaves = 0;
		let iMissions = 0;
		for (let child of this.entity._childs) {
			let view = Application.getView(child);
			switch (true) {
				case child.isWave:
					createElement('mindalka-tab', {
						parent: this.htmlWavesTabs,
						'data-i18n': ++iWaves,
						child: view.htmlElement,
					});

					//this.htmlWavesTabs.addPanel(view.htmlElement, (++iWaves));
					break;
				case child.isMission:
					//this.htmlMissionsTabs.addPanel(view.htmlElement, (++iMissions));
					createElement('mindalka-tab', {
						parent: this.htmlMissionsTabs,
						'data-i18n': ++iMissions,
						child: view.htmlElement,
					});
					break;
				case child.isTemplates:
					this.htmlTemplates.append(view.htmlElement);
					break;
				default:
					console.error(child);
					break;
			}
		}
		for (let [name, value] of this.entity._attributes) {
			switch (name.toLowerCase()) {
				case 'startingcurrency' :
					this.htmlStartingCurrencyInput.value = value;
					break;
				case 'respawnwavetime' :
					this.htmlRespawnWaveTimeInput.value = value;
					break;
				case 'canbotsattackwhileinspawnroom' :
					this.htmlCanBotsAttackWhileInSpawnRoomInput.checked = (value.toLowerCase() == 'yes');
					break;
				case 'advanced' :
					this.htmlAdvancedInput.checked = value;
					break;
				case 'fixedrespawnwavetime' :
					this.htmlFixedRespawnWaveTimeInput.checked = (value.toLowerCase() == 'yes');
					break;
				case 'eventpopfile' :
					this.htmlEventPopfileInput.value = value;
					break;
				default:
					console.error(name, value);
					break;
			}
		}
	}
}

class WavespawnView extends EntityView {
	constructor(entity) {
		super(entity);
		this.create();
	}

	create() {
		super.create();
		this.htmlElement.className = 'entity-view-wavespawn';
		this.htmlElement.innerHTML = 'wavespawn';

		//this.htmlremoveButton.className = 'entity-view-wavespawn-remove';
		//this.htmlremoveButton.innerHTML = 'Remove wavespawn';

		this.htmlAddBotButton = document.createElement('button');
		this.htmlAddBotButton.className = 'entity-view-wavespawn-add-bot';
		this.htmlAddBotButton.innerHTML = 'Add bot';
		this.htmlAddBotButton.addEventListener('click', (event) => Application.addBot(this.entity));

		this.htmlAddSquadButton = document.createElement('button');
		this.htmlAddSquadButton.className = 'entity-view-wavespawn-add-squad';
		this.htmlAddSquadButton.innerHTML = 'Add squad';
		this.htmlAddSquadButton.addEventListener('click', (event) => Application.addSquad(this.entity));

		this.htmlAddTankButton = document.createElement('button');
		this.htmlAddTankButton.className = 'entity-view-wavespawn-add-tank';
		this.htmlAddTankButton.innerHTML = 'Add tank';
		this.htmlAddTankButton.addEventListener('click', (event) => {Application.addTankAndOutputs(this.entity);});

		this.htmlName = document.createElement('label');
		this.htmlNameInput = document.createElement('input');
		this.htmlNameInput.addEventListener('input', (event) => this.entity.setAttribute('Name', event.target.value));
		this.htmlName.append('Name', this.htmlNameInput);

		this.htmlTotalCurrency = document.createElement('label');
		this.htmlTotalCurrencyInput = document.createElement('input');
		this.htmlTotalCurrencyInput.addEventListener('input', (event) => this.entity.setAttribute('TotalCurrency', event.target.value));
		this.htmlTotalCurrency.append('Total currency', this.htmlTotalCurrencyInput);

		this.htmlWaitBetweenSpawns = document.createElement('label');
		this.htmlWaitBetweenSpawnsInput = document.createElement('input');
		this.htmlWaitBetweenSpawnsInput.addEventListener('input', (event) => this.entity.setAttribute('WaitBetweenSpawns', event.target.value));
		this.htmlWaitBetweenSpawns.append('Wait between spawns', this.htmlWaitBetweenSpawnsInput);

		this.htmlWaitBeforeStarting = document.createElement('label');
		this.htmlWaitBeforeStartingInput = document.createElement('input');
		this.htmlWaitBeforeStartingInput.addEventListener('input', (event) => this.entity.setAttribute('WaitBeforeStarting', event.target.value));
		this.htmlWaitBeforeStarting.append('Wait before starting', this.htmlWaitBeforeStartingInput);

		this.htmlWaitForAllSpawned = document.createElement('label');
		this.htmlWaitForAllSpawnedInput = document.createElement('input');
		this.htmlWaitForAllSpawnedInput.addEventListener('input', (event) => this.entity.setAttribute('WaitForAllSpawned', event.target.value));
		this.htmlWaitForAllSpawned.append('Wait for all spawned', this.htmlWaitForAllSpawnedInput);

		this.htmlWaitForAllDead = document.createElement('label');
		this.htmlWaitForAllDeadInput = document.createElement('input');
		this.htmlWaitForAllDeadInput.addEventListener('input', (event) => this.entity.setAttribute('WaitForAllDead', event.target.value));
		this.htmlWaitForAllDead.append('Wait for all dead', this.htmlWaitForAllDeadInput);

		this.htmlWaitBetweenSpawnsAfterDeath = document.createElement('label');
		this.htmlWaitBetweenSpawnsAfterDeathInput = document.createElement('input');
		this.htmlWaitBetweenSpawnsAfterDeathInput.addEventListener('input', (event) => this.entity.setAttribute('WaitBetweenSpawnsAfterDeath', event.target.value));
		this.htmlWaitBetweenSpawnsAfterDeath.append('Wait between spawns after death', this.htmlWaitBetweenSpawnsAfterDeathInput);

		this.htmlTotalCount = document.createElement('label');
		this.htmlTotalCountInput = document.createElement('input');
		this.htmlTotalCountInput.addEventListener('input', (event) => this.entity.setAttribute('TotalCount', event.target.value));
		this.htmlTotalCount.append('Total count', this.htmlTotalCountInput);

		this.htmlSpawnCount = document.createElement('label');
		this.htmlSpawnCountInput = document.createElement('input');
		this.htmlSpawnCountInput.addEventListener('input', (event) => this.entity.setAttribute('SpawnCount', event.target.value));
		this.htmlSpawnCount.append('Spawn count', this.htmlSpawnCountInput);

		this.htmlMaxActive = document.createElement('label');
		this.htmlMaxActiveInput = document.createElement('input');
		this.htmlMaxActiveInput.addEventListener('input', (event) => this.entity.setAttribute('MaxActive', event.target.value));
		this.htmlMaxActive.append('Max active', this.htmlMaxActiveInput);

		this.htmlRandomChoice = document.createElement('label');
		this.htmlRandomChoiceInput = document.createElement('input');
		this.htmlRandomChoiceInput.type = 'checkbox';
		this.htmlRandomChoiceInput.addEventListener('input', (event) => this.entity.randomChoice = event.target.checked);
		this.htmlRandomChoice.append('Random choice', this.htmlRandomChoiceInput);

		this.htmlRandomSpawn = document.createElement('label');
		this.htmlRandomSpawnInput = document.createElement('input');
		this.htmlRandomSpawnInput.type = 'checkbox';
		this.htmlRandomSpawnInput.addEventListener('input', (event) => this.entity.setAttribute('RandomSpawn', event.target.checked));
		this.htmlRandomSpawn.append('Random spawn', this.htmlRandomSpawnInput);

		this.htmlSupport = document.createElement('label');
		this.htmlSupportInput = document.createElement('input');
		this.htmlSupportInput.type = 'checkbox';
		this.htmlSupportInput.addEventListener('input', (event) => this.entity.setAttribute('Support', event.target.checked));
		this.htmlSupport.append('Support', this.htmlSupportInput);

		this.htmlWhere = document.createElement('label');
		this.htmlWhereInput = createElement('mindalka-select');
		this.htmlWhereInput.setAttribute('multiple', true);
		this.htmlWhere.append('Where', this.htmlWhereInput);

		this.botContainer = document.createElement('div');
		this.botContainer.className = 'entity-view-wavespawn-bots';
		this.htmlElement.append(this.htmlremoveButton, this.htmlRandomChoice, this.htmlRandomSpawn,
			this.htmlSupport, this.htmlName, this.htmlWaitForAllSpawned, this.htmlWaitForAllDead, this.htmlTotalCurrency,
			this.htmlWaitBetweenSpawns, this.htmlWaitBetweenSpawnsAfterDeath, this.htmlWaitBeforeStarting, this.htmlWhere,
			this.htmlTotalCount, this.htmlSpawnCount, this.htmlMaxActive,
			this.botContainer);
	}

	update() {
		this.htmlWhereInput.setOptions(Application.where);
		this.botContainer.innerHTML = '';
		this.botContainer.append(this.htmlAddBotButton, this.htmlAddSquadButton, this.htmlAddTankButton);
		this.htmlRandomChoice.checked = false;
		this.htmlRandomSpawnInput.checked = false;
		this.htmlSupportInput.checked = false;
		this.htmlElement.style.display = '';
		this.htmlWhereInput.unselectAll();
		this.htmlNameInput.value = '';
		this.htmlTotalCurrencyInput.value = '';
		this.htmlWaitBetweenSpawnsInput.value = '';
		this.htmlWaitBeforeStartingInput.value = '';
		this.htmlWaitForAllSpawnedInput.value = '';
		this.htmlWaitForAllDeadInput.value = '';
		this.htmlWaitBetweenSpawnsAfterDeathInput.value = '';
		this.htmlTotalCountInput.value = '';
		this.htmlSpawnCountInput.value = '';
		this.htmlMaxActiveInput.value = '';
		this.htmlAddBotButton.disabled = false;
		this.htmlAddSquadButton.disabled = false;
		this.htmlAddTankButton.disabled = false;
		for (let child of this.entity._childs) {
			let view = Application.getView(child);
			switch (true) {
				case child.isTFBot:
				case child.isSquad:
				case child.isTank:
					this.botContainer.innerHTML = '';
					this.botContainer.append(view.htmlElement);
					this.htmlAddBotButton.disabled = true;
					this.htmlAddSquadButton.disabled = true;
					this.htmlAddTankButton.disabled = true;
					break;
				case child.isRandomChoice:
					this.botContainer.innerHTML = '';
					this.botContainer.append(view.htmlElement);
					this.htmlRandomChoice.checked = true;
					break;
			}
		}
		for (let [name, value] of this.entity._attributes) {
			switch (name.toLowerCase()) {
				case 'where' :
					this.htmlWhereInput.select(value.toLowerCase());
					break;
				case 'name' :
					this.htmlNameInput.value = value;
					break;
				case 'totalcurrency' :
					this.htmlTotalCurrencyInput.value = value;
					break;
				case 'waitbetweenspawns' :
					this.htmlWaitBetweenSpawnsInput.value = value;
					break;
				case 'waitbeforestarting' :
					this.htmlWaitBeforeStartingInput.value = value;
					break;
				case 'waitforallspawned' :
					this.htmlWaitForAllSpawnedInput.value = value;
					break;
				case 'waitforalldead' :
					this.htmlWaitForAllDeadInput.value = value;
					break;
				case 'waitbetweenspawnsafterdeath' :
					this.htmlWaitBetweenSpawnsAfterDeathInput.value = value;
					break;
				case 'totalcount' :
					this.htmlTotalCountInput.value = value;
					break;
				case 'spawncount' :
					this.htmlSpawnCountInput.value = value;
					break;
				case 'maxactive' :
					this.htmlMaxActiveInput.value = value;
					break;
				case 'support' :
					this.htmlSupportInput.checked = value;
					break;
				case 'randomspawn' :
					this.htmlRandomSpawnInput.checked = value;
					break;
				default:
					console.error(name, value);
					break;
			}
		}
	}
}

class WaveView extends EntityView {
	constructor(entity) {
		super(entity);
		this.create();
	}

	create() {
		super.create();
		this.htmlElement.className = 'entity-view-wave';
		this.htmlElement.innerHTML = 'Wave';

		//this.htmlremoveButton.className = 'entity-view-wave-remove';
		//this.htmlremoveButton.innerHTML = 'Remove wave';

		this.htmlAddWavespawnButton = createElement('button', {
			parent: this.htmlElement,
			class: 'entity-view-wave-add-wavespawn',
			i18n: '#add_wavespawn',
			events: {
				click: () => {
					let wavespawn = Application.addWavespawn(this.entity);
					let view = Application.getView(wavespawn);
					this.tabPanel.active = view.htmlElement.parentElement;
				}

			},
		});
		this.htmlDescription = document.createElement('label');
		this.htmlDescriptionInput = document.createElement('input');
		this.htmlDescriptionInput.addEventListener('input', (event) => this.entity.setAttribute('Description', event.target.value));
		this.htmlDescription.append('Description', this.htmlDescriptionInput);

		this.htmlCheckpoint = document.createElement('label');
		this.htmlCheckpointInput = document.createElement('input');
		this.htmlCheckpointInput.type = 'checkbox';
		this.htmlCheckpointInput.addEventListener('input', (event) => this.entity.setAttribute('Checkpoint', event.target.checked ? 'yes' : 'no'));
		this.htmlCheckpoint.append('Checkpoint', this.htmlCheckpointInput);

		this.htmlWaitWhenDone = document.createElement('label');
		this.htmlWaitWhenDoneInput = document.createElement('input');
		this.htmlWaitWhenDoneInput.addEventListener('input', (event) => this.entity.setAttribute('WaitWhenDone', event.target.value));
		this.htmlWaitWhenDone.append('Wait when done', this.htmlWaitWhenDoneInput);

		this.htmlSound = document.createElement('label');
		this.htmlSoundInput = document.createElement('input');
		this.htmlSoundInput.addEventListener('input', (event) => this.entity.setAttribute('Sound', event.target.value));
		this.htmlSound.append('Sound', this.htmlSoundInput);

		this.tabPanel = createElement('mindalka-tab-group', {
			class: 'entity-view-wave-wavespawns-tabs',
		});
		/*this.tabPanel.setAttribute('tabs-classname', 'entity-view-wave-wavespawns-tabs');
		this.tabPanel.setAttribute('panels-classname', 'entity-view-wave-wavespawns');
		this.tabPanel.setAttribute('tab-classname', 'entity-view-wave-wavespawns-tab');*/
		//this.tabPanel.appendExtra(this.htmlAddWavespawnButton);

		this.htmlElement.append(this.htmlremoveButton, /*this.htmlAddWavespawnButton, */this.htmlDescription, this.htmlCheckpoint, this.htmlWaitWhenDone, this.htmlSound, this.tabPanel);
	}

	update() {
		this.htmlElement.style.display = '';
		this.htmlDescriptionInput.value = '';
		this.htmlWaitWhenDoneInput.value = '';
		this.htmlSoundInput.value = '';
		this.htmlCheckpointInput.checked = false;
		this.tabPanel.clear();
		let i = 0;
		for (let child of this.entity._childs) {
			switch (true) {
				case child.isWavespawn:
					let view = Application.getView(child);
					createElement('mindalka-tab', {
						parent: this.tabPanel,
						'data-i18n': ++i,
						child: view.htmlElement,
					});
					break;
			}
		}
		for (let [name, value] of this.entity._attributes) {
			switch (name.toLowerCase()) {
				case 'description' :
					this.htmlDescriptionInput.value = value;
					break;
				case 'checkpoint' :
					this.htmlCheckpointInput.checked = (value.toLowerCase() == 'yes');
					break;
				case 'waitwhendone' :
					this.htmlWaitWhenDoneInput.value = value;
					break;
				case 'sound' :
					this.htmlSoundInput.value = value;
					break;
				default:
					console.error(name, value);
					break;
			}
		}
	}

}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z$1 = ".attribute\r\n{\r\n\tmax-width : 98%;\r\n\t/*height : 1em;*/\r\n\tbackground-color:#999999;\r\n    font-family: tf2build,Verdana,sans-serif;\r\n\r\n\r\n    border: 2px solid #888888;\r\n\r\n    border-radius: 3px;\r\n    padding: 2px;\r\n    /*margin: 10px;*/\r\n\tmargin-top: 2px;\r\n\t/*margin-right: 10px;*/\r\n\tfont-size: 1.5em;\r\n\tvertical-align:top;\r\n    text-decoration: none;\r\n\tposition:relative;\r\n}\r\n\r\n.attributeNegative{\r\n\tcolor:#CC5555;\r\n    display:inline-block;\r\n\t/*max-width : 60%;*/\r\n\twidth:10em;\r\n}\r\n\r\n.attributePositive{\r\n\tcolor:#55EE55;\r\n    display:inline-block; \r\n\t/*max-width : 60%;*/\r\n\twidth:10em;\r\n\t/*max-height : 1.6em;*/\r\n}\r\n\r\n.attributeNeutral{\r\n\tcolor:#555555;\r\n    display:inline-block;\r\n\t/*max-width : 60%;*/\r\n\twidth:10em;\r\n}\r\n\r\n[draggable=true] {\r\n    -khtml-user-drag: element; /* WebKit hack */\r\n    cursor:move;               /* a move cursor */\r\n    -moz-user-select:none;     /* disabled content selection\r\n                                  on mozilla browsers */\r\n}\r\n\r\n.attributeValue{\r\n    display:inline-block;\r\n}\r\n\r\n.attributeInput{\r\n\t/*position:absolute;\r\n\tright:1.7em;       */\r\n\twidth:3em;\r\n\t/*top:2px;*/\r\n}\r\n\r\n.attributeRemove\r\n{\r\n    top: 0px;\r\n    right: 1px;\r\n\tposition:absolute;\r\n}";
styleInject(css_248z$1);

var css_248z = "html{\r\n\twidth:100%;\r\n\theight:100%;\r\n\tbackground-color: black;\r\n\t--font-size: 1.2em;\r\n\t--tab-height: 40px;\r\n}\r\nbody{\r\n\tfont-family: Verdana,sans-serif;\r\n\tfont-size: var(--font-size);\r\n\twidth:100%;\r\n\theight:100%;\r\n\tmargin:0px;\r\n\tdisplay: flex;\r\n}\r\n\r\ntab-panel{\r\n\tdisplay: flex;\r\n\tflex-direction: column;\r\n\tmin-height: 100px;\r\n}\r\n\r\ntab-panel > div:first-child{\r\n\tdisplay: flex;\r\n}\r\n\r\ntab-panel > div:first-child > div{\r\n\t/*flex: 1;*/\r\n}\r\n\r\n\r\nbutton{\r\n\tappearance: none;\r\n\tpadding: 0px;\r\n\tborder: 0px;\r\n\tmargin: 0px;\r\n\tcursor: pointer;\r\n}\r\n/*population*/\r\n.entity-view-waveschedule{\r\n\tflex: 1;\r\n\tbackground-color: antiquewhite;\r\n\tdisplay: flex;\r\n\tflex-direction: column;\r\n\tmargin: 4px;\r\n\toverflow: hidden;\r\n}\r\n.entity-view-waveschedule-buttons{\r\n\tdisplay: flex;\r\n}\r\n.entity-view-waveschedule-buttons > div{\r\n\tflex: 1;\r\n\ttext-align: center;\r\n\tborder: solid 1px blue;\r\n}\r\n#entity-view-waveschedule-load-pop-file{\r\n\topacity: 0;\r\n\tdisplay: block;\r\n\twidth: 100%;\r\n\theight: 100%;\r\n\tposition: absolute;\r\n\ttop: 0px;\r\n\r\n}\r\n#entity-view-waveschedule-load-pop-file-outer{\r\n\tposition: relative;\r\n\r\n}\r\n.entity-view-waveschedule-waves-tab-panel, .entity-view-waveschedule-missions-tab-panel{\r\n\tdisplay: flex;\r\n\tflex-direction: column;\r\n\tmin-height: 100px;\r\n}\r\n.entity-view-waveschedule-waves-tabs, .entity-view-waveschedule-tabs, .entity-view-waveschedule-missions-tabs,\r\n.entity-view-wave-wavespawns-tabs{\r\n\t/*height: 20px;*/\r\n\tbackground-color: red;\r\n}\r\n\r\n.entity-view-waveschedule-panel > *[data-selected=false]{\r\n\tdisplay: none;\r\n}\r\n\r\n.entity-view-waveschedule-waves-tab, .entity-view-waveschedule-tab, .entity-view-waveschedule-missions-tab,\r\n.entity-view-wave-wavespawns-tab{\r\n\tdisplay: inline-block;\r\n\theight: 100%;\r\n\tcursor: pointer;\r\n\tpadding: 4px;\r\n}\r\n.entity-view-waveschedule-waves-tab[data-selected=true], .entity-view-waveschedule-tab[data-selected=true],\r\n.entity-view-waveschedule-missions-tab[data-selected=true], .entity-view-wave-wavespawns-tab[data-selected=true]{\r\n\tbackground-color: azure;\r\n}\r\n.entity-view-waveschedule-waves, .entity-view-waveschedule-panel, .entity-view-waveschedule-missions{\r\n\tbackground-color: orange;\r\n\tposition: relative;\r\n\tmin-height: 100px;\r\n\tdisplay: flex;\r\n\tflex-direction: column;\r\n}\r\n#entity-view-waveschedule-generate{\r\n\r\n}\r\n.entity-view-waveschedule-add-wave, .entity-view-waveschedule-add-mission{\r\n\tbackground-repeat: no-repeat;\r\n\tbackground-size: contain;\r\n\theight: var(--tab-height);\r\n\tpadding-left: var(--tab-height);\r\n}\r\n\r\n/*wave*/\r\n.entity-view-wave{\r\n\tdisplay: flex;\r\n\tflex-direction: column;\r\n\tmin-height: 100px;\r\n\tmargin: 4px;\r\n\tposition: relative;\r\n}\r\n.entity-view-wave[data-selected=false], .entity-view-mission[data-selected=false] {\r\n\tdisplay: none;\r\n}\r\n/*.entity-view-wave-wavespawns-tabs{\r\n\theight: 20px;\r\n\tbackground-color: red;\r\n}*/\r\n/*.entity-view-wave-wavespawns-tab{\r\n\tdisplay: inline-block;\r\n\theight: 100%;\r\n\tcursor: pointer;\r\n}\r\n.entity-view-wave-wavespawns-tab[data-selected=true]{\r\n\tbackground-color: azure;\r\n}*/\r\n.entity-view-wave-wavespawns{\r\n\tbackground-color: azure;\r\n\tdisplay: flex;\r\n\tflex-direction: column;\r\n\tmin-height: 100px;\r\n}\r\n.entity-view-wave-add-wavespawn{\r\n\tbackground-repeat: no-repeat;\r\n\tbackground-size: contain;\r\n\theight: var(--tab-height);\r\n\tpadding-left: var(--tab-height);\r\n}\r\n\r\n/*wavespawn*/\r\n.entity-view-wavespawn{\r\n\tbackground-color: cadetblue;\r\n\tdisplay: flex;\r\n\tflex-direction: column;\r\n\tmin-height: 100px;\r\n\tmargin: 4px;\r\n\tposition: relative;\r\n}\r\n.entity-view-wavespawn[data-selected=false]{\r\n\tdisplay: none;\r\n}\r\n.entity-view-wavespawn-bots{\r\n\tdisplay: flex;\r\n\tflex-direction: column;\r\n\tmin-height: 100px;\r\n\toverflow: auto;\r\n}\r\n\r\n/* squad */\r\n.entity-view-squad{\r\n\tdisplay: flex;\r\n\tflex-direction: column;\r\n\tmin-height: 100px;\r\n\tbackground-color: bisque;\r\n\tmargin: 4px;\r\n}\r\n.entity-view-squad-bots{\r\n\tflex-wrap: wrap;\r\n\tdisplay: flex;\r\n\tflex-direction: column;\r\n\tmin-height: 100px;\r\n\toverflow: auto;\r\n}\r\n/* mission */\r\n.entity-view-mission-bots{\r\n\tflex-wrap: wrap;\r\n\tdisplay: flex;\r\n\tflex-direction: column;\r\n\tmin-height: 100px;\r\n\toverflow: auto;\r\n}\r\n\r\n/* BOT */\r\n.entity-view-bot{\r\n\tbackground-color: red;\r\n\tdisplay: inline-block;\r\n\tposition: relative;\r\n\r\n}\r\n.entity-view-bot-attributes-container{\r\n\theight: 200px;\r\n\twidth: 200px;\r\n\tbackground-color: green;\r\n\r\n}\r\n.entity-view-bot-items-container{\r\n\theight: 200px;\r\n\twidth: 200px;\r\n\tbackground-color: blue;\r\n}\r\n\r\n/* Tank */\r\n.entity-view-tank{\r\n\tbackground-color: blueviolet;\r\n}\r\n\r\n/* random choice */\r\n.entity-view-randomchoice{\r\n\tdisplay: flex;\r\n\tflex-direction: column;\r\n\tmin-height: 100px;\r\n\tposition: relative;\r\n}\r\n.entity-view-randomchoice-bots{\r\n\tdisplay: flex;\r\n\tflex-direction: column;\r\n\tmin-height: 100px;\r\n\toverflow: auto;\r\n}\r\n\r\n/* entity */\r\n.entity-remove-button{\r\n\tposition: absolute;\r\n\theight: 40px;\r\n\twidth: 40px;\r\n\ttop: 10px;\r\n\tright: 10px;\r\n\tbackground-image: url('./icons/remove_circle_outline-24px.svg');\r\n\tbackground-size: contain;\r\n}\r\n";
styleInject(css_248z);

const Application = new (function () {
	class Application {
		constructor() {
			this.entityView = new Map();
			this.viewEntity = new Map();
			this.waveSchedule = new WaveSchedule();
			this.waveScheduleView = new WaveScheduleView(this.waveSchedule);
			this.addEntity2(this.waveSchedule, this.waveScheduleView);
			this.resetPopulation();
			this.templates = this._addTemplates();
			this.updating = true;
			I18n.start();
		}

		start() {
			this.addWavespawn(this.addWave());
			//this.loadTemplates(['./popfiles/robot_standard.pop', './popfiles/robot_gatebot.pop', './popfiles/robot_giant.pop']);
			this.initMaps('./json/maps.json');
		}

		exportWaveSchedule() {
			this.waveSchedule.validate();
			let popWriter = new PopWriter();
			let content = popWriter.write(this.waveSchedule);

			SaveFile(new File([new Blob([content])], 'mvm.tf.pop'));
		}

		resetPopulation() {
			this.waveSchedule.reset();
			this.waveSchedule._attributes.clear();
			for (let child of this.waveSchedule._childs) {
				if (!(child.isTemplates)) {
					this.waveSchedule._childs.delete(child);
				}
			}

			this.waveSchedule.setAttribute('StartingCurrency', 400);
			this.waveSchedule.setAttribute('CanBotsAttackWhileInSpawnRoom', 'no');
		}

		addBase(base) {
			this.waveSchedule.addBase(base);
		}

		addEntity2(entity, view) {
			this.entityView.set(entity, view);
			this.viewEntity.set(view, entity);
		}

		removeEntity(entity) {
			if (this.entityView.has(entity)) {
				this.setParent(entity, null);
				let view = this.entityView.get(entity);
				this.viewEntity.delete(view);
				this.entityView.delete(entity);
			}
		}

		createAttribute(name) {
			throw 'error';
		}

		_addEntity(entityType, viewType, parent) {
			let entity = new entityType();
			let entityView = new viewType(entity);
			this.addEntity2(entity, entityView);
			this.setParent(entity, parent);

			if (this.updating) {
				entityView.update();
			}
			return entity;
		}

		/*removeEntity(entity) {
			this.setParent(entity, null);
		}*/

		addMission() {
			return this._addEntity(Mission, MissionView, this.waveSchedule);
		}

		addBot(wavespawn) {
			return this._addEntity(TFBot, TFBotView, wavespawn);
		}

		addTank(wavespawn) {
			return this._addEntity(Tank, TankView, wavespawn);
		}

		addTankAndOutputs(wavespawn) {
			let tank = this.addTank(wavespawn);
			let onKilledOutput = this._addEntity(OnKilledOutput, OutputView, tank);
			let onBombDroppedOutput = this._addEntity(OnBombDroppedOutput, OutputView, tank);

			onKilledOutput.setAttribute('Target', 'boss_dead_relay');
			onKilledOutput.setAttribute('Action', 'Trigger');

			onBombDroppedOutput.setAttribute('Target', 'boss_deploy_relay');
			onBombDroppedOutput.setAttribute('Action', 'Trigger');
		}

		addCharacterAttributes(bot) {
			return this._addEntity(CharacterAttributes, CharacterAttributesView, bot);
		}

		addItemAttributes(bot) {
			return this._addEntity(ItemAttributes, ItemAttributesView, bot);
		}

		addSquad(wavespawn) {
			return this._addEntity(Squad, SquadView, wavespawn);
		}

		_addTemplates(parent = this.waveSchedule) {
			return this._addEntity(Templates, TemplatesView, parent);
		}

		getTemplates() {
			return this.templates;
		}

		addEntity(parent) {
			return this._addEntity(Entity, EntityView, parent);
		}

		addTemplate(parent) {
			let entity = this._addEntity(Template, TFBotView, parent);
			return entity;
		}

		addOutput(type, parent) {
			return this._addEntity(type, OutputView, parent);
		}

		addRandomChoice(wavespawn) {
			return this._addEntity(RandomChoice, RandomChoiceView, wavespawn);
		}

		addWave() {
			let wave = this._addEntity(Wave, WaveView, this.waveSchedule);
			wave.setAttribute('Checkpoint', 'yes');
			return wave;
		}

		addWavespawn(wave) {
			return this._addEntity(Wavespawn, WavespawnView, wave);
		}

		setParent(entity, parent) {
			let entityParent = entity.parent;
			if (entityParent) {
				entityParent.removeChild(entity);
				this.updateView(entityParent);
			}
			entity.parent = parent;
			//this.updateView(entity);
			if (parent) {
				parent.addChild(entity);
				this.updateView(parent);
			}
		}

		getView(entity) {
			return this.entityView.get(entity);
		}

		updateView(entity) {
			if (this.updating) {
				if (this.entityView.has(entity)) {
					let view = this.entityView.get(entity);
					if (view !== undefined) {
						view.update();
					}
				}
			}
		}

		updateAll() {
			if (this.updating) {
				for (let view of this.entityView.values()) {
					view.update();
				}
			}
		}

		selectEntity(entity, type) {
			for (let child of entity.parent._childs) {
				if (child instanceof type) {
					//child.select(child === entity);
					this.updateView(child);
				}
			}
		}

		selectWave(selectedWave) {
			this.selectEntity(selectedWave, Wave);
			this.updateView(this.waveSchedule);
		}

		selectWavespawn(selectedWavespawn) {
			this.selectEntity(selectedWavespawn, Wavespawn);
			this.updateView(selectedWavespawn.parent);
		}

		get navigationTags() {
			return this.waveSchedule.navigationTags;
		}

		get where() {
			return this.waveSchedule.where;
		}

		get startingPathTrackNode() {
			return this.waveSchedule.startingPathTrackNode;
		}

		set startingPathTrackNode(startingPathTrackNode) {
			this.waveSchedule.startingPathTrackNode = startingPathTrackNode;
		}

		loadFile(fileName, isStockTemplate) {
			BinaryAsyncRequest(fileName).then(content => {
				new PopReader().read(content, isStockTemplate);
				this.updateAll();
			});
		}

		loadTemplates(fileNames) {
			for (let fileName of fileNames) {
				this.loadFile(fileName, true);
			}
		}

		async initMaps(url) {
			let response = await fetch(url);
			let json = await response.json();
			this.waveSchedule._maps = json;
			this.updateView(this.waveSchedule);
		}
	}
	return Application;
}());

export { Application };
