import { FastMapReadonly } from './fast_map_readonly';

export class FastMap<Key, Value> extends FastMapReadonly<Key, Value> {
	/** The constructor. Takes an *iterable*. */
	constructor(iterable?: Iterable<[Key, Value]>) {
		super();

		if (iterable !== undefined) {
			for (const entry of iterable) {
				this.set(entry[0], entry[1]);
			}
		}
	}

	/** Sets the *key* to the *value*. O(1). */
	set(key: Key, value: Value): void {
		const entry = this._keyMap.get(key);
		if (entry === undefined) {
			const newEntry = new FastMap.Entry(key, value);
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
		const entry = this._keyMap.get(key) as FastMap.Entry<Key, Value>;
		this._keyMap.delete(key);
		this._keyList.remove(entry);
		return true;
	}

	/** Deletes all values. O(n) */
	clear(): void {
		this._keyMap.clear();
		this._keyList.clear();
	}
}

export namespace FastMap {
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
