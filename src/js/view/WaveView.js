import {createElement} from 'mindalka-ui';
import 'mindalka-ui/dist/define/mindalka-tab.js';
import 'mindalka-ui/dist/define/mindalka-tab-group.js';

//import {Attribute, TFBot, EntityView, Wavespawn} from '../internal.js';
import {EntityView} from './EntityView.js';

import {Application} from '../Application.js';
import {TFBot} from '../model/TFBot.js';

export class WaveView extends EntityView {
	constructor(entity) {
		super(entity);
		this.create();
	}

	create() {
		super.create();
		this.htmlElement.className = 'entity-view-wave';
		this.htmlElement.innerHTML = 'Wave';

		//this.htmlremoveButton.className = 'entity-view-wave-remove';
		//this.htmlremoveButton.innerHTML = 'Remove wave';

		this.htmlAddWavespawnButton = createElement('button', {
			parent: this.htmlElement,
			class: 'entity-view-wave-add-wavespawn',
			i18n: '#add_wavespawn',
			events: {
				click: () => {
					let wavespawn = Application.addWavespawn(this.entity)
					let view = Application.getView(wavespawn);
					this.tabPanel.active = view.htmlElement.parentElement;
				}

			},
		});
		this.htmlDescription = document.createElement('label');
		this.htmlDescriptionInput = document.createElement('input');
		this.htmlDescriptionInput.addEventListener('input', (event) => this.entity.setAttribute('Description', event.target.value));
		this.htmlDescription.append('Description', this.htmlDescriptionInput);

		this.htmlCheckpoint = document.createElement('label');
		this.htmlCheckpointInput = document.createElement('input');
		this.htmlCheckpointInput.type = 'checkbox';
		this.htmlCheckpointInput.addEventListener('input', (event) => this.entity.setAttribute('Checkpoint', event.target.checked ? 'yes' : 'no'));
		this.htmlCheckpoint.append('Checkpoint', this.htmlCheckpointInput);

		this.htmlWaitWhenDone = document.createElement('label');
		this.htmlWaitWhenDoneInput = document.createElement('input');
		this.htmlWaitWhenDoneInput.addEventListener('input', (event) => this.entity.setAttribute('WaitWhenDone', event.target.value));
		this.htmlWaitWhenDone.append('Wait when done', this.htmlWaitWhenDoneInput);

		this.htmlSound = document.createElement('label');
		this.htmlSoundInput = document.createElement('input');
		this.htmlSoundInput.addEventListener('input', (event) => this.entity.setAttribute('Sound', event.target.value));
		this.htmlSound.append('Sound', this.htmlSoundInput);

		this.tabPanel = createElement('mindalka-tab-group', {
			class: 'entity-view-wave-wavespawns-tabs',
		});
		/*this.tabPanel.setAttribute('tabs-classname', 'entity-view-wave-wavespawns-tabs');
		this.tabPanel.setAttribute('panels-classname', 'entity-view-wave-wavespawns');
		this.tabPanel.setAttribute('tab-classname', 'entity-view-wave-wavespawns-tab');*/
		//this.tabPanel.appendExtra(this.htmlAddWavespawnButton);

		this.htmlElement.append(this.htmlremoveButton, /*this.htmlAddWavespawnButton, */this.htmlDescription, this.htmlCheckpoint, this.htmlWaitWhenDone, this.htmlSound, this.tabPanel);
	}

	update() {
		this.htmlElement.style.display = '';
		this.htmlDescriptionInput.value = '';
		this.htmlWaitWhenDoneInput.value = '';
		this.htmlSoundInput.value = '';
		this.htmlCheckpointInput.checked = false;
		this.tabPanel.clear();
		let i = 0;
		for (let child of this.entity._childs) {
			switch (true) {
				case child.isWavespawn:
					let view = Application.getView(child);
					let waveTab = createElement('mindalka-tab', {
						parent: this.tabPanel,
						'data-i18n': ++i,
						child: view.htmlElement,
					})
					break;
			}
		}
		for (let [name, value] of this.entity._attributes) {
			switch (name.toLowerCase()) {
				case 'description' :
					this.htmlDescriptionInput.value = value;
					break;
				case 'checkpoint' :
					this.htmlCheckpointInput.checked = (value.toLowerCase() == 'yes');
					break;
				case 'waitwhendone' :
					this.htmlWaitWhenDoneInput.value = value;
					break;
				case 'sound' :
					this.htmlSoundInput.value = value;
					break;
				default:
					console.error(name, value);
					break;
			}
		}
	}

}
