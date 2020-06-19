import { FastIterable } from './fast_iterable';
import { OrderedMap } from './ordered_map';
import { Sort } from './sort';

export class Cache<Key, Value> implements FastIterable<Value | undefined> {
	/** The constructor. */
	constructor(valueConstructor: (key: Key) => Value, valueDestructor: (value: Value) => void) {
		// Set the value constructor and destructor.
		this._valueConstructor = valueConstructor;
		this._valueDestructor = valueDestructor;
	}

	/** Gets the value named by the *key*. If not found, it creates a new value. */
	get(key: Key): Value {
		const entry = this._keysToCountedValues.get(key);
		if (entry === undefined) {
			const value = this._valueConstructor(key);
			this._keysToCountedValues.set(key, new CountedValue(value));
			this._valuesToKeys.set(value, key);
			return value;
		}
		else {
			entry.count += 1;
			return entry.value;
		}
	}

	/** Releases the *value*. */
	release(value: Value): void {
		const key = this._valuesToKeys.get(value);
		if (key !== undefined) {
			const countedValue = this._keysToCountedValues.get(key) as CountedValue<Value>;
			countedValue.count -= 1;
			if (countedValue.count === 0) {
				this._valueDestructor(countedValue.value);
				this._keysToCountedValues.delete(key);
				this._valuesToKeys.delete(value);
			}
		}
	}

	/** Clears all values. */
	clear(): void {
		for (let i = 0, l = this._keysToCountedValues.size; i < l; i++) {
			const entry = this._keysToCountedValues.getAt(i);
			if (entry !== undefined) {
				if (entry.value.count !== 0) {
					throw new Error('Cache being removed while values still in use: ' + entry.key);
				}
				this._valueDestructor(entry.value.value);
			}
		}
		this._keysToCountedValues.clear();
		this._valuesToKeys.clear();
	}

	/** Gets the value at the *index*. */
	getAt(index: number): Value | undefined {
		const entry = this._keysToCountedValues.getAt(index);
		if (entry !== undefined) {
			return entry.value.value;
		}
		return undefined;
	}

	/** Gets the number of values. */
	get size(): number {
		return this._keysToCountedValues.size;
	}

	/** Sorts the values for iteration. */
	sort(sort: Sort.sortFunction<OrderedMap.Entry<Key, CountedValue<Value>> | undefined>, compare: Sort.compareFunction<OrderedMap.Entry<Key, CountedValue<Value>>>): void {
		this._keysToCountedValues.sort(sort, compare);
	}

	/** The keys to values map, with counts. */
	private _keysToCountedValues = new OrderedMap<Key, CountedValue<Value>>();

	/** The values to keys map. */
	private _valuesToKeys = new Map<Value, Key>();

	/** The function that creates new values. */
	private _valueConstructor: (key: Key) => Value;

	/** The function that destroys values. */
	private _valueDestructor: (value: Value) => void;
}

/** A class that contains a generic value and its count. */
class CountedValue<Value> {
	value: Value;
	count = 1;
	constructor(value: Value) {
		this.value = value;
	}
}

