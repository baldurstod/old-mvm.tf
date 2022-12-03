import {EntityView} from './EntityView.js';

import {Application} from '../Application.js';

export class RandomChoiceView extends EntityView {
	constructor(entity) {
		super(entity);
		this.create();
	}

	create() {
		super.create();
		this.htmlElement.className = 'entity-view-randomchoice';

		this.htmlAddBotButton = document.createElement('button');
		this.htmlAddBotButton.className = 'entity-view-wavespawn-add-bot';
		this.htmlAddBotButton.innerHTML = 'Add bot';
		this.htmlAddBotButton.addEventListener('click', (event) => Application.addBot(this.entity));

		this.botContainer = document.createElement('div');
		this.botContainer.className = 'entity-view-randomchoice-bots';
		this.htmlElement.append(this.htmlAddBotButton, this.botContainer);
	}

	update() {
		this.botContainer.innerHTML = '';
		for (let child of this.entity._childs) {
			//console.error('child : ', child);
			let view = Application.getView(child);
			switch (true) {
				case child.isTFBot:
					this.botContainer.append(view.htmlElement);
					break;
			}
		}
	}
}
