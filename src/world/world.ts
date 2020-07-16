import { OrderedSet } from '../internal';
import { Render } from '../render/index';
import { Game, Entity } from '../internal';
import { EventQueue } from './event_queue';
import { Component } from './components/component';

export class World {
	/** Constructor. */
	constructor(game: Game) {
		// Set the game that contains this.
		this._game = game;

		// Create the render scene and set the uniforms function.
		this._scene = new Render.Scene();
		// this._scene.uniformsFunction = this._sceneUniforms.bind(this);
	}

	/** Gets the game that contains this. */
	get game(): Game {
		return this._game;
	}

	/** Gets the event queue. */
	get eventQueue(): EventQueue {
		return this._eventQueue;
	}

	/** Adds a new entity. */
	createEntity(): Entity {
		const entity = new Entity(this);
		this._entities.add(entity);
		return entity;
	}

	/** Removes an entity. */
	destroyEntity(entity: Entity): boolean {
		return this._entities.remove(entity);
	}

	// private _sceneUniforms(shader: Render.Shader): void {
	// }

	/** The list of entities this contains. */
	private _entities: OrderedSet<Entity> = new OrderedSet();

	private _scene: Render.Scene = new Render.Scene();

	private _eventQueue: EventQueue = new EventQueue();

	/** The game that contains this. */
	private _game: Game;
}
