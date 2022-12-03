import {createElement} from 'mindalka-ui';

import {Application} from '../Application.js';
import {getImg} from '../Img.js';

export class EntityView {
	constructor(entity) {
		this.entity = entity;
	}

	create() {
		this.htmlElement = createElement('div');

		this.htmlremoveButton = createElement('button', {
			class: 'entity-remove-button',
			events: {
				click: () => {
					Application.removeEntity(this.entity)
				}
			},
		});

		(async () => {
			this.htmlremoveButton.innerHTML = await getImg('remove_circle_outline-24px.svg');
		})();
	}

	update() {
	}
}
