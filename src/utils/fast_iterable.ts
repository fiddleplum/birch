/** An interface for creating iterables that don't generate garbage. */
export interface FastIterable<Value> {
	/** Returns an iterator. */
	[Symbol.iterator](): FastIterable.Iterator<Value>;
}

/** A base class ordered containers that have iterators that get reused. */
export abstract class FastIterableBase<Value> implements FastIterable<Value> {
	/** Returns an iterator. */
	get iterator(): FastIterable.Iterator<Value> {
		return this[Symbol.iterator]();
	}

	/** Returns an iterator. */
	[Symbol.iterator](): FastIterable.Iterator<Value> {
		let iterator: FastIterable.Iterator<Value> | undefined = undefined;
		// Find an existing iterator that isn't iterating and return it.
		for (let i = 0, l = this._iterators.length; i < l; i++) {
			if (!this._iterators[i].iterating) {
				iterator = this._iterators[i];
			}
		}
		// Didn't find an existing non-iterating iterator, so create a new one.
		if (iterator === undefined) {
			iterator = this._createNewIterator();
			this._iterators.push(iterator);
		}
		// Reset the iterator to the beginning for looping.
		iterator.iterating = true;
		iterator.done = true;
		return iterator;
	}

	/** Creates a new iterator. */
	protected abstract _createNewIterator(): FastIterable.Iterator<Value>;

	/** The list of created iterators. */
	private _iterators: FastIterable.Iterator<Value>[] = [];
}

export namespace FastIterable {
	/** The ordered iterator. */
	export abstract class Iterator<Value> {
		/** If true, the iterator is currently going through a loop. */
		iterating: boolean = false;

		/** If true, the iterator has reached the end of the loop. */
		done: boolean = true;

		/** The value of the iterator. Force it to have Value type, since it will always have a value during iterations. */
		value: Value = undefined as unknown as Value;

		/** Increments the iterator. */
		next(): Iterator<Value> {
			if (this.done) {
				this.iterating = true;
				this.done = false;
				const hasFirstElement = this.reset();
				if (!hasFirstElement) {
					this.iterating = false;
					this.done = true;
				}
			}
			else {
				this.done = !this.increment();
				if (this.done) {
					this.iterating = false;
					this.value = undefined as unknown as Value;
					this.finish();
				}
			}
			return this;
		}

		/** Close up what's necessary for the iterator. */
		return(): Iterator<Value> {
			this.iterating = false;
			this.done = true;
			this.value = undefined as unknown as Value;
			this.finish();
			return this;
		}

		/** Resets the iterator to the beginning, setting the new value. Returns true if there was a beginning element. */
		abstract reset(): boolean;

		/** Increments the iterator, setting the new value. Returns false if it could not increment. */
		abstract increment(): boolean;

		/** Close up what is necessary for the iterator. */
		abstract finish(): void;
	}
}
