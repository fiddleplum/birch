import { FastMap } from './fast_map';
import { FastIterable } from './fast_iterable';

/** A collection of optionally named items, with user supplied creation and destruction functions. Meant to be subclassed. */
export abstract class CollectionBase<Item> implements FastIterable<FastMap.Entry<Item, string | undefined>> {
	/** Constructs *this*. */
	constructor(destroyItem: (item: Item) => void) {
		this._destroyItem = destroyItem;
	}

	/** Adds an item with an optional name to the collection.
	 * Only used by subclasses.
	 * If it already exists, it will destroy the item and throw an error. */
	protected addItem(newItem: Item, name?: string): void {
		// If given a name, add it to the namesToItems map.
		if (name !== undefined) {
			if (this._namesToItems.has(name)) {
				this._destroyItem(newItem);
				throw new Error('There is already an item named ' + name);
			}
			this._namesToItems.set(name, newItem);
		}
		// Add it to the itemsToNames map.
		this._itemsToNames.set(newItem, name);
	}

	/** Destroys an item. Takes the item or its name. Returns true if an item was deleted. */
	destroy(nameOrItem: string | Item | undefined): boolean {
		// Destroy allows for undefined to make the API easier.
		if (nameOrItem === undefined) {
			return false;
		}
		// Get the item, if from a name.
		let item: Item;
		if (typeof nameOrItem === 'string') {
			const foundItem = this._namesToItems.get(nameOrItem);
			if (foundItem === undefined) {
				return false;
			}
			item = foundItem;
		}
		else {
			item = nameOrItem;
		}
		if (!this._itemsToNames.has(item)) {
			return false;
		}
		// Destroy the item.
		this._destroyItem(item);
		// If it has a name, delete it from the namesToItems map.
		const name = this._itemsToNames.get(item);
		if (name !== undefined) {
			this._namesToItems.delete(name);
		}
		// Delete it from the itemsToNames map.
		this._itemsToNames.remove(item);
		return true;
	}

	/** Clears all of the items. */
	clear(): void {
		for (const entry of this._itemsToNames) {
			this._destroyItem(entry.key);
		}
		this._itemsToNames.clear();
		this._namesToItems.clear();
	}

	/** Gets the item with the *name*. Returns undefined if not found. */
	get(name: string): Item | undefined {
		return this._namesToItems.get(name);
	}

	/** Gets the number of items. */
	numItems(): number {
		return this._itemsToNames.size;
	}

	/** Returns an iterator. */
	[Symbol.iterator](): FastIterable.Iterator<FastMap.Entry<Item, string | undefined>> {
		return this._itemsToNames[Symbol.iterator]();
	}

	/** The destroy item function. */
	private _destroyItem: (item: Item) => void;

	/** The mapping from items to names. The name may be undefined. */
	private _itemsToNames: FastMap<Item, string | undefined> = new FastMap();

	/** The mapping from names to items. Not every item has a name. */
	private _namesToItems: Map<string, Item> = new Map();
}
