import {Entity} from './Entity.js';

export class Tank extends Entity {
	constructor(name = '') {
		super();
	}
}
Tank.prototype.isTank = true;
