import { Ordered } from './ordered';

export class OrderedList<Value> extends Ordered<Value> {
	/** Returns true if the *value* is in the set. O(1). */
	has(value: Value): boolean {
		return this._valuesToNodes.has(value);
	}

	/** Adds a node with the *value* placed before the *before* node or at the end. */
	add(value: Value, before?: Value): void {
		if (this._valuesToNodes.has(value)) {
			return;
		}
		const newNode = new OrderedList.Node<Value>(value);
		if (before !== undefined) {
			const beforeNode = this._valuesToNodes.get(before);
			if (beforeNode === undefined) {
				throw new Error('The node for ' + before + ' was not found.');
			}
			if (beforeNode.prev !== undefined) { // Not the head node.
				newNode.prev = beforeNode.prev;
				beforeNode.prev.next = newNode;
			}
			else { // beforeNode is the head
				this._head = newNode;
			}
			newNode.next = beforeNode;
			beforeNode.prev = newNode;
		}
		else {
			if (this._tail !== undefined) {
				this._tail.next = newNode;
				newNode.prev = this._tail;
			}
			else {
				this._head = newNode;
			}
			this._tail = newNode;
		}
		this._valuesToNodes.set(value, newNode);
	}

	/** Removes the *value*. Returns true if the *value* was in the set. O(1). */
	remove(value: Value): boolean {
		const node = this._valuesToNodes.get(value);
		if (node === undefined) {
			return false;
		}
		if (node.prev !== undefined) {
			node.prev.next = node.next;
		}
		else {
			this._head = node.next;
		}
		if (node.next !== undefined) {
			node.next.prev = node.prev;
		}
		else {
			this._tail = node.prev;
		}
		node.prev = undefined;
		node.next = undefined;
		this._valuesToNodes.delete(value);
		return true;
	}

	/** Deletes all values. O(1) */
	clear(): void {
		this._valuesToNodes.clear();
		this._head = undefined;
		this._tail = undefined;
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

	/** Creates a new iterator. */
	protected _createNewIterator(): OrderedList.NodeIterator<Value> {
		return new OrderedList.NodeIterator(this._getHead.bind(this));
	}

	/** Gets the head. */
	private _getHead(): OrderedList.Node<Value> | undefined {
		return this._head;
	}

	/** The head node. */
	private _head: OrderedList.Node<Value> | undefined = undefined;

	/** The tail node. */
	private _tail: OrderedList.Node<Value> | undefined = undefined;

	/** A mapping from values to nodes for easier access. */
	private _valuesToNodes = new Map<Value, OrderedList.Node<Value>>();
}

export namespace OrderedList {
	export class NodeIterator<Value> extends Ordered.Iterator<Value> {
		private _getHead: () => Node<Value>;

		node: Node<Value> | undefined = undefined;

		/** The constructor. */
		constructor(getHead: () => Node<Value>) {
			super();
			this._getHead = getHead;
		}

		/** Resets the iterator to the beginning. */
		reset(): void {
			this.node = this._getHead();
			this.value = this.node?.value;
		}

		/** Increments the iterator. Returns false if it could not increment. */
		increment(): boolean {
			if (this.node !== undefined && this.node.next !== undefined) {
				this.node = this.node.next;
				this.value = this.node?.value;
				return true;
			}
			return false;
		}

		/** Close up what is necessary for the iterator. */
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
