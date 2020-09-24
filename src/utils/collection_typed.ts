import { CollectionBase } from './collection_base';
import { FastMap } from './fast_map';
import { FastOrderedSet } from './fast_ordered_set';
import { FastOrderedSetReadonly } from './fast_ordered_set_readonly';

/** A typed collection of optionally named items, with user supplied creation and destruction functions. */
export class CollectionTyped<Item extends { [key: string]: any }> extends CollectionBase<Item> {
	/** Constructs *this*. */
	constructor(createItem: (type: { new (...args: any[]): Item }, name: string | undefined) => Item, destroyItem: (item: Item) => void, postCreateItem?: (item: Item) => void) {
		super(destroyItem);
		this._createItem = createItem;
		this._postCreateItem = postCreateItem;
	}

	/** Creates a new item with an optional name. */
	create<Type extends Item>(type: new (...args: any[]) => Type, name?: string): Type {
		// Create the new item.
		const newItem = this._createItem(type, name) as Type;
		// Add it to the collection.
		this.addItem(newItem, name);
		// Add it to the types to items mapping.
		let ancestorType = type;
		do {
			let itemsOfType = this._typesToItems.get(ancestorType);
			if (itemsOfType === undefined) {
				itemsOfType = new FastOrderedSet();
				this._typesToItems.set(ancestorType, itemsOfType);
			}
			itemsOfType.add(newItem);
			ancestorType = Object.getPrototypeOf(ancestorType);
			if (ancestorType === Function.prototype) {
				break;
			}
		} while (true);
		// Call the post-create function.
		if (this._postCreateItem) {
			this._postCreateItem(newItem);
		}
		// Return it.
		return newItem;
	}

	/** Destroys an item. Takes the item or its name. */
	destroy(nameOrItem: string | Item | undefined): boolean {
		const hasItem = super.destroy(nameOrItem);
		if (!hasItem) {
			return false;
		}
		// Get the item, if from a name.
		let item: Item;
		if (typeof nameOrItem === 'string') {
			item = this.get(nameOrItem) as Item;
		}
		else {
			item = nameOrItem as Item;
		}
		let ancestorType = item.constructor as { new (...args: any[]): Item };
		do {
			const itemsOfType = this._typesToItems.get(ancestorType) as FastOrderedSet<Item>;
			itemsOfType.remove(item);
			ancestorType = Object.getPrototypeOf(ancestorType);
			if (ancestorType === Function.prototype) {
				break;
			}
		} while (true);
		return true;
	}

	/** Gets the first item of the given *type*. */
	getFirstOfType<Type extends Item>(type: { new (...args: any[]): Type }): Type | undefined {
		return this._typesToItems.get(type)?.getIndex(0) as (Type | undefined);
	}

	/** Gets the items of the given *type*. Returns undefined if there are none. */
	getAllOfType<Type extends Item>(type: { new (...args: any[]): Type }): FastOrderedSetReadonly<Type> | undefined {
		return this._typesToItems.get(type) as (FastOrderedSet<Type> | undefined);
	}

	/** The create item function. */
	private _createItem: (type: { new (...args: any[]): Item }, name: string | undefined) => Item;

	/** The function called after an item has been created and added to the collection. */
	private _postCreateItem: ((item: Item) => void) | undefined;

	/** The mapping from types to items. */
	private _typesToItems: FastMap<{ new (...args: any[]): Item }, FastOrderedSet<Item>> = new FastMap();
}
