export class ResourceList<Item> {
	/** Constructs this. */
	constructor(createItem: () => Item, destroyItem: (item: Item) => void) {
		this._createItem = createItem;
		this._destroyItem = destroyItem;
	}

	/** Destroys this. */
	destroy(): void {
		for (let i = 0; i < this._items.length; i++) {
			this._destroyItem(this._items[i]);
		}
		this._items = [];
	}

	/** Creates an item at the *index* or at the end. */
	add(index?: number): Item {
		if (index !== undefined && (index < 0 || this._items.length < index)) {
			throw new RangeError();
		}
		const item = this._createItem();
		if (index !== undefined) {
			this._items.splice(index, 0, item);
		}
		else {
			this._items.push(item);
		}
		return item;
	}

	/** Destroys the item at the *index*. */
	remove(index: number): void {
		this._destroyItem(this.get(index));
		this._items.splice(index, 1);
	}

	/** Get the item at the *index*. */
	get(index: number): Item {
		if (index < 0 || this._items.length <= index) {
			throw new RangeError();
		}
		return this._items[index];
	}

	/** Get the number of items. */
	get length(): number {
		return this._items.length;
	}

	/** The create item function. */
	private _createItem: () => Item;

	/** The destroy item function. */
	private _destroyItem: (item: Item) => void;

	/** The list of items. */
	private _items: Item[] = [];
}

