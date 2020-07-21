import { Ordered, OrderedBase } from './ordered';

// Find algorithm from https://stackoverflow.com/a/21822316.

/** A sorted list of items. */
export class SortedList<Item> extends OrderedBase<Item> {
	/** Constructor. */
	constructor(isLess: (a: Item, b: Item) => boolean) {
		super();
		this._isLess = isLess;
	}

	/** Adds an item to the sorted list. O(log n) */
	add(item: Item): void {
		const index = this._find(item);
		this._a.splice(index, 0, item);
	}

	/** Removes an item from the sorted list. Returns true if the item was found and removed. O(log n) */
	remove(item: Item): boolean {
		const index = this._find(item);
		if (this._a[index] !== item) {
			return false;
		}
		this._a.splice(index, 1);
		return true;
	}

	/** Creates a new iterator. */
	protected _createNewIterator(): Ordered.Iterator<Item> {
		return new SortedList.Iterator(this._a);
	}

	/** Finds an item in the sorted array. O(log n) */
	private _find(item: Item): number {
		let low = 0;
		let high = this._a.length;
		while (low < high) {
			const mid = (low + high) >>> 1;
			if (this._isLess(this._a[mid], item)) {
				low = mid + 1;
			}
			else {
				high = mid;
			}
		}
		return low;
	}

	/** The array where all the items are stored. */
	private _a: Item[] = [];

	/** A user-provided comparing function. */
	private _isLess: (a: Item, b: Item) => boolean;
}

export namespace SortedList {
	export class Iterator<Item> extends Ordered.Iterator<Item> {
		/** The constructor. */
		constructor(a: Item[]) {
			super();
			this._a = a;
		}

		reset(): boolean {
			this._index = 0;
			if (this._index < this._a.length) {
				this.value = this._a[this._index];
				return true;
			}
			return false;
		}

		increment(): boolean {
			this._index += 1;
			if (this._index < this._a.length) {
				this.value = this._a[this._index];
				return true;
			}
			return false;
		}

		finish(): void {
		}

		private _a: Item[];

		private _index: number = 0;

	}
}
