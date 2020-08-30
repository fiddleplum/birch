import { FastIterable, FastIterableBase } from './fast_iterable';

export class FastOrderedSetReadonly<Value> extends FastIterableBase<Value> {
	/** Gets the number of values. */
	size(): number {
		return this._valuesToNodes.size;
	}

	/** Returns true if the *value* is in the set. (1). */
	has(value: Value): boolean {
		return this._valuesToNodes.has(value);
	}

	/** Creates a new iterator. */
	protected _createNewIterator(): FastOrderedSetReadonly.Iterator<Value> {
		return new FastOrderedSetReadonly.Iterator(this._getHead.bind(this));
	}

	/** Gets the head. */
	private _getHead(): FastOrderedSetReadonly.Node<Value> | undefined {
		return this._head;
	}

	/** The head node. */
	protected _head: FastOrderedSetReadonly.Node<Value> | undefined = undefined;

	/** A mapping from values to nodes for easier access. */
	protected _valuesToNodes = new Map<Value, FastOrderedSetReadonly.Node<Value>>();
}

export namespace FastOrderedSetReadonly {
	export class Iterator<Value> extends FastIterable.Iterator<Value> {
		private _getHead: () => Node<Value> | undefined;

		private node: Node<Value> | undefined = undefined;

		/** The constructor. */
		constructor(getHead: () => Node<Value>) {
			super();
			this._getHead = getHead;
		}

		reset(): boolean {
			this.node = this._getHead();
			if (this.node !== undefined) {
				this.value = this.node.value;
				return true;
			}
			return false;
		}

		increment(): boolean {
			if (this.node !== undefined && this.node.next !== undefined) {
				this.node = this.node.next;
				this.value = this.node.value;
				return true;
			}
			return false;
		}

		finish(): void {
		}
	}

	export class Node<Value> {
		prev: Node<Value> | undefined = undefined;
		next: Node<Value> | undefined = undefined;
		value: Value;

		constructor(value: Value) {
			this.value = value;
		}
	}
}
