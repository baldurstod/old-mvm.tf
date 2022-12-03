import {createElement} from 'mindalka-ui';
import 'mindalka-ui/dist/define/mindalka-select.js';

import {EntityView} from './EntityView.js';

import {Application} from '../Application.js';

class TankView extends EntityView {
	constructor(entity) {
		super(entity);
		this.create();
	}

	create() {
		super.create();
		this.htmlElement.className = 'entity-view-tank';
		this.htmlElement.innerHTML = 'Tank';

		//this.htmlremoveButton.className = 'entity-view-tank-remove';
		this.htmlremoveButton.innerHTML = 'Remove tank';

		this.htmlName = document.createElement('label');
		this.htmlNameInput = document.createElement('input');
		this.htmlNameInput.addEventListener('input', (event) => this.entity.setAttribute('Health', event.target.value));
		this.htmlName.append('Name', this.htmlNameInput);

		this.htmlHealth = document.createElement('label');
		this.htmlHealthInput = document.createElement('input');
		this.htmlHealthInput.addEventListener('input', (event) => this.entity.setAttribute('Health', event.target.value));
		this.htmlHealth.append('Health', this.htmlHealthInput);

		this.htmlSpeed = document.createElement('label');
		this.htmlSpeedInput = document.createElement('input');
		this.htmlSpeedInput.addEventListener('input', (event) => this.entity.setAttribute('Speed', event.target.value));
		this.htmlSpeed.append('Speed', this.htmlSpeedInput);

		this.htmlSkin = document.createElement('label');
		this.htmlSkinInput = document.createElement('input');
		this.htmlSkinInput.addEventListener('input', (event) => this.entity.setAttribute('Speed', event.target.value));
		this.htmlSkin.append('Skin', this.htmlSkinInput);

		this.htmlStartingPathTrackNode = document.createElement('label');
		this.htmlStartingPathTrackNodeInput = document.createElement('mindalka-select');
		this.htmlStartingPathTrackNode.append('Starting path track node', this.htmlStartingPathTrackNodeInput);
		this.htmlStartingPathTrackNodeInput.addEventListener('input', (event) => this.entity.setAttribute('StartingPathTrackNode', event.target.value));

		this.htmlElement.append(this.htmlremoveButton, this.htmlName, this.htmlHealth, this.htmlSpeed, this.htmlSkin, this.htmlStartingPathTrackNode);
	}

	update() {
		this.htmlStartingPathTrackNodeInput.setOptions(Application.startingPathTrackNode);
		this.htmlNameInput.value = '';
		this.htmlHealthInput.value = '';
		this.htmlSpeedInput.value = '';
		this.htmlSkinInput.value = '';
		this.htmlStartingPathTrackNodeInput.unselectAll();


		for (let child of this.entity._childs) {
			let view = Application.getView(child);
			switch (true) {
				default:
					console.error(child);
					break;
			}
		}

		let nonePathSelected = true;
		for (let [name, value] of this.entity._attributes) {
			switch (name.toLowerCase()) {
				case 'name' :
					this.htmlNameInput.value = value;
					break;
				case 'health' :
					this.htmlHealthInput.value = value;
					break;
				case 'speed' :
					this.htmlSpeedInput.value = value;
					break;
				case 'skin' :
					this.htmlSkinInput.value = value;
					break;skin
				case 'startingpathtracknode' :
					this.htmlStartingPathTrackNodeInput.select(value.toLowerCase());
					Application.startingPathTrackNode = value;
					nonePathSelected = false;
					break;
				default:
					console.error(name, value);
					break;
			}
		}
		if (nonePathSelected) {
			this.htmlStartingPathTrackNodeInput.selectFirst();
		}
	}
}

export {TankView};
