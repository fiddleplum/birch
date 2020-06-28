import { Ordered } from './ordered';
import { OrderedSet } from './ordered_set';

export class OrderedMap<Key, Value> implements Ordered<OrderedMap.Entry<Key, Value>> {
	/** The constructor. Takes an *iterable*. */
	constructor(iterable?: Iterable<[Key, Value]>) {
		if (iterable !== undefined) {
			for (const entry of iterable) {
				this.set(entry[0], entry[1]);
			}
		}
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
	private _keyList: OrderedSet<OrderedMap.Entry<Key, Value>> = new OrderedSet();
}

export namespace OrderedMap {
	// export class MapIterator<Key, Value> extends Ordered.Iterator<Entry<Key, Value>> {
	// 	private _keyMap: Map<Key, Value>;
	// 	private _keyList: OrderedSet<Key>;

	// 	private _entry: Entry<Key, Value> = new Entry<Key, Value>(undefined, undefined);

	// 	private _iterator: Ordered.Iterator<Key>;

	// 	/** The constructor. */
	// 	constructor(keyMap: Map<Key, Value>, keyList: OrderedSet<Key>) {
	// 		super();
	// 		this._keyMap = keyMap;
	// 		this._keyList = keyList;
	// 		this._iterator = keyList[Symbol.iterator]();
	// 	}

	// 	/** Resets the iterator to the beginning. */
	// 	reset(): void {
	// 		this._iterator.reset();
	// 		this._entry.key = this._iterator.value;
	// 		this._entry.value = this._keyMap.get(this._entry.key);
	// 		this.node = this._getHead();
	// 		this.value = this.node?.value;
	// 	}

	// 	/** Increments the iterator. Returns false if it could not increment. */
	// 	increment(): boolean {
	// 		this.value
	// 		if (this.node !== undefined && this.node.next !== undefined) {
	// 			this.node = this.node.next;
	// 			this.value = this.node?.value;
	// 			return true;
	// 		}
	// 		return false;
	// 	}

	// 	/** Close up what is necessary for the iterator. */
	// 	finish(): void {
	// 	}
	// }

	export class Entry<Key, Value> {
		key: Key;
		value: Value;
		constructor(key: Key, value: Value) {
			this.key = key;
			this.value = value;
		}
	}
}
