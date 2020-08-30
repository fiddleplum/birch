import { FastIterable } from './fast_iterable';
import { FastOrderedSet } from './fast_ordered_set';

export class FastMapReadonly<Key, Value> implements FastIterable<FastMapReadonly.Entry<Key, Value>> {
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

	/** Returns an iterator. */
	[Symbol.iterator](): FastIterable.Iterator<FastMapReadonly.Entry<Key, Value>> {
		return this._keyList[Symbol.iterator]();
	}

	/** The key as a map, for referring to by key. */
	protected _keyMap: Map<Key, FastMapReadonly.Entry<Key, Value>> = new Map();

	/** The ordered list of items. */
	protected _keyList: FastOrderedSet<FastMapReadonly.Entry<Key, Value>> = new FastOrderedSet();
}

export namespace FastMapReadonly {
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
