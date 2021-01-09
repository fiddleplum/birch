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

	/** Sets the name to url function. The name is translated to a url before being passed to the createObject function. */
	setNameToUrlFunction(nameToUrlFunction: (name: string) => string): void {
		this._nameToUrlFunction = nameToUrlFunction;
	}

	/** Gets the named object. The object must already be loaded or it throws an error. */
	get(name: string): Type {
		const entry = this._objects.get(name);
		if (entry === undefined) {
			throw new Error(`There is no object with the name ${name} in the cache.`);
		}
		return entry.object;
	}

	/** Loads the named object. If it's already loaded, it increases its use count. */
	load(name: string): void {
		let entry = this._objects.get(name);
		if (entry === undefined) {
			entry = {
				object: this._createObject(this._nameToUrlFunction ? this._nameToUrlFunction(name) : name),
				useCount: 0
			};
		}
		entry.useCount += 1;
	}

	/** Unloads the named object. If it was loaded more than once, it decreases its use count. If it is already unloaded, it does nothing. */
	unload(nameOrObject: string | Type): void {
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

	/** The function that maps names to urls. */
	private _nameToUrlFunction: ((name: string) => string) | undefined;
}
