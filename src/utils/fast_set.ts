import { FastIterable } from './fast_iterable';

export class FastSet<Value> implements FastIterable<Value> {
	private _values: Value[] = [];
	private _indexMap: Map<Value, number> = new Map();

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
		return this._indexMap.has(value);
	}

	/** Adds the *value* if it is not already in the set. */
	add(value: Value): FastSet<Value> {
		const index = this._indexMap.get(value);
		if (index === undefined) {
			this._values.push(value);
			this._indexMap.set(value, this._values.length - 1);
		}
		return this;
	}

	/** Deletes the *value*. Returns true if the *value* was in the set. */
	delete(value: Value): boolean {
		const index = this._indexMap.get(value);
		if (index === undefined) {
			return false;
		}
		this._values.splice(index, 1);
		this._indexMap.delete(value);
		for (const entry of this._indexMap.entries()) {
			if (entry[1] > index) {
				this._indexMap.set(entry[0], entry[1] - 1);
			}
		}
		return true;
	}

	/** Deletes all values. */
	clear(): void {
		this._values = [];
		this._indexMap.clear();
	}
}
