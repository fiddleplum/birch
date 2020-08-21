import { CollectionBase } from './collection_base';
import { FastMap } from './fast_map';

/** A typed collection of optionally named items, with user supplied creation and destruction functions. */
export class CollectionTyped<Item extends object> extends CollectionBase<Item> {
	/** Constructs *this*. */
	constructor(createItem: (type: { new (...args: any[]): Item }) => Item, destroyItem: (item: Item) => void) {
		super(destroyItem);
		this._createItem = createItem;
	}

	/** Creates a new item with an optional name. */
	create<Type extends Item>(type: new (...args: any[]) => Type, name?: string): Type {
		// Create the new item.
		const newItem = this._createItem(type) as Type;
		// Add it to the collection.
		this.addItem(newItem, name);
		// Add it to the types to items mapping.
		let ancestorType = type;
		do {
			let itemsOfType = this._typesToItems.get(ancestorType);
			if (itemsOfType === undefined) {
				itemsOfType = [];
				this._typesToItems.set(ancestorType, itemsOfType);
			}
			itemsOfType.push(newItem);
			ancestorType = Object.getPrototypeOf(ancestorType);
			if (ancestorType === Function.prototype) {
				break;
			}
		} while (true);
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
		let ancestorType = item.constructor as { new (): Item };
		do {
			const itemsOfType = this._typesToItems.get(ancestorType) as Item[];
			for (let i = 0, l = itemsOfType.length; i < l; i++) {
				if (itemsOfType[i] === item) {
					itemsOfType.splice(i, 1);
					break;
				}
			}
			ancestorType = Object.getPrototypeOf(ancestorType);
			if (ancestorType === Function.prototype) {
				break;
			}
		} while (true);
		return true;
	}

	/** Gets the *index* item of the given *type*. Returns undefined if it isn't found. */
	getByType<Type extends Item>(type: { new (...args: any[]): Type }, index: number = 0): Type | undefined {
		const itemsOfType = this._typesToItems.get(type);
		if (itemsOfType === undefined) {
			return undefined;
		}
		if (index < 0 || itemsOfType.length <= index) {
			return undefined;
		}
		return itemsOfType[index] as Type;
	}

	/** Gets the number of items of a given *type*. */
	getNumItemsOfType<Type extends Item>(type: { new (...args: any[]): Type }): number {
		const itemsOfType = this._typesToItems.get(type);
		if (itemsOfType === undefined) {
			return 0;
		}
		return itemsOfType.length;
	}

	/** The create item function. */
	private _createItem: (type: { new (): Item }) => Item;

	/** The mapping from types to items. */
	private _typesToItems: FastMap<{ new (): Item }, Item[]> = new FastMap();
}
