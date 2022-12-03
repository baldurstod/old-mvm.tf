import {EntityView} from './EntityView.js';
import {Application} from '../Application.js';

export class SquadView extends EntityView {
	constructor(entity) {
		super(entity);
		this.create();
	}

	create() {
		super.create();
		this.htmlElement.className = 'entity-view-squad';
		this.htmlElement.innerHTML = 'Squad';

		//this.htmlremoveButton.className = 'entity-view-squad-remove';
		//this.htmlremoveButton.innerHTML = 'Remove squad';

		this


		this.htmlFormationSize = document.createElement('label');
		this.htmlFormationSizeInput = document.createElement('input');
		this.htmlFormationSizeInput.addEventListener('input', (event) => this.entity.setAttribute('FormationSize', event.target.value));
		this.htmlFormationSize.append('FormationSize', this.htmlFormationSizeInput);

		this.htmlAddBotButton = document.createElement('button');
		this.htmlAddBotButton.id = 'entity-view-wavespawn-add-bot';
		this.htmlAddBotButton.innerHTML = 'Add bot';
		this.htmlAddBotButton.addEventListener('click', (event) => Application.addBot(this.entity));

		this.botContainer = document.createElement('div');
		this.botContainer.className = 'entity-view-squad-bots';

		this.htmlElement.append(this.htmlremoveButton, this.htmlFormationSize, this.htmlAddBotButton, this.botContainer);
	}

	update() {
		this.botContainer.innerHTML = '';
		for (let child of this.entity._childs) {
			let view = Application.getView(child);
			switch (true) {
				case child.isTFBot:
					this.botContainer.append(view.htmlElement);
					break;
			}
		}

		for (let [name, value] of this.entity._attributes) {
			switch (name.toLowerCase()) {
				case 'formationsize' :
					this.htmlFormationSizeInput.value = value;
					break;
				default:
					console.error(name, value);
					break;
			}
		}
	}
}
