import {createElement} from 'mindalka-ui';
import 'mindalka-ui/dist/define/mindalka-select.js';

//import {Attribute, TFBot, EntityView, RandomChoice, Squad, Tank} from '../internal.js';
import {EntityView} from './EntityView.js';

import {Application} from '../Application.js';

export class WavespawnView extends EntityView {
	constructor(entity) {
		super(entity);
		this.create();
	}

	create() {
		super.create();
		this.htmlElement.className = 'entity-view-wavespawn';
		this.htmlElement.innerHTML = 'wavespawn';

		//this.htmlremoveButton.className = 'entity-view-wavespawn-remove';
		//this.htmlremoveButton.innerHTML = 'Remove wavespawn';

		this.htmlAddBotButton = document.createElement('button');
		this.htmlAddBotButton.className = 'entity-view-wavespawn-add-bot';
		this.htmlAddBotButton.innerHTML = 'Add bot';
		this.htmlAddBotButton.addEventListener('click', (event) => Application.addBot(this.entity));

		this.htmlAddSquadButton = document.createElement('button');
		this.htmlAddSquadButton.className = 'entity-view-wavespawn-add-squad';
		this.htmlAddSquadButton.innerHTML = 'Add squad';
		this.htmlAddSquadButton.addEventListener('click', (event) => Application.addSquad(this.entity));

		this.htmlAddTankButton = document.createElement('button');
		this.htmlAddTankButton.className = 'entity-view-wavespawn-add-tank';
		this.htmlAddTankButton.innerHTML = 'Add tank';
		this.htmlAddTankButton.addEventListener('click', (event) => {Application.addTankAndOutputs(this.entity)});

		this.htmlName = document.createElement('label');
		this.htmlNameInput = document.createElement('input');
		this.htmlNameInput.addEventListener('input', (event) => this.entity.setAttribute('Name', event.target.value));
		this.htmlName.append('Name', this.htmlNameInput);

		this.htmlTotalCurrency = document.createElement('label');
		this.htmlTotalCurrencyInput = document.createElement('input');
		this.htmlTotalCurrencyInput.addEventListener('input', (event) => this.entity.setAttribute('TotalCurrency', event.target.value));
		this.htmlTotalCurrency.append('Total currency', this.htmlTotalCurrencyInput);

		this.htmlWaitBetweenSpawns = document.createElement('label');
		this.htmlWaitBetweenSpawnsInput = document.createElement('input');
		this.htmlWaitBetweenSpawnsInput.addEventListener('input', (event) => this.entity.setAttribute('WaitBetweenSpawns', event.target.value));
		this.htmlWaitBetweenSpawns.append('Wait between spawns', this.htmlWaitBetweenSpawnsInput);

		this.htmlWaitBeforeStarting = document.createElement('label');
		this.htmlWaitBeforeStartingInput = document.createElement('input');
		this.htmlWaitBeforeStartingInput.addEventListener('input', (event) => this.entity.setAttribute('WaitBeforeStarting', event.target.value));
		this.htmlWaitBeforeStarting.append('Wait before starting', this.htmlWaitBeforeStartingInput);

		this.htmlWaitForAllSpawned = document.createElement('label');
		this.htmlWaitForAllSpawnedInput = document.createElement('input');
		this.htmlWaitForAllSpawnedInput.addEventListener('input', (event) => this.entity.setAttribute('WaitForAllSpawned', event.target.value));
		this.htmlWaitForAllSpawned.append('Wait for all spawned', this.htmlWaitForAllSpawnedInput);

		this.htmlWaitForAllDead = document.createElement('label');
		this.htmlWaitForAllDeadInput = document.createElement('input');
		this.htmlWaitForAllDeadInput.addEventListener('input', (event) => this.entity.setAttribute('WaitForAllDead', event.target.value));
		this.htmlWaitForAllDead.append('Wait for all dead', this.htmlWaitForAllDeadInput);

		this.htmlWaitBetweenSpawnsAfterDeath = document.createElement('label');
		this.htmlWaitBetweenSpawnsAfterDeathInput = document.createElement('input');
		this.htmlWaitBetweenSpawnsAfterDeathInput.addEventListener('input', (event) => this.entity.setAttribute('WaitBetweenSpawnsAfterDeath', event.target.value));
		this.htmlWaitBetweenSpawnsAfterDeath.append('Wait between spawns after death', this.htmlWaitBetweenSpawnsAfterDeathInput);

		this.htmlTotalCount = document.createElement('label');
		this.htmlTotalCountInput = document.createElement('input');
		this.htmlTotalCountInput.addEventListener('input', (event) => this.entity.setAttribute('TotalCount', event.target.value));
		this.htmlTotalCount.append('Total count', this.htmlTotalCountInput);

		this.htmlSpawnCount = document.createElement('label');
		this.htmlSpawnCountInput = document.createElement('input');
		this.htmlSpawnCountInput.addEventListener('input', (event) => this.entity.setAttribute('SpawnCount', event.target.value));
		this.htmlSpawnCount.append('Spawn count', this.htmlSpawnCountInput);

		this.htmlMaxActive = document.createElement('label');
		this.htmlMaxActiveInput = document.createElement('input');
		this.htmlMaxActiveInput.addEventListener('input', (event) => this.entity.setAttribute('MaxActive', event.target.value));
		this.htmlMaxActive.append('Max active', this.htmlMaxActiveInput);

		this.htmlRandomChoice = document.createElement('label');
		this.htmlRandomChoiceInput = document.createElement('input');
		this.htmlRandomChoiceInput.type = 'checkbox';
		this.htmlRandomChoiceInput.addEventListener('input', (event) => this.entity.randomChoice = event.target.checked);
		this.htmlRandomChoice.append('Random choice', this.htmlRandomChoiceInput);

		this.htmlRandomSpawn = document.createElement('label');
		this.htmlRandomSpawnInput = document.createElement('input');
		this.htmlRandomSpawnInput.type = 'checkbox';
		this.htmlRandomSpawnInput.addEventListener('input', (event) => this.entity.setAttribute('RandomSpawn', event.target.checked));
		this.htmlRandomSpawn.append('Random spawn', this.htmlRandomSpawnInput);

		this.htmlSupport = document.createElement('label');
		this.htmlSupportInput = document.createElement('input');
		this.htmlSupportInput.type = 'checkbox';
		this.htmlSupportInput.addEventListener('input', (event) => this.entity.setAttribute('Support', event.target.checked));
		this.htmlSupport.append('Support', this.htmlSupportInput);

		this.htmlWhere = document.createElement('label');
		this.htmlWhereInput = createElement('mindalka-select');
		this.htmlWhereInput.setAttribute('multiple', true);
		this.htmlWhere.append('Where', this.htmlWhereInput);

		this.botContainer = document.createElement('div');
		this.botContainer.className = 'entity-view-wavespawn-bots';
		this.htmlElement.append(this.htmlremoveButton, this.htmlRandomChoice, this.htmlRandomSpawn,
			this.htmlSupport, this.htmlName, this.htmlWaitForAllSpawned, this.htmlWaitForAllDead, this.htmlTotalCurrency,
			this.htmlWaitBetweenSpawns, this.htmlWaitBetweenSpawnsAfterDeath, this.htmlWaitBeforeStarting, this.htmlWhere,
			this.htmlTotalCount, this.htmlSpawnCount, this.htmlMaxActive,
			this.botContainer);
	}

	update() {
		this.htmlWhereInput.setOptions(Application.where);
		this.botContainer.innerHTML = '';
		this.botContainer.append(this.htmlAddBotButton, this.htmlAddSquadButton, this.htmlAddTankButton);
		this.htmlRandomChoice.checked = false;
		this.htmlRandomSpawnInput.checked = false;
		this.htmlSupportInput.checked = false;
		this.htmlElement.style.display = '';
		this.htmlWhereInput.unselectAll();
		this.htmlNameInput.value = '';
		this.htmlTotalCurrencyInput.value = '';
		this.htmlWaitBetweenSpawnsInput.value = '';
		this.htmlWaitBeforeStartingInput.value = '';
		this.htmlWaitForAllSpawnedInput.value = '';
		this.htmlWaitForAllDeadInput.value = '';
		this.htmlWaitBetweenSpawnsAfterDeathInput.value = '';
		this.htmlTotalCountInput.value = '';
		this.htmlSpawnCountInput.value = '';
		this.htmlMaxActiveInput.value = '';
		this.htmlAddBotButton.disabled = false;
		this.htmlAddSquadButton.disabled = false;
		this.htmlAddTankButton.disabled = false;
		for (let child of this.entity._childs) {
			let view = Application.getView(child);
			switch (true) {
				case child.isTFBot:
				case child.isSquad:
				case child.isTank:
					this.botContainer.innerHTML = '';
					this.botContainer.append(view.htmlElement);
					this.htmlAddBotButton.disabled = true;
					this.htmlAddSquadButton.disabled = true;
					this.htmlAddTankButton.disabled = true;
					break;
				case child.isRandomChoice:
					this.botContainer.innerHTML = '';
					this.botContainer.append(view.htmlElement);
					this.htmlRandomChoice.checked = true;
					break;
			}
		}
		for (let [name, value] of this.entity._attributes) {
			switch (name.toLowerCase()) {
				case 'where' :
					this.htmlWhereInput.select(value.toLowerCase());
					break;
				case 'name' :
					this.htmlNameInput.value = value;
					break;
				case 'totalcurrency' :
					this.htmlTotalCurrencyInput.value = value;
					break;
				case 'waitbetweenspawns' :
					this.htmlWaitBetweenSpawnsInput.value = value;
					break;
				case 'waitbeforestarting' :
					this.htmlWaitBeforeStartingInput.value = value;
					break;
				case 'waitforallspawned' :
					this.htmlWaitForAllSpawnedInput.value = value;
					break;
				case 'waitforalldead' :
					this.htmlWaitForAllDeadInput.value = value;
					break;
				case 'waitbetweenspawnsafterdeath' :
					this.htmlWaitBetweenSpawnsAfterDeathInput.value = value;
					break;
				case 'totalcount' :
					this.htmlTotalCountInput.value = value;
					break;
				case 'spawncount' :
					this.htmlSpawnCountInput.value = value;
					break;
				case 'maxactive' :
					this.htmlMaxActiveInput.value = value;
					break;
				case 'support' :
					this.htmlSupportInput.checked = value;
					break;
				case 'randomspawn' :
					this.htmlRandomSpawnInput.checked = value;
					break;
				default:
					console.error(name, value);
					break;
			}
		}
	}
}
