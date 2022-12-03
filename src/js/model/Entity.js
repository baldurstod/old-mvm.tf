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

export class Entity {
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
		}
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
		this._attributes.get(attribute);
	}

	removeAttribute(attribute) {
		throw 'Error';
		this._attributes.delete(attribute);
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
