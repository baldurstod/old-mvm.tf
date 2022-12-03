import {EntityView} from './EntityView.js';

export class ItemAttributesView extends EntityView {
	constructor(entity) {
		super(entity);
		this.create();
	}

	create() {
		super.create();
		this.htmlElement.className = 'entity-view-itemattributes';
		this.htmlElement.innerHTML = 'itemattributes';

		//this.htmlremoveButton.className = 'entity-view-itemattributes-remove';
		this.htmlremoveButton.innerHTML = 'Remove itemattributes';

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
