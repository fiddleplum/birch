export class ItemList<Item> {
	/** Constructs *this*. */
	constructor(createItem: () => Item, destroyItem: (item: Item) => void) {
		this._createItem = createItem;
		this._destroyItem = destroyItem;
	}

	/** Destroys *this*. */
	destroy(): void {
		for (let i = 0, l = this._items.length; i < l; i++) {
			this._destroyItem(this._items[i]);
		}
	}

	/** Creates a new item.
	 * @param beforeIndex - The item will be created and inserted right before this index. */
	add(beforeIndex?: number): Item {
		if (beforeIndex === undefined) {
			beforeIndex = this._items.length;
		}
		if (beforeIndex < 0 || this._items.length < beforeIndex) {
			throw new Error('The beforeIndex is out of bounds.');
		}
		const item = this._createItem();
		this._items.splice(beforeIndex, 0, item);
		return item;
	}

	/** Destroys the item at *index*. */
	remove(index: number): void {
		if (index < 0 || this._items.length <= index) {
			throw new Error('The index is out of bounds.');
		}
		this._destroyItem(this._items[index]);
		this._items.splice(index, 1);
	}

	/** Gets the index of *item*. It searches the whole list. It returns undefined if the number is not found. */
	findIndex(item: Item): number | undefined {
		for (let i = 0, l = this._items.length; i < l; i++) {
			if (this._items[i] === item) {
				return i;
			}
		}
		return undefined;
	}

	/** Gets the item at *index*. */
	get(index: number): Item {
		return this._items[index];
	}

	/** Gets the number of items. */
	size(): number {
		return this._items.length;
	}

	/** The create item function. */
	private _createItem: () => Item;

	/** The destroy item function. */
	private _destroyItem: (item: Item) => void;

	/** The list of items. */
	private _items: Item[] = [];
}
