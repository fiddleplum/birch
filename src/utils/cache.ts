/** A cache is a set of named objects with use counts that are automatically created and destroyed. */
export class Cache<Type> {
	/** The constructor. */
	constructor(createObject: (name: string) => Type, destroyObject: (object: Type) => void, objectToName: (object: Type) => string) {
		this._createObject = createObject;
		this._destroyObject = destroyObject;
		this._objectToName = objectToName;
	}

	/** The destructor. */
	destroy(): void {
		// Destroy any objects still in use.
		for (const mapEntry of this._objects) {
			this._destroyObject(mapEntry[1].object);
		}
	}

	/** Gets the named object. */
	get(name: string): Type {
		let entry = this._objects.get(name);
		if (entry === undefined) {
			entry = {
				object: this._createObject(name),
				useCount: 0
			};
		}
		entry.useCount += 1;
		return entry.object;
	}

	/** Releases the named object. */
	release(nameOrObject: string | Type): void {
		let name: string;
		if (typeof nameOrObject === 'string') {
			name = nameOrObject;
		}
		else {
			name = this._objectToName(nameOrObject);
		}
		const entry = this._objects.get(name);
		if (entry === undefined) {
			return;
		}
		entry.useCount -= 1;
		if (entry.useCount === 0) {
			this._destroyObject(entry.object);
			this._objects.delete(name);
		}
	}

	/** Returns true if the cache has the named object. */
	has(name: string): boolean {
		return this._objects.get(name) !== undefined;
	}

	/** Returns the use count of the named object. */
	useCount(name: string): number {
		const entry = this._objects.get(name);
		if (entry !== undefined) {
			return entry.useCount;
		}
		else {
			return 0;
		}
	}

	private _objects: Map<string, { object: Type, useCount: number }> = new Map();

	/** The create object function. */
	private _createObject: (name: string) => Type;

	/** The destroy object function. */
	private _destroyObject: (object: Type) => void;

	/** The function that maps the object to a name. */
	private _objectToName: (object: Type) => string;
}
