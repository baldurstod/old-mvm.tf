import {Entity} from './Entity.js';

export class Wave extends Entity {
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
