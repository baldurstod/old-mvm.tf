import {I18n, SaveFile} from 'mindalka-browser-utils';
/*import {Attribute, , AttributeView, BinaryAsyncRequest, , , , , ,
	, , JSONAsyncRequest, , , , , , , , , , , , , ,
	} from './internal.js';*/

import {CharacterAttributes} from './model/CharacterAttributes.js';
import {Entity} from './model/Entity.js';
import {ItemAttributes} from './model/ItemAttributes.js';
import {Mission} from './model/Mission.js';
import {OnKilledOutput, OnBombDroppedOutput} from './model/Output.js';
import {RandomChoice} from './model/RandomChoice.js';
import {Squad} from './model/Squad.js';
import {Tank} from './model/Tank.js';
import {Template} from './model/Template.js';
import {Templates} from './model/Templates.js';
import {TFBot} from './model/TFBot.js';
import {Wave} from './model/Wave.js';
import {Wavespawn} from './model/Wavespawn.js';
import {WaveSchedule} from './model/WaveSchedule.js';

import {PopReader} from './population/PopReader.js';
import {PopWriter} from './population/PopWriter.js';

import {CharacterAttributesView} from './view/CharacterAttributesView.js';
import {EntityView} from './view/EntityView.js';
import {ItemAttributesView} from './view/ItemAttributesView.js';
import {MissionView} from './view/MissionView.js';
import {OutputView} from './view/OutputView.js';
import {RandomChoiceView} from './view/RandomChoiceView.js';
import {SquadView} from './view/SquadView.js';
import {TankView} from './view/TankView.js';
import {TemplatesView} from './view/TemplatesView.js';
import {TFBotView} from './view/TFBotView.js';
import {WaveScheduleView} from './view/WaveScheduleView.js';
import {WavespawnView} from './view/WavespawnView.js';
import {WaveView} from './view/WaveView.js';

import '../css/attribute.css';
import '../css/mvm.css';

export const Application = new (function () {
	class Application {
		constructor() {
			this.entityView = new Map();
			this.viewEntity = new Map();
			this.waveSchedule = new WaveSchedule();
			this.waveScheduleView = new WaveScheduleView(this.waveSchedule);
			this.addEntity2(this.waveSchedule, this.waveScheduleView);
			this.resetPopulation();
			this.templates = this._addTemplates();
			this.updating = true;
			I18n.start();
		}

		start() {
			this.addWavespawn(this.addWave());
			//this.loadTemplates(['./popfiles/robot_standard.pop', './popfiles/robot_gatebot.pop', './popfiles/robot_giant.pop']);
			this.initMaps('./json/maps.json');
		}

		exportWaveSchedule() {
			this.waveSchedule.validate();
			let popWriter = new PopWriter();
			let content = popWriter.write(this.waveSchedule);

			SaveFile(new File([new Blob([content])], 'mvm.tf.pop'));
		}

		resetPopulation() {
			this.waveSchedule.reset();
			this.waveSchedule._attributes.clear();
			for (let child of this.waveSchedule._childs) {
				if (!(child.isTemplates)) {
					this.waveSchedule._childs.delete(child);
				}
			}

			this.waveSchedule.setAttribute('StartingCurrency', 400);
			this.waveSchedule.setAttribute('CanBotsAttackWhileInSpawnRoom', 'no');
		}

		addBase(base) {
			this.waveSchedule.addBase(base);
		}

		addEntity2(entity, view) {
			this.entityView.set(entity, view);
			this.viewEntity.set(view, entity);
		}

		removeEntity(entity) {
			if (this.entityView.has(entity)) {
				this.setParent(entity, null);
				let view = this.entityView.get(entity);
				this.viewEntity.delete(view);
				this.entityView.delete(entity);
			}
		}

		createAttribute(name) {
			throw 'error';
			let attribute = new Attribute(name);
			let attributeView = new AttributeView(attribute);

			attributeView.update();
			this.addEntity2(attribute, attributeView);
			return attribute;
		}

		_addEntity(entityType, viewType, parent) {
			let entity = new entityType();
			let entityView = new viewType(entity);
			this.addEntity2(entity, entityView);
			this.setParent(entity, parent);

			if (this.updating) {
				entityView.update();
			}
			return entity;
		}

		/*removeEntity(entity) {
			this.setParent(entity, null);
		}*/

		addMission() {
			return this._addEntity(Mission, MissionView, this.waveSchedule);
		}

		addBot(wavespawn) {
			return this._addEntity(TFBot, TFBotView, wavespawn);
		}

		addTank(wavespawn) {
			return this._addEntity(Tank, TankView, wavespawn);
		}

		addTankAndOutputs(wavespawn) {
			let tank = this.addTank(wavespawn);
			let onKilledOutput = this._addEntity(OnKilledOutput, OutputView, tank);
			let onBombDroppedOutput = this._addEntity(OnBombDroppedOutput, OutputView, tank);

			onKilledOutput.setAttribute('Target', 'boss_dead_relay');
			onKilledOutput.setAttribute('Action', 'Trigger');

			onBombDroppedOutput.setAttribute('Target', 'boss_deploy_relay');
			onBombDroppedOutput.setAttribute('Action', 'Trigger');
		}

		addCharacterAttributes(bot) {
			return this._addEntity(CharacterAttributes, CharacterAttributesView, bot);
		}

		addItemAttributes(bot) {
			return this._addEntity(ItemAttributes, ItemAttributesView, bot);
		}

		addSquad(wavespawn) {
			return this._addEntity(Squad, SquadView, wavespawn);
		}

		_addTemplates(parent = this.waveSchedule) {
			return this._addEntity(Templates, TemplatesView, parent);
		}

		getTemplates() {
			return this.templates;
		}

		addEntity(parent) {
			return this._addEntity(Entity, EntityView, parent);
		}

		addTemplate(parent) {
			let entity = this._addEntity(Template, TFBotView, parent);
			return entity;
		}

		addOutput(type, parent) {
			return this._addEntity(type, OutputView, parent);
		}

		addRandomChoice(wavespawn) {
			return this._addEntity(RandomChoice, RandomChoiceView, wavespawn);
		}

		addWave() {
			let wave = this._addEntity(Wave, WaveView, this.waveSchedule);
			wave.setAttribute('Checkpoint', 'yes');
			return wave;
		}

		addWavespawn(wave) {
			return this._addEntity(Wavespawn, WavespawnView, wave);
		}

		setParent(entity, parent) {
			let entityParent = entity.parent;
			if (entityParent) {
				entityParent.removeChild(entity);
				this.updateView(entityParent);
			}
			entity.parent = parent;
			//this.updateView(entity);
			if (parent) {
				parent.addChild(entity);
				this.updateView(parent);
			}
		}

		getView(entity) {
			return this.entityView.get(entity);
		}

		updateView(entity) {
			if (this.updating) {
				if (this.entityView.has(entity)) {
					let view = this.entityView.get(entity);
					if (view !== undefined) {
						view.update();
					}
				}
			}
		}

		updateAll() {
			if (this.updating) {
				for (let view of this.entityView.values()) {
					view.update();
				}
			}
		}

		selectEntity(entity, type) {
			for (let child of entity.parent._childs) {
				if (child instanceof type) {
					//child.select(child === entity);
					this.updateView(child);
				}
			}
		}

		selectWave(selectedWave) {
			this.selectEntity(selectedWave, Wave);
			this.updateView(this.waveSchedule);
		}

		selectWavespawn(selectedWavespawn) {
			this.selectEntity(selectedWavespawn, Wavespawn);
			this.updateView(selectedWavespawn.parent);
		}

		get navigationTags() {
			return this.waveSchedule.navigationTags;
		}

		get where() {
			return this.waveSchedule.where;
		}

		get startingPathTrackNode() {
			return this.waveSchedule.startingPathTrackNode;
		}

		set startingPathTrackNode(startingPathTrackNode) {
			this.waveSchedule.startingPathTrackNode = startingPathTrackNode;
		}

		loadFile(fileName, isStockTemplate) {
			BinaryAsyncRequest(fileName).then(content => {
				new PopReader().read(content, isStockTemplate);
				this.updateAll();
			});
		}

		loadTemplates(fileNames) {
			for (let fileName of fileNames) {
				this.loadFile(fileName, true);
			}
		}

		async initMaps(url) {
			let response = await fetch(url);
			let json = await response.json();
			this.waveSchedule._maps = json;
			this.updateView(this.waveSchedule);
		}
	}
	return Application;
}());
