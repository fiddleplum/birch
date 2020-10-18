export class SortedKeyedArray<Key extends (number | string), Value> {
	/** Constructs the sorted array. */
	constructor(getKey: (value: Value) => Key) {
		this._getKey = getKey;
	}

	/** Gets the value at the index. */
	index(index: number): Value {
		return this._values[index];
	}

	/** Gets the least index that greater than or equal to the value. O(log n). */
	indexOf(key: Key): number {
		let low = 0;
		let high = this._values.length;
		while (low < high) {
			const mid = (low + high) >>> 1;
			if (this._getKey(this._values[mid]) < key) {
				low = mid + 1;
			}
			else {
				high = mid;
			}
		}
		return low;
	}

	/** Returns true if the value was found. */
	has(key: Key): boolean {
		const index = this.indexOf(key);
		if (index < this._values.length && this._getKey(this._values[index]) === key) {
			return true;
		}
		return false;
	}

	/** Adds the value into a sorted array. */
	add(value: Value): void {
		const index = this.indexOf(this._getKey(value));
		this._values.splice(index, 0, value);
	}

	/** Removes a value from a sorted array that matches the given key.
	 *  If there is more than one value, just one is chosen arbitrarily.
	 *  Returns true if the value was found. */
	removeKey(key: Key): boolean {
		const index = this.indexOf(key);
		if (index < this._values.length && this._getKey(this._values[index]) === key) {
			this._values.splice(index, 1);
			return true;
		}
		return false;
	}

	/** Removes the value from a sorted array.
	 *  Returns true if the value was found. */
	removeValue(value: Value): boolean {
		const valueKey = this._getKey(value);
		let index = this.indexOf(valueKey);
		while (index < this._values.length) {
			if (value === this._values[index]) {
				this._values.splice(index, 1);
				return true;
			}
			const key = this._getKey(this._values[index]);
			if (key !== valueKey) {
				break; // Searched all values with the value's key.
			}
			index++;
		}
		return false;
	}

	private _values: Value[] = [];

	private _getKey: (value: Value) => Key;
}
