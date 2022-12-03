import {EntityView} from './EntityView.js';

export class CharacterAttributesView extends EntityView {
	constructor(entity) {
		super(entity);
		this.create();
	}

	create() {
		super.create();
		this.htmlElement.className = 'entity-view-characterattributes';
		this.htmlElement.innerHTML = 'characterattributes';

		//this.htmlremoveButton.className = 'entity-view-characterattributes-remove';
		this.htmlremoveButton.innerHTML = 'Remove characterattributes';

		this.htmlElement.append(this.htmlremoveButton);
	}

	update() {
		this.htmlElement.innerHTML = 'characterattributes';
		for (let [name, value] of this.entity._attributes) {
			//console.error(name, value);
			this.htmlElement.innerHTML += (name + ' ' + value + ' ');

			/*switch (name.toLowerCase()) {
				case 'Template' :
			}*/
		}
	}
}
