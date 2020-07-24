import { List } from './list';
import { Ordered } from './ordered';

export class ResourceList<Resource> {
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

	/** Creates a resource.
	 * @param before - The resource will be created and inserted right before this resource. */
	add(before?: Resource): Resource {
		const resource = this._createResource();
		this._resources.add(resource, before);
		return resource;
	}

	/** Destroys the resource. */
	remove(resource: Resource): void {
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
