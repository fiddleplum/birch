import { Ordered } from './ordered';
import { Sort } from './sort';

export class OrderedSet<Value> implements Ordered<Value | undefined> {
	/** The constructor. Takes an *iterable*. */
	constructor(iterable?: Iterable<Value>) {
		if (iterable !== undefined) {
			for (const value of iterable) {
				this.add(value);
			}
		}
	}

	/** Gets the value at the *index*. It may return undefined if there is no value at that index. O(1). */
	getAt(index: number): Value | undefined {
		return this._values[index];
	}

	/** Gets the number of values. O(1). */
	get size(): number {
		return this._values.length;
	}

	/** Returns true if the *value* is in the set. O(1). */
	has(value: Value): boolean {
		return this._valueMap.has(value);
	}

	/** Adds the *value* if it is not already in the set. O(1). */
	add(value: Value): void {
		if (!this._valueMap.has(value)) {
			if (this._freeIndices.length > 0) {
				const index = this._freeIndices.pop() as number;
				this._values[index] = value;
				this._valueMap.set(value, index);
			}
			else {
				this._values.push(value);
				this._valueMap.set(value, this._values.length - 1);
			}
		}
	}

	/** Removes the *value*. Returns true if the *value* was in the set. O(1), except rarely O(n). */
	remove(value: Value): boolean {
		if (!this._valueMap.has(value)) {
			return false;
		}
		const index = this._valueMap.get(value) as number;
		this._valueMap.delete(value);
		this._values[index] = undefined;
		this._freeIndices.push(index);
		// If more than half of the values are empty, remove all of the holes.
		if (this._freeIndices.length > this._values.length / 2) {
			let shifting = 0;
			for (let i = 0, l = this._values.length; i < l; i++) {
				if (this._values[i] === undefined) {
					shifting += 1;
				}
				else {
					this._values[i - shifting] = this._values[i];
				}
			}
			this._values.length -= this._freeIndices.length;
			this._freeIndices.length = 0;
		}
		return true;
	}

	/** Deletes all values. O(n) */
	clear(): void {
		this._values.length = 0;
		this._valueMap.clear();
		this._freeIndices.length = 0;
	}

	/** Sorts the values for iteration. O(sorting algorithm). */
	sort(sort: Sort.sortFunction<Value | undefined>, compare: Sort.compareFunction<Value>): void {
		sort(this._values, (a: Value | undefined, b: Value | undefined): number => {
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
			const a = this._values[i];
			const b = this._values[j];
			this._values[i] = b;
			this._values[j] = a;
			if (b !== undefined) {
				this._valueMap.set(b, i);
			}
			if (a !== undefined) {
				this._valueMap.set(a, j);
			}
		});
		// Since all of the undefined elemens are at the end of the array, we can clear the freeIndices array.
		this._values.length -= this._freeIndices.length;
		this._freeIndices.length = 0;
	}

	/** The values as an array, for iterating. */
	private _values: (Value | undefined)[] = [];

	/** The values as a map, for refering to by value. */
	private _valueMap: Map<Value, number> = new Map();

	/** The list of free indices in the values array. */
	private _freeIndices: number[] = [];
}
