import {createElement} from 'mindalka-ui';
import 'mindalka-ui/dist/define/mindalka-select.js';
//import {Attribute, ,, CharacterAttributes,, , Mission, Template} from '../internal.js';
import {EntityView} from './EntityView.js';
import {TF2_CLASSES, BOT_SKILLS, BOT_ATTRIBUTES, BOT_BEHAVIOUR, WEAPON_RESTRICTION} from '../Constants.js';

import {Application} from '../Application.js';

export class TFBotView extends EntityView {
	constructor(entity) {
		super(entity);
		this.create();
	}

	create() {
		super.create();
		this.htmlElement.className = 'entity-view-bot';
		this.htmlTitle = document.createElement('div');
		this.htmlElement.append(this.htmlTitle);

		//this.htmlremoveButton.className = 'entity-view-bot-remove';
		//this.htmlremoveButton.innerHTML = 'Remove bot';
		if (!(this.entity.isTemplate)) {
			this.htmlElement.append(this.htmlremoveButton);
		}

		this.htmlClassIcon = document.createElement('div');

		this.htmlName = document.createElement('label');
		this.htmlNameInput = document.createElement('input');
		this.htmlNameInput.addEventListener('input', (event) => this.entity.setAttribute('Name', event.target.value));
		this.htmlName.append('Name', this.htmlNameInput);

		this.htmlTemplateName = document.createElement('label');
		this.htmlTemplateNameInput = document.createElement('input');
		this.htmlTemplateNameInput.addEventListener('change', (event) => {
			if (this.entity.entityNameEditable) {
				this.entity.entityName = event.target.value;
				Application.getView(this.entity.parent).selectedTemplate = this.entity.entityName;
				Application.updateView(this.entity.parent);
				this.update();
			}
		});
		this.htmlTemplateName.append('Template name', this.htmlTemplateNameInput);

		this.htmlTemplate = document.createElement('label');
		this.htmlTemplateInput = document.createElement('input');
		this.htmlTemplateInput.datalist = 'entity-view-waveschedule-template-datalist';
		this.htmlTemplateInput.setAttribute('list', 'entity-view-waveschedule-template-datalist');
		this.htmlTemplateInput.addEventListener('input', (event) => this.entity.setAttribute('Template', event.target.value));
		this.htmlTemplate.append('Template', this.htmlTemplateInput);

		this.htmlClass = document.createElement('label');
		this.htmlClassInput = createElement('mindalka-select');
		this.htmlClassInput.setOptions(TF2_CLASSES);
		this.htmlClassInput.addEventListener('input', (event) => this.entity.setAttribute('Class', event.target.value));
		this.htmlClass.append('Class', this.htmlClassInput);

		this.htmlSkill = document.createElement('label');
		this.htmlSkillInput = document.createElement('mindalka-select');
		this.htmlSkillInput.setOptions(BOT_SKILLS);
		this.htmlSkillInput.addEventListener('input', (event) => this.entity.setAttribute('Skill', event.target.value));
		this.htmlSkill.append('Skill', this.htmlSkillInput);

		this.htmlMaxVisionRange = document.createElement('label');
		this.htmlMaxVisionRangeInput = document.createElement('input');
		this.htmlMaxVisionRangeInput.addEventListener('input', (event) => this.entity.setAttribute('MaxVisionRange', event.target.value));
		this.htmlMaxVisionRange.append('Max vision range', this.htmlMaxVisionRangeInput);

		this.htmlHealth = document.createElement('label');
		this.htmlHealthInput = document.createElement('input');
		this.htmlHealthInput.addEventListener('input', (event) => this.entity.setAttribute('Health', event.target.value));
		this.htmlHealth.append('Health', this.htmlHealthInput);

		this.htmlScale = document.createElement('label');
		this.htmlScaleInput = document.createElement('input');
		this.htmlScaleInput.addEventListener('input', (event) => this.entity.setAttribute('Scale', event.target.value));
		this.htmlScale.append('Scale', this.htmlScaleInput);

		this.htmlAttributes = document.createElement('label');
		this.htmlAttributesInput = document.createElement('mindalka-select');
		this.htmlAttributesInput.setOptions(BOT_ATTRIBUTES);
		this.htmlAttributesInput.setAttribute('multiple', true);
		this.htmlAttributesInput.addEventListener('input', (event) => {
			this.entity.removeValues('Attributes');
			for (let option of event.target.selectedOptions) {
				this.entity.setAttribute('Attributes', option.value);
			}
		});
		this.htmlAttributes.append('Attributes', this.htmlAttributesInput);

		this.htmlWeaponRestriction = document.createElement('label');
		this.htmlWeaponRestrictionInput = document.createElement('mindalka-select');
		this.htmlWeaponRestrictionInput.setOptions(WEAPON_RESTRICTION);
		this.htmlWeaponRestrictionInput.addEventListener('input', (event) => this.entity.setAttribute('WeaponRestriction', event.target.value));
		this.htmlWeaponRestriction.append('Weapon restriction', this.htmlWeaponRestrictionInput);

		this.htmlNavigationTags = document.createElement('label');
		this.htmlNavigationTagsInput = document.createElement('mindalka-select');
		this.htmlNavigationTagsInput.setOptions(BOT_ATTRIBUTES);
		this.htmlNavigationTagsInput.setAttribute('multiple', true);
		this.htmlNavigationTagsInput.addEventListener('input', (event) => {
			this.entity.removeValues('Tag');
			for (let option of event.target.selectedOptions) {
				this.entity.setAttribute('Tag', option.value);
			}
		});
		this.htmlNavigationTags.append('Navigation tags', this.htmlNavigationTagsInput);

		this.htmlBehaviorModifiers = document.createElement('label');
		this.htmlBehaviorModifiersInput = document.createElement('mindalka-select');
		this.htmlBehaviorModifiersInput.setOptions(BOT_BEHAVIOUR);
		this.htmlBehaviorModifiersInput.addEventListener('input', (event) => this.entity.setAttribute('BehaviorModifiers', event.target.value));
		this.htmlBehaviorModifiers.append('Behavior modifiers', this.htmlBehaviorModifiersInput);

		this.htmlTeleportWhere = document.createElement('label');
		this.htmlTeleportWhereInput = document.createElement('mindalka-select');
		this.htmlTeleportWhereInput.setAttribute('multiple', true);
		this.htmlTeleportWhereInput.addEventListener('input', (event) => {
			this.entity.removeValues('TeleportWhere');
			for (let option of event.target.selectedOptions) {
				this.entity.setAttribute('TeleportWhere', option.value);
			}
		});
		this.htmlTeleportWhere.append('Teleport where', this.htmlTeleportWhereInput);

		this.htmlAutoJumpMin = document.createElement('label');
		this.htmlAutoJumpMinInput = document.createElement('input');
		this.htmlAutoJumpMinInput.addEventListener('input', (event) => this.entity.setAttribute('AutoJumpMin', event.target.value));
		this.htmlAutoJumpMin.append('Auto jump min', this.htmlAutoJumpMinInput);

		this.htmlAutoJumpMax = document.createElement('label');
		this.htmlAutoJumpMaxInput = document.createElement('input');
		this.htmlAutoJumpMaxInput.addEventListener('input', (event) => this.entity.setAttribute('AutoJumpMax', event.target.value));
		this.htmlAutoJumpMax.append('Auto jump max', this.htmlAutoJumpMaxInput);

		this.itemsContainer = document.createElement('div');
		this.itemsContainer.className = 'entity-view-bot-items-container';
		this.itemsContainerItems = document.createElement('div');
		this.itemsContainerAdd = document.createElement('div');
		this.itemsContainerAdd.innerHTML = 'Add Item';
		this.itemsContainerAdd.className = 'entity-view-bot-items-container-add';
		this.itemsContainerAdd.addEventListener('click', (event) => {
			this.entity.setAttribute('Item', 'test');
			this.update();
		});
		this.itemsContainer.append(this.itemsContainerItems, this.itemsContainerAdd);

		this.attributesContainer = document.createElement('div');
		this.attributesContainer.className = 'entity-view-bot-attributes-container';
		this.htmlElement.append(this.htmlClassIcon, this.htmlName, this.htmlTemplateName, this.htmlTemplate, this.htmlClass,
			this.htmlSkill, this.htmlMaxVisionRange, this.htmlHealth, this.htmlScale, this.htmlAttributes,
			this.htmlWeaponRestriction, this.htmlNavigationTags, this.htmlBehaviorModifiers, this.htmlTeleportWhere,
			this.htmlAutoJumpMin, this.htmlAutoJumpMax,
			this.attributesContainer, this.itemsContainer);
	}

	update() {
		if (this.entity.isTemplate) {
			this.htmlTitle.innerHTML = this.entity.entityName;
		} else {
			this.htmlTitle.innerHTML = 'TFBot';
		}
		if (this.entity._parent.isMission) {
			this.htmlremoveButton.style.display = 'none';
		} else {
			this.htmlremoveButton.style.display = '';
		}
		if (this.entity.entityNameEditable) {
			this.htmlTemplateNameInput.value = this.entity.entityName;
			this.htmlTemplateName.style.display = '';
		} else {
			this.htmlTemplateName.style.display = 'none';
		}
		this.htmlNavigationTagsInput.setOptions(Application.navigationTags);
		this.htmlTeleportWhereInput.setOptions(Application.where);
		this.htmlClassInput.unselectAll();
		this.htmlSkillInput.unselectAll();
		this.htmlAttributesInput.unselectAll();
		this.htmlWeaponRestrictionInput.unselectAll();
		this.htmlNavigationTagsInput.unselectAll();
		this.htmlBehaviorModifiersInput.unselectAll();
		this.htmlTeleportWhereInput.unselectAll();

		this.htmlClassIcon.innerHTML = '';

		this.htmlNameInput.value = '';
		this.htmlTemplateInput.value = '';
		this.htmlClassInput.value = '';
		this.htmlSkillInput.value = '';

		this.htmlScaleInput.value = '';
		this.attributesContainer.innerHTML = '';
		this.itemsContainerItems.innerHTML = '';

		this.htmlHealth.value = '';
		this.htmlAutoJumpMinInput.value = '';
		for (let child of this.entity._childs) {
			//console.error('child : ', child);
			let view = Application.getView(child);
			switch (true) {
				case child.isCharacterAttributes:
					this.attributesContainer.append(view.htmlElement);
					break;
				case child.isItemAttributes:
					this.attributesContainer.append(view.htmlElement);
					break;
				default:
					console.error(child);
					break;
			}
		}
		for (let [name, value] of this.entity._attributes) {
			switch (name.toLowerCase()) {
				case 'classicon' :
					this.htmlClassIcon.innerHTML = value;
					break;
				case 'name' :
					this.htmlNameInput.value = value;
					break;
				case 'template' :
					this.htmlTemplateInput.value = value;
					break;
				case 'class' :
					this.htmlClassInput.select(value.toLowerCase());
					break;
				case 'skill' :
					this.htmlSkillInput.select(value.toLowerCase());
					break;
				case 'maxvisionrange' :
					this.htmlMaxVisionRange.value = value;
					break;
				case 'health' :
					this.htmlHealth.value = value;
					break;
				case 'scale' :
					this.htmlScaleInput.value = value;
					break;
				case 'attributes' :
					this.htmlAttributesInput.select(value);
				case 'weaponrestrictions' :
					this.htmlWeaponRestrictionInput.select(value.toLowerCase());
					break;
				case 'tag' :
					this.htmlNavigationTagsInput.select(value.toLowerCase());
					break;
				case 'item' :
					//this.htmlNavigationTagsInput.select(value.toLowerCase());
					let div = document.createElement('div');
					this.itemsContainerItems.append(div);
					div.innerHTML = value;
					break;
				case 'behaviormodifiers' :
					this.htmlBehaviorModifiersInput.select(value.toLowerCase());
					break;
				case 'teleportwhere' :
					this.htmlTeleportWhereInput.value = value;
					break;
				case 'autojumpmin' :
					this.htmlAutoJumpMinInput.value = value;
					break;
				case 'autojumpmax' :
					this.htmlAutoJumpMaxInput.value = value;
					break;
				default:
					console.error(name, value);
					break;
			}
		}
	}
}
