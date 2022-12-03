import {createElement} from 'mindalka-ui';
import 'mindalka-ui/dist/define/mindalka-select.js';
import 'mindalka-ui/dist/define/mindalka-tab.js';
import 'mindalka-ui/dist/define/mindalka-tab-group.js';

import {EntityView} from './EntityView.js';

import {PopReader} from '../population/PopReader.js';

import {Application} from '../Application.js';
//import {EntityView, Mission, PopReader, Templates, Wave} from '../internal.js';

function processFileInput(event) {
	let files = [];
	if (event.target) {
		files = event.target.files;
	}

	for (let i = 0, f; f = files[i]; i++) {
		if (!f.name.toLowerCase().endsWith('.pop')) {
			continue;
		}

		let reader = new FileReader();

		// Closure to capture the file information.
		reader.onload = ((theFile) => {
			return (e) => {
				Application.updating = false;
				Application.resetPopulation();
				new PopReader().read(e.target.result);
				Application.updating = true;
				Application.updateAll();
			};
		})(f);

		// Read in the image file as a data URL.
		reader.readAsText(f);
	}
}

export class WaveScheduleView extends EntityView {
	#htmlElement;
	constructor(entity) {
		super(entity);
		this.create();
	}

	create() {
		super.create();
		this.#htmlElement = createElement('div', {class: 'entity-view-waveschedule'});
		//.className = 'entity-view-waveschedule';
		document.body.appendChild(this.#htmlElement);

		let buttonsHeader = document.createElement('div');
		buttonsHeader.className = 'entity-view-waveschedule-buttons';

		let htmlLoadPopFile = document.createElement('div');
		htmlLoadPopFile.id = 'entity-view-waveschedule-load-pop-file-outer';
		htmlLoadPopFile.className = 'button';
		htmlLoadPopFile.innerHTML = 'Import pop file';
		this.htmlLoadPopFile = document.createElement('input');
		this.htmlLoadPopFile.type = 'file';
		this.htmlLoadPopFile.id = 'entity-view-waveschedule-load-pop-file';
		this.htmlLoadPopFile.addEventListener('change', (event) => processFileInput(event));
		htmlLoadPopFile.append(this.htmlLoadPopFile);

		this.htmlGenerateButton = document.createElement('div');
		this.htmlGenerateButton.id = 'button entity-view-waveschedule-generate';
		this.htmlGenerateButton.className = 'button';
		this.htmlGenerateButton.innerHTML = 'Export pop file';
		this.htmlGenerateButton.addEventListener('click', (event) => Application.exportWaveSchedule());

		this.htmlMapSelect = document.createElement('label');
		this.htmlMapSelectInput = createElement('mindalka-select');
		this.htmlMapSelect.append('Map', this.htmlMapSelectInput);
		this.htmlMapSelectInput.addEventListener('input', (event) => {this.entity.map = event.target.value.toLowerCase();Application.updateAll();});

		this.htmlStartingCurrency = document.createElement('label');
		this.htmlStartingCurrencyInput = document.createElement('input');
		this.htmlStartingCurrencyInput.addEventListener('input', (event) => this.entity.setAttribute('StartingCurrency', event.target.value));
		this.htmlStartingCurrency.append('Starting currency', this.htmlStartingCurrencyInput);

		this.htmlRespawnWaveTime = document.createElement('label');
		this.htmlRespawnWaveTimeInput = document.createElement('input');
		this.htmlRespawnWaveTimeInput.addEventListener('input', (event) => this.entity.setAttribute('RespawnWaveTime', event.target.value));
		this.htmlRespawnWaveTime.append('Respawn time', this.htmlRespawnWaveTimeInput);

		this.htmlCanBotsAttackWhileInSpawnRoom = document.createElement('label');
		this.htmlCanBotsAttackWhileInSpawnRoomInput = document.createElement('input');
		this.htmlCanBotsAttackWhileInSpawnRoomInput.type = 'checkbox';
		this.htmlCanBotsAttackWhileInSpawnRoomInput.addEventListener('input', (event) => this.entity.setAttribute('CanBotsAttackWhileInSpawnRoom', event.target.checked ? 'yes' : 'no'));
		this.htmlCanBotsAttackWhileInSpawnRoom.append('Bots can attack in spawn', this.htmlCanBotsAttackWhileInSpawnRoomInput);

		this.htmlAdvanced = document.createElement('label');
		this.htmlAdvancedInput = document.createElement('input');
		this.htmlAdvancedInput.type = 'checkbox';
		this.htmlAdvancedInput.addEventListener('input', (event) => this.entity.setAttribute('Advanced', event.target.checked));
		this.htmlAdvanced.append('Advanced', this.htmlAdvancedInput);

		this.htmlEventPopfile = document.createElement('label');
		this.htmlEventPopfileInput = document.createElement('input');
		this.htmlEventPopfileInput.addEventListener('input', (event) => this.entity.setAttribute('EventPopfile', event.target.value));
		this.htmlEventPopfile.append('EventPopfile', this.htmlEventPopfileInput);

		this.htmlFixedRespawnWaveTime = document.createElement('label');
		this.htmlFixedRespawnWaveTimeInput = document.createElement('input');
		this.htmlFixedRespawnWaveTimeInput.type = 'checkbox';
		this.htmlFixedRespawnWaveTimeInput.addEventListener('input', (event) => this.entity.setAttribute('FixedRespawnWaveTime', event.target.checked));
		this.htmlFixedRespawnWaveTime.append('Fixed respawn wave time', this.htmlFixedRespawnWaveTimeInput);

		this.htmlTabPanels = createElement('mindalka-tab-group');
		/*this.htmlTabPanels.setAttribute('tabs-classname', 'entity-view-waveschedule-tabs');
		this.htmlTabPanels.setAttribute('panels-classname', 'entity-view-waveschedule-panel');
		this.htmlTabPanels.setAttribute('tab-classname', 'entity-view-waveschedule-tab');*/

		this.htmlWaves = createElement('mindalka-tab', {
			parent: this.htmlTabPanels,
			class: 'entity-view-waveschedule-waves-tab-panel',
			'data-i18n': '#waves',
		});

		this.htmlAddWaveButton = createElement('button', {
			parent: this.htmlWaves,
			class: 'entity-view-waveschedule-add-wave',
			i18n: '#add_wave',
			events: {
				click: () => {
					let wave = Application.addWave();
					let view = Application.getView(wave);
					//this.htmlWavesTabs.select(view.htmlElement);
					this.htmlWavesTabs.active = view.htmlElement.parentElement;
				}
			}
		});

		this.htmlWavesTabs = createElement('mindalka-tab-group', {
			parent: this.htmlWaves,
			class: 'entity-view-waveschedule-waves-tabs',
		});
		/*this.htmlWavesTabs.setAttribute('tabs-classname', 'entity-view-waveschedule-waves-tabs');
		this.htmlWavesTabs.setAttribute('panels-classname', 'entity-view-waveschedule-waves');
		this.htmlWavesTabs.setAttribute('tab-classname', 'entity-view-waveschedule-waves-tab');*/
		//this.htmlWavesTabs.appendExtra(this.htmlAddWaveButton);/*TODO*/
		//this.htmlWaves.append(/*this.htmlAddWaveButton, */this.htmlWavesTabs);

		this.htmlMissions = createElement('mindalka-tab', {
			parent: this.htmlTabPanels,
			class: 'entity-view-waveschedule-missions-tab-panel',
			'data-i18n': '#missions',
		});


		this.htmlAddMissionButton = createElement('button', {
			parent: this.htmlMissions,
			class: 'entity-view-waveschedule-add-mission',
			i18n: '#add_mission',
			events: {
				click: () => Application.addBot(Application.addMission()),
			},
		});

		this.htmlMissionsTabs = createElement('mindalka-tab-group', {
			parent: this.htmlMissions,
			class: 'entity-view-waveschedule-missions-tabs',
		});
		/*this.htmlMissionsTabs.setAttribute('tabs-classname', '');
		this.htmlMissionsTabs.setAttribute('panels-classname', 'entity-view-waveschedule-missions');
		this.htmlMissionsTabs.setAttribute('tab-classname', 'entity-view-waveschedule-missions-tab');*/
		//this.htmlMissionsTabs.appendExtra(this.htmlAddMissionButton);/*TODO*/
		//this.htmlMissions.append(this.htmlMissionsTabs);

		this.htmlTemplates = createElement('mindalka-tab', {
			parent: this.htmlTabPanels,
			'data-i18n': '#templates',
		});

		//this.htmlTabPanels.addPanel(this.htmlWaves, 'Waves');/*TODO*/
		//this.htmlTabPanels.addPanel(this.htmlMissions, 'Missions');/*TODO*/
		//this.htmlTabPanels.addPanel(this.htmlTemplates, 'Templates');/*TODO*/
		this.#htmlElement.append(buttonsHeader, this.htmlMapSelect, this.htmlStartingCurrency, this.htmlRespawnWaveTime, this.htmlCanBotsAttackWhileInSpawnRoom, this.htmlAdvanced, this.htmlEventPopfile, this.htmlFixedRespawnWaveTime, this.htmlTabPanels);

		buttonsHeader.append(htmlLoadPopFile, this.htmlGenerateButton);
	}

	update() {
		this.htmlStartingCurrencyInput.value = '';
		this.htmlRespawnWaveTimeInput.value = '';
		this.htmlFixedRespawnWaveTimeInput.checked = false;
		this.htmlAdvancedInput.checked = false;
		this.htmlCanBotsAttackWhileInSpawnRoomInput.checked = false;
		this.htmlEventPopfileInput.value = '';
		this.htmlMapSelectInput.setOptions(this.entity.maps);
		this.htmlMapSelectInput.select(this.entity.map);

		this.htmlWavesTabs.clear();
		this.htmlMissionsTabs.clear();
		this.htmlTemplates.innerHTML = '';
		let iWaves = 0;
		let iMissions = 0;
		for (let child of this.entity._childs) {
			let view = Application.getView(child);
			let htmlTab;
			switch (true) {
				case child.isWave:
					htmlTab = createElement('mindalka-tab', {
						parent: this.htmlWavesTabs,
						'data-i18n': ++iWaves,
						child: view.htmlElement,
					})

					//this.htmlWavesTabs.addPanel(view.htmlElement, (++iWaves));
					break;
				case child.isMission:
					//this.htmlMissionsTabs.addPanel(view.htmlElement, (++iMissions));
					htmlTab = createElement('mindalka-tab', {
						parent: this.htmlMissionsTabs,
						'data-i18n': ++iMissions,
						child: view.htmlElement,
					})
					break;
				case child.isTemplates:
					this.htmlTemplates.append(view.htmlElement);
					break;
				default:
					console.error(child);
					break;
			}
		}
		for (let [name, value] of this.entity._attributes) {
			switch (name.toLowerCase()) {
				case 'startingcurrency' :
					this.htmlStartingCurrencyInput.value = value;
					break;
				case 'respawnwavetime' :
					this.htmlRespawnWaveTimeInput.value = value;
					break;
				case 'canbotsattackwhileinspawnroom' :
					this.htmlCanBotsAttackWhileInSpawnRoomInput.checked = (value.toLowerCase() == 'yes');
					break;
				case 'advanced' :
					this.htmlAdvancedInput.checked = value;
					break;
				case 'fixedrespawnwavetime' :
					this.htmlFixedRespawnWaveTimeInput.checked = (value.toLowerCase() == 'yes');
					break;
				case 'eventpopfile' :
					this.htmlEventPopfileInput.value = value;
					break;
				default:
					console.error(name, value);
					break;
			}
		}
	}
}
