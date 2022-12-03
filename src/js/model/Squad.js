import {Entity} from './Entity.js';

export class Squad extends Entity {
	constructor(name = '') {
		super();
	}
}
Squad.prototype.isSquad = true;
