/*
The cache should:

create - creates a new object. doesn't change use count. it doesn't do any name-specific loading.
destroy - destroys an object. it's removed from the system. throws an error if the use count is > 0.
get - gets an object, but if it doesn't exist, it returns undefined. incs use count.
getOrCreate - gets an object, but if it doesn't exist it creates it
release - releases an object. decs use count.

*/

/** A cache is a set of named objects with use counts that are automatically created and destroyed. */
export class Cache<Type> {
	/** The constructor. */
	constructor(createObject: () => Type, destroyObject: (object: Type) => void) {
		this._createObject = createObject;
		this._destroyObject = destroyObject;
	}

	/** The destructor. Throws an error if there are still objects being used. */
	destroy(): void {
		let usedList = ``;
		// Destroy any objects still in use.
		for (const mapEntry of this._objects) {
			if (mapEntry[1].useCount > 0) {
				usedList += `${mapEntry[0]}: ${mapEntry[1].useCount}\n`;
			}
			else {
				this._destroyObject(mapEntry[1].object);
			}
		}
		if (usedList !== ``) {
			throw new Error(`There are still used objects in the cache:\n${usedList}`);
		}
	}

	/** Creates a new named object. Throws an error if the name is already in the cache. */
	create(name: string): void {
		if (name === '') {
			throw new Error(`The name must not be an empty string.`);
		}
		if (this._objects.has(name)) {
			throw new Error(`There is already an object with the name '${name}' in the cache.`);
		}
		// Create the object and entry.
		const object = this._createObject();
		const entry = {
			object: object,
			useCount: 0
		};
		// Set the mappings.
		this._objects.set(name, entry);
		this._objectsToNames.set(object, name);
	}

	/** Loads a new named object. Throws an error if the name is already in the cache. */
	load(name: string, loadFunction?: (object: Type, name: string) => Promise<void>): Promise<void> {
		// Create the object.
		this.create(name);
		const object = this._objects.get(name)!.object;
		// Call the load function.
		if (loadFunction !== undefined) {
			return loadFunction(object, name);
		}
		else if (this._defaultLoadFunction !== undefined) {
			return this._defaultLoadFunction(object, name);
		}
		else {
			return Promise.resolve();
		}
	}

	/** Unloads an object. If it doesn't exist already unloaded, it throws an error. */
	unload(nameOrObject: string | Type): void {
		// Get the name and entry.
		const name = this._nameOrObjectToName(nameOrObject);
		const entry = this._objects.get(name);
		if (entry === undefined) {
			throw new Error(`There is no object with the name '${name}' in the cache.`);
		}
		if (entry.useCount > 0) {
			throw new Error(`The object with the name '${name}' is still has a use count of ${entry.useCount}.`);
		}
		// Destroy the object.
		this._destroyObject(entry.object);
		// Clear the mappings.
		this._objects.delete(name);
		this._objectsToNames.delete(entry.object);
	}

	/** Gets a loaded object by name. Throws an error if the object isn't loaded. */
	get(name: string): Type {
		// Get the entry.
		const entry = this._objects.get(name);
		if (entry === undefined) {
			throw new Error(`There is no object with the name '${name}' in the cache.`);
		}
		// Increment the use count.
		entry.useCount += 1;
		// Return the object.
		return entry.object;
	}

	/** Releases a loaded object. Throws an error if the object isn't loaded. */
	release(nameOrObject: string | Type): void {
		// Get the name and entry.
		const name = this._nameOrObjectToName(nameOrObject);
		const entry = this._objects.get(name);
		if (entry === undefined) {
			throw new Error(`There is no object with the name '${name}' in the cache.`);
		}
		if (entry.useCount === 0) {
			throw new Error(`The object with the name '${name}' is already has a use count of 0.`);
		}
		// Decrement the use count.
		entry.useCount -= 1;
	}

	/** Sets the default load function that gets called when none is specified in the load() call. */
	setDefaultLoadFunction(loadFunction: ((object: Type, name: string) => Promise<void>) | undefined): void {
		this._defaultLoadFunction = loadFunction;
	}

	/** Gets true if the cache has the named object. */
	has(name: string): boolean {
		return this._objects.get(name) !== undefined;
	}

	/** Gets the use count of the named object. */
	useCount(name: string): number {
		const entry = this._objects.get(name);
		if (entry !== undefined) {
			return entry.useCount;
		}
		else {
			return 0;
		}
	}

	private _nameOrObjectToName(nameOrObject: string | Type): string {
		if (typeof nameOrObject === 'string') {
			return nameOrObject;
		}
		else {
			const maybeName = this._objectsToNames.get(nameOrObject);
			if (maybeName === undefined) {
				throw new Error(`The specified object isn't in the cache.`);
			}
			return maybeName;
		}
	}

	/** The mapping of names to objects and their use counts. */
	private _objects: Map<string, { object: Type, useCount: number }> = new Map();

	/** The mapping of objects to names. */
	private _objectsToNames: Map<Type, string> = new Map();

	/** The create object function. */
	private _createObject: () => Type;

	/** The destroy object function. */
	private _destroyObject: (object: Type) => void;

	/** The default load function that gets called when none is specified in the load() call. */
	private _defaultLoadFunction: ((object: Type, name: string) => Promise<void>) | undefined;
}
