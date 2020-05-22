import { FastIterable } from './fast_iterable';
import { FastMap } from './fast_map';

class CountedValue<Value> {
	value: Value;
	count = 1;
	constructor(value: Value) {
		this.value = value;
	}
}

export class Cache<Key, Value> implements FastIterable<Value> {
	private _keysToCountedValues = new FastMap<Key, CountedValue<Value>>();
	private _valuesToKeys = new Map<Value, Key>();
	private _itemConstructor: (key: Key) => Value;
	private _itemDestructor: (item: Value) => void;

	/** The constructor. */
	constructor(itemConstructor: (key: Key) => Value, itemDestructor: (item: Value) => void) {
		this._itemConstructor = itemConstructor;
		this._itemDestructor = itemDestructor;
	}

	getAt(index: number): Value {
		return this._keysToCountedValues.getAt(index).value.value;
	}

	get size(): number {
		return this._keysToCountedValues.size;
	}

	get(key: Key): Value {
		const entry = this._keysToCountedValues.get(key);
		if (entry === undefined) {
			const value = this._itemConstructor(key);
			this._keysToCountedValues.set(key, new CountedValue(value));
			this._valuesToKeys.set(value, key);
			return value;
		}
		else {
			entry.count += 1;
			return entry.value;
		}
	}

	release(value: Value): void {
		const key = this._valuesToKeys.get(value);
		if (key !== undefined) {
			const countedValue = this._keysToCountedValues.get(key) as CountedValue<Value>;
			countedValue.count -= 1;
			if (countedValue.count === 0) {
				this._itemDestructor(countedValue.value);
				this._keysToCountedValues.delete(key);
				this._valuesToKeys.delete(value);
			}
		}
	}

	clear(): void {
		for (let i = 0, l = this._keysToCountedValues.size; i < l; i++) {
			const entry = this._keysToCountedValues.getAt(i);
			if (entry.value.count !== 0) {
				throw new Error('Cache being removed while values still in use: ' + entry.key);
			}
			this._itemDestructor(entry.value.value);
		}
		this._keysToCountedValues.clear();
		this._valuesToKeys.clear();
	}
}
