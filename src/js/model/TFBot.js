import {Entity} from './Entity.js';

// TODo: remove constants ?
export const BOT_CLASS_SCOUT = 0;
export const BOT_CLASS_SOLDIER = 1;
export const BOT_CLASS_PYRO = 2;
export const BOT_CLASS_DEMO = 3;
export const BOT_CLASS_HEAVY = 4;
export const BOT_CLASS_MEDIC = 5;
export const BOT_CLASS_SNIPER = 6;
export const BOT_CLASS_SPY = 7;
export const BOT_CLASS_ENGY = 8;

export class TFBot extends Entity {
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
