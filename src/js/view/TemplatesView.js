import {createElement} from 'mindalka-ui';
import 'mindalka-ui/dist/define/mindalka-select.js';

//import {TFBot,, EntityView, Templates, Template} from '../internal.js';
import {EntityView} from './EntityView.js';
import {TFBot} from '../model/TFBot.js';

import {Application} from '../Application.js';

const NEW_TEMPLATE_NAME = 'new_template';
export class TemplatesView extends EntityView {
	constructor(entity) {
		super(entity);
		this.create();
		this.templates = new Set();
		this.selectedTemplate = '';
	}

	create() {
		super.create();
		this.htmlElement.className = 'entity-view-templates';

		//this.htmlremoveButton.className = 'entity-view-mission-remove';
		this.htmlremoveButton.innerHTML = 'Remove mission';

		this.htmlAddTemplateButton = document.createElement('button');
		this.htmlAddTemplateButton.className = 'entity-view-wavespawn-add-bot';
		this.htmlAddTemplateButton.innerHTML = 'Add template';
		this.htmlAddTemplateButton.addEventListener('click', (event) => {
			let entity = Application.addTemplate(this.entity);
			entity.entityName = NEW_TEMPLATE_NAME;
			entity.entityNameEditable = true;
			this.selectedTemplate = NEW_TEMPLATE_NAME;
			this.templates.add(NEW_TEMPLATE_NAME);
			this.update();
			Application.updateView(entity);
		});

		this.htmlSelect = document.createElement('label');
		this.htmlSelectInput = document.createElement('mindalka-select');
		this.htmlSelect.append('Template', this.htmlSelectInput);


		this.htmlSelectInput.addEventListener('input', (event) => {
			//console.error(event);
			this.selectedTemplate = event.target.value.toLowerCase();
			setTimeout(() => this.update2(), 10);
		});

		this.botContainer = document.createElement('div');
		this.botContainer.className = 'entity-view-mission-bots';

		this.templateDataList = document.createElement('datalist');
		this.templateDataList.id = 'entity-view-waveschedule-template-datalist';

		this.htmlElement.append(this.htmlAddTemplateButton, this.htmlSelect, this.botContainer, this.templateDataList);
	}

	update() {
		this.templateDataList.innerHTML = '';
		this.templates.clear();
		this.update2();
		this.htmlSelectInput.setOptions(this.templates);
		this.htmlSelectInput.select(this.selectedTemplate);

		for (let template of this.templates) {
			let option = document.createElement('option');
			option.innerHTML = option.value = template;
			this.templateDataList.append(option);
		}
	}

	update2() {
		this.htmlAddTemplateButton.disabled = false;
		this.botContainer.innerHTML = '';
		for (let child of this.entity._childs) {
			let view = Application.getView(child);
			switch (true) {
				case child.isTemplate:
					if (child.entityName === NEW_TEMPLATE_NAME) {
						this.htmlAddTemplateButton.disabled = true;
					}
					if (this.selectedTemplate === child.entityName) {
						this.botContainer.append(view.htmlElement);
					}
					//this.htmlSelectInput.select(value.toLowerCase());
					this.templates.add(child.entityName);
					break;
				default:
					console.error(child);
					break;
			}
		}
	}
}
