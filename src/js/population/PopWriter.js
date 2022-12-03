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

export class PopWriter {
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
