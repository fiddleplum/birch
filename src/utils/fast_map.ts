import { FastIterable } from './fast_iterable';

export class FastMap<Key, Value> implements FastIterable<FastMap.Entry<Key, Value>> {
	private _entries: FastMap.Entry<Key, Value>[] = [];
	private _indexMap: Map<Key, number> = new Map();

	/** The constructor. Takes an *iterable*. */
	constructor(iterable?: Iterable<[Key, Value]>) {
		if (iterable !== undefined) {
			for (const entry of iterable) {
				this.set(entry[0], entry[1]);
			}
		}
	}

	/** Gets the entry at the *index*. */
	getAt(index: number): FastMap.Entry<Key, Value> {
		return this._entries[index];
	}

	/** Gets the number of entries. */
	get size(): number {
		return this._entries.length;
	}

	/** Returns true if the *key* is in the map. */
	has(key: Key): boolean {
		return this._indexMap.has(key);
	}

	/** Gets the *value* of the *key*. */
	get(key: Key): Value | undefined {
		const index = this._indexMap.get(key);
		if (index !== undefined) {
			return this._entries[index].value;
		}
		return undefined;
	}

	/** Sets the *key* to the *value*. */
	set(key: Key, value: Value): FastMap<Key, Value> {
		const index = this._indexMap.get(key);
		if (index === undefined) {
			this._entries.push(new FastMap.Entry(key, value));
			this._indexMap.set(key, this._entries.length - 1);
		}
		else {
			this._entries[index].value = value;
		}
		return this;
	}

	/** Deletes the *key*. Returns true if the *key* was in the map. */
	delete(key: Key): boolean {
		const index = this._indexMap.get(key);
		if (index === undefined) {
			return false;
		}
		this._entries.splice(index, 1);
		this._indexMap.delete(key);
		for (const entry of this._indexMap.entries()) {
			if (entry[1] > index) {
				this._indexMap.set(entry[0], entry[1] - 1);
			}
		}
		return true;
	}

	/** Deletes all entries. */
	clear(): void {
		this._entries = [];
		this._indexMap.clear();
	}
}

export namespace FastMap {
	export class Entry<Key, Value> {
		key: Key;
		value: Value;
		constructor(key: Key, value: Value) {
			this.key = key;
			this.value = value;
		}
	}
}
