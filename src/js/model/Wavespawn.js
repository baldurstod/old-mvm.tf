//import {TFBot, RandomChoice} from '../internal.js';

import {Entity} from './Entity.js';

import {Application} from '../Application.js';

export class Wavespawn extends Entity {
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
