import { FastMap } from './fast_map';
import { FastIterable } from './fast_iterable';

/** A collection of optionally named items, with user supplied creation and destruction functions. */
export class Collection<Item> implements FastIterable<FastMap.Entry<Item, string | undefined>> {
	/** Constructs *this*. */
	constructor(createItem: () => Item, destroyItem: (item: Item) => void) {
		this._createItem = createItem;
		this._destroyItem = destroyItem;
	}

	/** Creates a new item with an optional name. */
	create(name?: string): Item {
		// Create the new item.
		const newItem = this._createItem();
		// If given a name, add it to the namesToItems map.
		if (name !== undefined) {
			if (this._namesToItems.has(name)) {
				throw new Error('There is already an item named ' + name);
			}
			this._namesToItems.set(name, newItem);
		}
		// Add it to the itemsToNames map.
		this._itemsToNames.set(newItem, name);
		return newItem;
	}

	/** Destroys an item. Takes the item or its name. */
	destroy(nameOrItem: string | Item | undefined): void {
		// Destroy allows for undefined to make the API easier.
		if (nameOrItem === undefined) {
			return;
		}
		let item: Item;
		// Get the item, if from a name.
		if (typeof nameOrItem === 'string') {
			const foundItem = this._namesToItems.get(nameOrItem);
			if (foundItem === undefined) {
				throw new Error('There is no item named ' + nameOrItem);
			}
			item = foundItem;
		}
		else {
			item = nameOrItem;
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
	size(): number {
		return this._itemsToNames.size;
	}

	/** Returns an iterator. */
	[Symbol.iterator](): FastIterable.Iterator<FastMap.Entry<Item, string | undefined>> {
		return this._itemsToNames[Symbol.iterator]();
	}

	/** The create item function. */
	private _createItem: () => Item;

	/** The destroy item function. */
	private _destroyItem: (item: Item) => void;

	/** The mapping from items to names. The name may be undefined. */
	private _itemsToNames: FastMap<Item, string | undefined> = new FastMap();

	/** The mapping from names to items. Not every item has a name. */
	private _namesToItems: Map<string, Item> = new Map();
}
