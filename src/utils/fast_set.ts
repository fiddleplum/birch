import { FastIterable } from './fast_iterable';
import { Sort } from './sort';

export class FastSet<Value> implements FastIterable<Value> {
	private _values: Value[] = [];
	private _set: Set<Value> = new Set();

	/** The constructor. Takes an *iterable*. */
	constructor(iterable?: Iterable<Value>) {
		if (iterable !== undefined) {
			for (const value of iterable) {
				this.add(value);
			}
		}
	}

	/** Gets the value at the *index*. */
	getAt(index: number): Value {
		return this._values[index];
	}

	/** Gets the number of values. */
	get size(): number {
		return this._values.length;
	}

	/** Returns true if the *value* is in the set. */
	has(value: Value): boolean {
		return this._set.has(value);
	}

	/** Adds the *value* if it is not already in the set. */
	add(value: Value): FastSet<Value> {
		if (!this._set.has(value)) {
			this._values.push(value);
			this._set.add(value);
		}
		return this;
	}

	/** Deletes the *value*. Returns true if the *value* was in the set. */
	delete(value: Value): boolean {
		if (!this._set.has(value)) {
			return false;
		}
		this._set.delete(value);
		for (let i = 0; i < this._values.length; i++) {
			if (this._values[i] === value) {
				this._values.splice(i, 1);
				break;
			}
		}
		return true;
	}

	/** Deletes all values. */
	clear(): void {
		this._values = [];
		this._set.clear();
	}

	/** Sorts the values for iteration. */
	sort(sort: Sort.sortFunction<Value>, compare: Sort.compareFunction<Value>): void {
		sort(this._values, compare);
	}
}
