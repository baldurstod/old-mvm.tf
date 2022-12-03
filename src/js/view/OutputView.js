import {EntityView} from './EntityView.js';

export class OutputView extends EntityView {
	constructor(entity) {
		super(entity);
		this.create();
	}

	create() {
		super.create();
		this.htmlElement.className = 'entity-view-output';
		this.htmlElement.innerHTML = 'Output';

		//this.htmlremoveButton.className = 'entity-view-tank-remove';
		this.htmlremoveButton.innerHTML = 'Remove tank';//?

		this.htmlElement.append(this.htmlremoveButton);
	}

	update() {

	}
}
