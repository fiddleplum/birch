// export class ResourceSet<Item> {
// 	/** Constructs this. */
// 	constructor(createItem: () => Item, destroyItem: (item: Item) => void) {
// 		this._createItem = createItem;
// 		this._destroyItem = destroyItem;
// 	}

// 	/** Destroys this. */
// 	destroy(): void {
// 		for (let i = 0; i < this._set.size; i++) {
// 			this._destroyItem(this._set[i]);
// 		}
// 		this._set = [];
// 	}

// 	/** Adds a new item. */
// 	add(): Item {
// 		const item = this._createItem();
// 		this._set.add(item);
// 		return item;
// 	}

// 	/** Removes an item. */
// 	remove(item: Item): boolean {
// 		const removed = this._set.delete(item);
// 		this._destroyItem(item);
// 		return removed;
// 	}

// 	/** The create item function. */
// 	private _createItem: () => Item;

// 	/** The destroy item function. */
// 	private _destroyItem: (item: Item) => void;

// 	/** The set of items. */
// 	private _set = new Set<Item>();
// }

// /*

// If no iteration is needed, use Set
// If iteration is needed, but order doesn't matter, use hash table.
// If iteration is needed, and order does matter, use doubly-linked list.
// If it needs to be always sorted, use a binary tree.

// I should optimize for iteration, since that will happen much more often than adding or deleting.

// Sets

// If array, (NIXED)
// 	addNew() is O(1) (can push to back)
// 	remove() is O(n) because the index must be found from the item,
// 		unless the item has the index within, but even then
// 		the remove shifts the indices.
// 	iteration goes through each index.

// If free-array,
// 	addNew() is O(1), just finds free index.
// 	remove() is O(1) if the index is on the item, otherwise impossible.
// 	iteration goes through each index with an isUsed check for the index.

// If doubly-linked list,
// 	addNew() is O(1), just keep the tail recorded
// 	remove() is O(1), just join prev and next
// 	iteration has to use an iterator with reset, and next

// If hash table,
// 	addNew() is O(1)
// 	remove() is O(1)
// 	iteration is through keys

// If standard set,
// 	addNew() is O(1)
// 	remove() is O(1)
// 	iteration generates garbage

// Lists

// If array, (NIXED)
// 	addNew(before) is O(n) because it must move every index up.
// 	remove() is O(n) because the index must be found from the item,
// 		unless the item has the index within, but even then
// 		the remove shifts the indices.
// 	iteration is simple getAt and size

// If free-array,
// 	Not possible, since you can't insert before another element.

// If doubly linked list,
// 	addNew(before) is O(1)
// 	remove() is O(1), just join prev and next
// 	iteration has to use an iterator with reset, and next
// 		the iterator can be inside the resource list, but must be indexed,
// 		like: for (const iter = r.begin(iterIndex); iter !== undefined; iter.next())

// Sorted list (always sorted)

// If array,
// 	insert() is O(n) (insert uses splice)
// 	remove() is O(n) (remove uses splice)
// 	iteration goes through each index.

// If free-array,
// 	insert() is O(1), just finds free index.
// 	remove() is O(1) if the index is on the item, otherwise impossible.
// 	iteration goes through each index with an isUsed check for the index.

// If doubly-linked list,
// 	insert() is O(1), just keep the tail recorded
// 	remove() is O(1), just join prev and next
// 	iteration has to use an iterator with reset, and next

// */
