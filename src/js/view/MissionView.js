import {createElement} from 'mindalka-ui';
import 'mindalka-ui/dist/define/mindalka-select.js';

//import {TFBot, EntityView, Mission} from '../internal.js';
import {EntityView} from './EntityView.js';

import {Mission} from '../model/Mission.js';
import {Application} from '../Application.js';

export class MissionView extends EntityView {
	constructor(entity) {
		super(entity);
		this.create();
	}

	create() {
		super.create();
		this.htmlElement.className = 'entity-view-mission';
		this.htmlElement.innerHTML = 'mission';

		//this.htmlremoveButton.className = 'entity-view-mission-remove';
		//this.htmlremoveButton.innerHTML = 'Remove mission';

		this.htmlAddBotButton = document.createElement('button');//removeme
		this.htmlAddBotButton.id = 'entity-view-wavespawn-add-bot';
		this.htmlAddBotButton.innerHTML = 'Add bot';
		this.htmlAddBotButton.addEventListener('click', (event) => Application.addBot(this.entity));

		this.htmlObjective = document.createElement('label');
		this.htmlObjectiveInput = createElement('mindalka-select');
		this.htmlObjectiveInput.setOptions(Mission.objectives);
		this.htmlObjective.append('Objective', this.htmlObjectiveInput);

		this.htmlWhere = document.createElement('label');
		this.htmlWhereInput = createElement('mindalka-select');
		this.htmlWhereInput.setAttribute('multiple', true);
		this.htmlWhere.append('Where', this.htmlWhereInput);

		this.htmlCooldownTime = document.createElement('label');
		this.htmlCooldownTimeInput = document.createElement('input');
		this.htmlCooldownTimeInput.addEventListener('input', (event) => this.entity.setAttribute('CooldownTime', event.target.value));
		this.htmlCooldownTime.append('Cooldown time', this.htmlCooldownTimeInput);

		this.htmlInitialCooldown = document.createElement('label');
		this.htmlInitialCooldownInput = document.createElement('input');
		this.htmlInitialCooldownInput.addEventListener('input', (event) => this.entity.setAttribute('InitialCooldown', event.target.value));
		this.htmlInitialCooldown.append('Initial cooldown', this.htmlInitialCooldownInput);

		this.htmlBeginAtWave = document.createElement('label');
		this.htmlBeginAtWaveInput = document.createElement('input');
		this.htmlBeginAtWaveInput.addEventListener('input', (event) => this.entity.setAttribute('BeginAtWave', event.target.value));
		this.htmlBeginAtWave.append('Begin at wave', this.htmlBeginAtWaveInput);

		this.htmlRunForThisManyWaves = document.createElement('label');
		this.htmlRunForThisManyWavesInput = document.createElement('input');
		this.htmlRunForThisManyWavesInput.addEventListener('input', (event) => this.entity.setAttribute('RunForThisManyWaves', event.target.value));
		this.htmlRunForThisManyWaves.append('Run for this many waves', this.htmlRunForThisManyWavesInput);

		this.htmlDesiredCount = document.createElement('label');
		this.htmlDesiredCountInput = document.createElement('input');
		this.htmlDesiredCountInput.addEventListener('input', (event) => this.entity.setAttribute('DesiredCount', event.target.value));
		this.htmlDesiredCount.append('Desired count', this.htmlDesiredCountInput);


		this.botContainer = document.createElement('div');
		this.botContainer.className = 'entity-view-mission-bots';

		this.htmlElement.append(this.htmlremoveButton, /*this.htmlAddBotButton, */this.htmlObjective, this.htmlWhere,
			this.htmlCooldownTime, this.htmlInitialCooldown, this.htmlBeginAtWave, this.htmlRunForThisManyWaves, this.htmlDesiredCount,
			this.botContainer);
	}

	update() {
		this.htmlWhereInput.setOptions(Application.where);
		this.botContainer.innerHTML = '';
		this.htmlAddBotButton.disabled = false;
		this.htmlWhereInput.unselectAll();
		this.htmlObjectiveInput.unselectAll();
		this.htmlCooldownTimeInput.value = '';
		this.htmlInitialCooldownInput.value = '';
		this.htmlBeginAtWaveInput.value = '';
		this.htmlRunForThisManyWavesInput.value = '';
		this.htmlDesiredCountInput.value = '';
		for (let child of this.entity._childs) {
			let view = Application.getView(child);
			switch (true) {
				case child.isTFBot:
					this.botContainer.append(view.htmlElement);
					this.htmlAddBotButton.disabled = true;
					break;
			}
		}
		for (let [name, value] of this.entity._attributes) {
			switch (name.toLowerCase()) {
				case 'where' :
					this.htmlWhereInput.select(value.toLowerCase());
					break;
				case 'objective' :
					this.htmlObjectiveInput.select(value.toLowerCase());
					break;
				case 'cooldowntime' :
					this.htmlCooldownTimeInput.value = value;
					break;
				case 'initialcooldown' :
					this.htmlInitialCooldownInput.value = value;
					break;
				case 'beginatwave' :
					this.htmlBeginAtWaveInput.value = value;
					break;
				case 'runforthismanywaves' :
					this.htmlRunForThisManyWavesInput.value = value;
					break;
				case 'desiredcount' :
					this.htmlDesiredCountInput.value = value;
					break;
				default:
					console.error(name, value);
					break;
			}
		}
	}
}
