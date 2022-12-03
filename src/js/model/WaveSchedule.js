import {Entity} from './Entity.js';

export class WaveSchedule extends Entity {
	constructor() {
		super();
		this.base = new Set();
		this.currency = "";
		this.respawnTime = "";
		//this.waves = [];
		this.canBotsAttackWhileInSpawnRoom = "";
		this.addSentryBusterWhenDamageDealtExceeds = "";
		this.addSentryBusterWhenKillCountExceeds = "";
		this.advanced = "";
		this.fixedRespawnWaveTime = false;
		this.zombieBots = false;
		//this.currentTab = 'Waves';

		/*this.mapChangeListenerList = new Array();
		this.waitAction = false;
		this.abortAction = false;
		this.resetBomb = false;*/

		this._navigationTags = new Set();
		this._where = new Set();

		this._startingPathTrackNode = new Set();
		this._maps = undefined;
	}

	get maps() {
		if (this._maps) {
			let maps = new Set(['']);
			for (let map in this._maps) {
				maps.add(map);
			}
			return maps;
		}
		return null;
	}

	get map() {
		return this._map;
	}

	set map(map) {
		this._map = map;
		this._navigationTags.clear();
		this._where.clear();
		this._startingPathTrackNode.clear();
		if (this._maps) {
			let mapData = this._maps[map];
			if (mapData) {
				for (let spawn of mapData.spawns) {
					this._where.add(spawn);
				}
				for (let tag of mapData.tags) {
					this._navigationTags.add(tag);
				}
				for (let tankpath of mapData.tankpaths) {
					this._startingPathTrackNode.add(tankpath);
				}
			}
		}
	}

	reset() {
		this.base.clear();
		this.base.add('robot_standard.pop');
		this.base.add('robot_giant.pop');
		this.base.add('robot_gatebot.pop');

		this._navigationTags.clear();
		this._where.clear();
		this._startingPathTrackNode.clear();
	}

	addBase(base) {
		this.base.add(base);
	}

	get navigationTags() {
		return this._navigationTags;
	}

	get where() {
		return this._where;
	}

	get startingPathTrackNode() {
		return this._startingPathTrackNode;
	}

	set startingPathTrackNode(startingPathTrackNode) {
		startingPathTrackNode = startingPathTrackNode.toLowerCase();
		if (!this._startingPathTrackNode.has(startingPathTrackNode)) {
			this._startingPathTrackNode.add(startingPathTrackNode);
		}
	}

}
