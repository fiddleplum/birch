import { CollectionBase } from './collection_base';

/** A collection of optionally named items, with user supplied creation and destruction functions. */
export class Collection<Item> extends CollectionBase<Item> {
	/** Constructs *this*. */
	constructor(createItem: () => Item, destroyItem: (item: Item) => void) {
		super(destroyItem);
		this._createItem = createItem;
	}

	/** Creates a new item with an optional name. */
	create(name?: string): Item {
		// Create the new item.
		const newItem = this._createItem();
		// Add it to the collection.
		this.addItem(newItem, name);
		// Return it.
		return newItem;

	}

	/** The create item function. */
	private _createItem: () => Item;
}
