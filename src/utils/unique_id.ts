/** A class for getting unique IDs. */
export class UniqueId {
	/** Gets an ID from the list of free IDs. */
	static get(): number {
		const id = this._freeIds.length > 0 ? this._freeIds.pop() : this._numUsedIds;
		this._numUsedIds += 1;
		return id as number;
	}

	/** Releases the ID to the list of free IDs. */
	static release(id: number): void {
		this._freeIds.push(id);
		this._numUsedIds -= 1;
	}

	/** Get a unique id string. Source from https://stackoverflow.com/a/2117523/510380. */
	static getIdString(): string {
		return '10000000-1000-4000-80000000-100000000000'.replace(/[018]/g, (c: any) => {
			return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
		});
	}

	/** The list of free ids that are gaps in the list. */
	private static _freeIds: number[] = [];

	/** The total number of used ids. */
	private static _numUsedIds: number = 0;
}

export namespace UniqueId {
	/** An object meant to be extended to provide a unique ID for the lifetime of the object. */
	export class Object {
		/** Construct the object. */
		constructor() {
			// Get a unique id for the shader.
			this._id = UniqueId.get();
		}

		/** Destroy the object. */
		destroy(): void {
			UniqueId.release(this._id);
		}

		/** Gets the unique id. */
		get id(): number {
			return this._id;
		}

		// The unique id.
		private _id: number;
	}
}
