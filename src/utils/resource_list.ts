import { OrderedList } from './ordered_list';

export class ResourceList<Item> {
	constructor(createItem: () => Item, destroyItem: (item: Item) => void) {
		this._createItem = createItem;
		this._destroyItem = destroyItem;
	}

	/** Adds a new item. */
	addNew(before?: Item): Item {
		const item = this._createItem();
		this._list.add(item);
		return item;
	}

	/** Removes an item. */
	remove(item: Item): boolean {
		const removed = this._list.remove(item);
		this._destroyItem(item);
		return removed;
	}

	/** The create item function. */
	private _createItem: () => Item;

	/** The destroy item function. */
	private _destroyItem: (item: Item) => void;

	/** The list of items. */
	private _list = new OrderedList<Item>();
}


/*

If array,
	addNew(before) is O(n) because it must move every index up.
	addNew() is O(1)
	remove() is O(n) because the index must be found from the item,
		unless the item has the index within
	iteration is simple getAt and size

If doubly linked list,
	addNew(before) is O(1)
	addNew() is O(1), just keep the tail recorded
	remove() is O(1), just join prev and next
	iteration has to use an iterator with reset, and next
		the iterator can be inside the resource list, but must be indexed,
		like: for (const iter = r.begin(iterIndex); iter !== undefined; iter.next())
*/