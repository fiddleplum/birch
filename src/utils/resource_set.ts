import { List } from './list';
import { Ordered } from './ordered';

export class ResourceSet<Resource> {
	/** Constructs this. */
	constructor(createResource: () => Resource, destroyResource: (resource: Resource) => void) {
		this._createResource = createResource;
		this._destroyResource = destroyResource;
	}

	/** Destroys this. */
	destroy(): void {
		for (const resource of this._resources) {
			this._destroyResource(resource);
		}
	}

	/** Creates a resource. */
	createResource(): Resource {
		const resource = this._createResource();
		this._resources.add(resource);
		return resource;
	}

	/** Destroys the resource. */
	destroyResource(resource: Resource): void {
		if (this._resources.has(resource)) {
			this._destroyResource(resource);
			this._resources.remove(resource);
		}
	}

	/** Returns an iterator. */
	[Symbol.iterator](): Ordered.Iterator<Resource> {
		return this._resources[Symbol.iterator]();
	}

	/** The create resource function. */
	private _createResource: () => Resource;

	/** The destroy resource function. */
	private _destroyResource: (resource: Resource) => void;

	/** The list of resources. */
	private _resources: List<Resource> = new List();
}
