import {Entity} from './Entity.js';

export class Mission extends Entity {
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
