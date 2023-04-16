// このスクリプト内のオブジェクトは、ユーティリティー用の機能の分離を目的としている。

class HTMLUtilityElement extends HTMLElement {
	
	static {
		
		this.observedAttributeNames = [ 'id' ];
		
	}
	
	static get observedAttributes() {
		
		return this.observedAttributeNames;
		
	}
	
	static attachEvent(target, type, handler, option = false) {
		
		typeof handler === 'function' && target?.addEventListener(type, handler, option);
		
	}
	
	static setLoggers(target) {
		
		const	isElement = target instanceof Element,
				id = (isElement ? '<' : '[') + (target.id ? '#' + target.id : (target.getAttribute('is') || target.tagName).toLowerCase()) + (isElement ? '>' : ']');
		
		target.log = console.log.bind(console, '🗒', id),
		target.warn = console.warn.bind(console, '🚨', id),
		target.error = console.error.bind(console, '☠️', id);
		
	}
	
	constructor() {
		
		super();
		
		const	{ bound, element } = this.constructor,
				template = this?.template?.content.cloneNode(true);
		
		if (template) {
			
			for (const k in element) this[k] = template.querySelector(element[k]);
			
			this.attachShadow({ mode: 'open' }).appendChild(template);
			
		}
		
		for (const v of bound) typeof v === 'function' && (this[v.name] = v.bind(this));
		
		this.setLoggers();
		
	}
	attributeChangedCallback(name, last, current) {
		
		name === 'id' && this.setLoggers();
		
	}
	
	attachEvent() {
		
		HTMLUtilityElement.attachEvent(...arguments);
		
	}
	setLoggers() {
		
		HTMLUtilityElement.setLoggers(this);
		
	}
	
	get template() {
		
		return document.getElementById(this.getAttribute('template'));
		
	}
	set template(v) {
		
		this.setAttribute('template', v);
		
	}
	
}

class HTMLCopyButtonElement extends HTMLButtonElement {
	
	static {
		
		this.tagName = 'copy-button',
		
		this.definition = { extends: 'button' };
		
	}
	static get observedAttributes() {
		
		return [ 'id' ];
		
	}
	
	static async clicked() {
		
		const { for: sourceElement, trim } = this, source = sourceElement?.value ?? sourceElement.textContent;
		
		await navigator.clipboard.writeText(trim ? source.trim() : source),
		
		this.log('🖨', source);
		
	}
	
	constructor() {
		
		super();
		
		this.addEventListener('click', this.clicked = HTMLCopyButtonElement.clicked.bind(this)),
		
		HTMLUtilityElement.setLoggers(this);
		
	}
	attributeChangedCallback(name, last, current) {
		
		name === 'id' && HTMLUtilityElement.setLoggers(this);
		
	}
	
	get for() {
		
		return this.getRootNode().getElementById(this.getAttribute('for'));
		
	}
	set for(v) {
		
		return this.getAttribute(v instanceof Element ? v.id : v);
		
	}
	get trim() {
		
		return this.hasAttribute('trim');
		
	}
	set trim(v) {
		
		this.toggleAttribute('trim', !!v);
		
	}
	
}
customElements.define(HTMLCopyButtonElement.tagName, HTMLCopyButtonElement, HTMLCopyButtonElement.definition);