import { FastIterable } from './fast_iterable';
import { Sort } from './sort';

export class OrderedMap<Key, Value> implements FastIterable<OrderedMap.Entry<Key, Value> | undefined> {
	/** The constructor. Takes an *iterable*. */
	constructor(iterable?: Iterable<[Key, Value]>) {
		if (iterable !== undefined) {
			for (const entry of iterable) {
				this.set(entry[0], entry[1]);
			}
		}
	}

	/** Gets the entry at the *index*. O(1). */
	getAt(index: number): OrderedMap.Entry<Key, Value> | undefined {
		return this._entries[index];
	}

	/** Gets the number of entries. O(1). */
	get size(): number {
		return this._entries.length;
	}

	/** Returns true if the *key* is in the map. O(1). */
	has(key: Key): boolean {
		return this._keyMap.has(key);
	}

	/** Gets the *value* of the *key*. O(1). */
	get(key: Key): Value | undefined {
		const index = this._keyMap.get(key);
		if (index !== undefined) {
			return (this._entries[index] as OrderedMap.Entry<Key, Value>).value;
		}
		return undefined;
	}

	/** Sets the *key* to the *value*. O(1). */
	set(key: Key, value: Value): void {
		if (!this._keyMap.has(key)) {
			if (this._freeIndices.length > 0) {
				const index = this._freeIndices.pop() as number;
				this._entries[index] = new OrderedMap.Entry(key, value);
				this._keyMap.set(key, index);
			}
			else {
				this._entries.push(new OrderedMap.Entry(key, value));
				this._keyMap.set(key, this._entries.length - 1);
			}
		}
	}

	/** Deletes the *key*. Returns true if the *key* was in the map. O(1), except rarely O(n). */
	delete(key: Key): boolean {
		if (!this._keyMap.has(key)) {
			return false;
		}
		const index = this._keyMap.get(key) as number;
		this._keyMap.delete(key);
		this._entries[index] = undefined;
		this._freeIndices.push(index);
		// If more than half of the values are empty, remove all of the holes.
		if (this._freeIndices.length > this._entries.length / 2) {
			let shifting = 0;
			for (let i = 0, l = this._entries.length; i < l; i++) {
				if (this._entries[i] === undefined) {
					shifting += 1;
				}
				else {
					this._entries[i - shifting] = this._entries[i];
				}
			}
			this._entries.length -= this._freeIndices.length;
			this._freeIndices.length = 0;
		}
		return true;
	}

	/** Deletes all values. O(n) */
	clear(): void {
		this._entries.length = 0;
		this._keyMap.clear();
		this._freeIndices.length = 0;
	}

	/** Sorts the values for iteration. O(sorting algorithm). */
	sort(sort: Sort.sortFunction<OrderedMap.Entry<Key, Value> | undefined>, compare: Sort.compareFunction<OrderedMap.Entry<Key, Value>>): void {
		sort(this._entries, (a: OrderedMap.Entry<Key, Value> | undefined, b: OrderedMap.Entry<Key, Value> | undefined): number => {
			// Compare, but make all undefined elements greater than defined elements.
			if (a === undefined) {
				if (b === undefined) {
					return 0;
				}
				return 1;
			}
			if (b === undefined) {
				return -1;
			}
			return compare(a, b);
		}, (i: number, j: number) => {
			const a = this._entries[i];
			const b = this._entries[j];
			this._entries[i] = b;
			this._entries[j] = a;
			if (b !== undefined) {
				this._keyMap.set(b.key, i);
			}
			if (a !== undefined) {
				this._keyMap.set(a.key, j);
			}
		});
		// Since all of the undefined elemens are at the end of the array, we can clear the freeIndices array.
		this._entries.length -= this._freeIndices.length;
		this._freeIndices.length = 0;
	}

	/** The entries as an array, for iterating. */
	private _entries: (OrderedMap.Entry<Key, Value> | undefined)[] = [];

	/** The key as a map, for refering to by key. */
	private _keyMap: Map<Key, number> = new Map();

	/** The list of free indices in the entries array. */
	private _freeIndices: number[] = [];
}

export namespace OrderedMap {
	export class Entry<Key, Value> {
		key: Key;
		value: Value;
		constructor(key: Key, value: Value) {
			this.key = key;
			this.value = value;
		}
	}
}
