import * as PopParser from './PopParser.js';

import {OnBombDroppedOutput, OnKilledOutput, FirstSpawnOutput, InitWaveOutput, DoneOutput, StartWaveOutput} from '../model/Output.js';
import {Templates} from '../model/Templates.js';

import {Application} from '../Application.js';

export class PopReader {
	constructor() {
	}

	read(content, isStockTemplate){
		Application.updating = false;
		let parsed = PopParser.PopParser.parse(content);
		if (parsed) {
			this.entities = [];
			this.currentEntity = null;
			for (let i in parsed.base) {
				Application.addBase(parsed.base[i]);
			}
			this.parseAttribute(parsed.WaveSchedule, isStockTemplate);
		}
		Application.updating = true;
	}

	parseAttribute(attribute, isStockTemplate) {
		if (attribute.value instanceof Array) {
			let entity = null;
			switch (attribute.name.toLowerCase()) {
				case 'waveschedule':
					entity = Application.waveSchedule;
					break;
				case 'mission':
					entity = Application.addMission();
					break;
				case 'wave':
					entity = Application.addWave();
					break;
				case 'wavespawn':
					entity = Application.addWavespawn(this.currentEntity);
					break;
				case 'tfbot':
					entity = Application.addBot(this.currentEntity);
					break;
				case 'tank':
					entity = Application.addTank(this.currentEntity);
					break;
				case 'squad':
					entity = Application.addSquad(this.currentEntity);
					break;
				case 'randomchoice':
					entity = Application.addRandomChoice(this.currentEntity);
					break;
				case 'characterattributes':
					entity = Application.addCharacterAttributes(this.currentEntity);
					break;
				case 'itemattributes':
					entity = Application.addItemAttributes(this.currentEntity);
					break;
				case 'startwaveoutput':
					entity = Application.addOutput(StartWaveOutput, this.currentEntity);
					break;
				case 'doneoutput':
					entity = Application.addOutput(DoneOutput, this.currentEntity);
					break;
				case 'initwaveoutput':
					entity = Application.addOutput(InitWaveOutput, this.currentEntity);
					break;
				case 'firstspawnoutput':
					entity = Application.addOutput(FirstSpawnOutput, this.currentEntity);
					break;
				case 'onkilledoutput':
					entity = Application.addOutput(OnKilledOutput, this.currentEntity);
					break;
				case 'onbombdroppedoutput':
					entity = Application.addOutput(OnBombDroppedOutput, this.currentEntity);
					break;
				case 'templates':
					entity = Application.getTemplates();
					break;
				default:
					if (this.currentEntity.isTemplates) {
						entity = Application.addTemplate(this.currentEntity);
						if (isStockTemplate) {
							entity.isStockTemplate = true;
						}
					} else {
						//console.error('Unknown attribute ', attribute.name);
						// add a basic entity
						entity = Application.addEntity(this.currentEntity);
					}
					entity.entityName = attribute.name.toLowerCase();
			}
			if (entity) {
				this.entities.push(entity);
				this.currentEntity = entity;
				attribute.value.forEach(element => this.parseAttribute(element, isStockTemplate));
				Application.updateView(entity);
				this.entities.pop();
				this.currentEntity = this.entities[this.entities.length - 1];
			}

		} else {
			if (this.currentEntity) {
				this.currentEntity.setAttribute(attribute.name, attribute.value);
			}
		}

	}
}
