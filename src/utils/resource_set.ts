

export class ResourceSet<Item> {
	constructor(itemConstructor: () => Item, itemDestructor: (item: Item) => void) {
		this._itemConstructor = itemConstructor;
		this._itemDestructor = itemDestructor;
	}

	addNew(): Item {
	}

	remove(item: Item): boolean {
	}

	has(item: Item): boolean {
	}

	clear(): void {
	}

	private _itemConstructor: () => Item;

	private _itemDestructor: (item: Item) => void;
  }
