import { Ordered } from './ordered';
import { List } from './list';

export class OrderedMap<Key, Value> implements Ordered<OrderedMap.Entry<Key, Value>> {
	/** The constructor. Takes an *iterable*. */
	constructor(iterable?: Iterable<[Key, Value]>) {
		if (iterable !== undefined) {
			for (const entry of iterable) {
				this.set(entry[0], entry[1]);
			}
		}
	}

	/** Gets the number of entries in the map. */
	get size(): number {
		return this._keyMap.size;
	}

	/** Returns true if the *key* is in the map. O(1). */
	has(key: Key): boolean {
		return this._keyMap.has(key);
	}

	/** Gets the *value* of the *key*. O(1). */
	get(key: Key): Value | undefined {
		const entry = this._keyMap.get(key);
		if (entry !== undefined) {
			return entry.value;
		}
		else {
			return undefined;
		}
	}

	/** Sets the *key* to the *value*. O(1). */
	set(key: Key, value: Value): void {
		const entry = this._keyMap.get(key);
		if (entry === undefined) {
			const newEntry = new OrderedMap.Entry(key, value);
			this._keyMap.set(key, newEntry);
			this._keyList.add(newEntry);
		}
		else {
			entry.value = value;
		}
	}

	/** Removes the *key*. Returns true if the *key* was in the map. O(1). */
	remove(key: Key): boolean {
		if (!this._keyMap.has(key)) {
			return false;
		}
		const entry = this._keyMap.get(key) as OrderedMap.Entry<Key, Value>;
		this._keyMap.delete(key);
		this._keyList.remove(entry);
		return true;
	}

	/** Deletes all values. O(n) */
	clear(): void {
		this._keyMap.clear();
		this._keyList.clear();
	}

	/** Returns an iterator. */
	[Symbol.iterator](): Ordered.Iterator<OrderedMap.Entry<Key, Value>> {
		return this._keyList[Symbol.iterator]();
	}

	/** The key as a map, for refering to by key. */
	private _keyMap: Map<Key, OrderedMap.Entry<Key, Value>> = new Map();

	/** The ordered list of items. */
	private _keyList: List<OrderedMap.Entry<Key, Value>> = new List();
}

export namespace OrderedMap {
	/** An entry in the ordered map. */
	export class Entry<Key, Value> {
		key: Key;
		value: Value;
		constructor(key: Key, value: Value) {
			this.key = key;
			this.value = value;
		}
	}
}
