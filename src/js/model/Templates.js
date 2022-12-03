import {Entity} from './Entity.js';

export class Templates extends Entity {
	constructor(entity) {
		super(entity);
	}

	write() {
		return this._childs.size > 0;
	}
}
Templates.prototype.isTemplates = true;
