/** Pool for keeping garbage production down. */
export class Pool<Type extends { [key: string]: any }> {
	/** Constructor. */
	constructor(type: new (...args: any[]) => Type) {
		this._type = type;
	}

	/** Get an object from the pool. */
	get(): Type {
		if (this._numFreeIndices > 0) {
			const object = this._objects[this._freeIndices[this._numFreeIndices - 1]];
			this._numFreeIndices -= 1;
			return object;
		}
		else {
			const object = new this._type();
			this._objectsToIndices.set(object, this._objects.length);
			this._objects.push(object);
			return object;
		}
	}

	/** Release an object back to the pool. */
	release(object: Type): void {
		// Get the index of the object.
		const index = this._objectsToIndices.get(object);
		if (index === undefined) {
			return;
		}
		this._objectsToIndices.delete(object);
		if (this._numFreeIndices === this._freeIndices.length) {
			this._freeIndices.push(index);
		}
		else {
			this._freeIndices[this._numFreeIndices] = index;
		}
		this._numFreeIndices += 1;
	}

	/** The type of object that will be constructed. */
	private _type: new (...args: any[]) => Type;

	/** The list of objects, free and used. */
	private _objects: Type[] = [];

	/** The list of indices in _objects that are free. */
	private _freeIndices: number[] = [];

	/** The number of free indices in the _freeIndices array. */
	private _numFreeIndices: number = 0;

	/** A mapping of objects to their indices. */
	private _objectsToIndices: Map<Type, number> = new Map();
}

export default Pool;
