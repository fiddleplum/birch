import { OrderedSet } from '../utils/ordered_set';
import { Scene } from '../render/scene';
import { Entity } from './entity';
import { Game } from '../internal';

export class World {
	/** Constructor. */
	constructor(game: Game) {
		this._game = game;
	}

	/** Gets the game that contains this. */
	get game(): Game {
		return this._game;
	}

	/** Adds a new entity. */
	addNewEntity(): Entity {
		const entity = new Entity(this);
		this._entities.add(entity);
		return entity;
	}

	/** Removes an entity. */
	removeEntity(entity: Entity): boolean {
		return this._entities.remove(entity);
	}

	/** The list of entities this contains. */
	private _entities: OrderedSet<Entity> = new OrderedSet();

	private _scene: Scene = new Scene();

	/** The game that contains this. */
	private _game: Game;
}
