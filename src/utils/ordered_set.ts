import { Ordered, OrderedBase } from './ordered';

// I've completed this class.
// I need to replace OrderedSet with this, and rename this to OrderedSet (or OrderedSet).
// I need to figure out what to do with OrderedMap, to see if I can make it either use this
// 	or Ordered itself.
// I need to implement ResourceList to use this but with given constructors/destructors.
// I need to possibly remove or repurpose Cache.

export class OrderedSet<Value> extends OrderedBase<Value> {
	/** The constructor. Takes an *iterable*. */
	constructor(iterable?: Iterable<Value>) {
		super();
		if (iterable !== undefined) {
			for (const value of iterable) {
				this.add(value);
			}
		}
	}

	/** Returns true if the *value* is in the set. O(1). */
	has(value: Value): boolean {
		return this._valuesToNodes.has(value);
	}

	/** Adds a node with the *value* placed before the *before* node or at the end. */
	add(value: Value, before?: Value): void {
		if (this._valuesToNodes.has(value)) {
			return;
		}
		const newNode = new OrderedSet.Node<Value>(value);
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

	/** Sorts the values for iteration based on the *isLess* function. O(sorting algorithm). */
	sort(isLess: (a: Value, b: Value) => boolean): void {
		if (this._head === undefined) {
			return;
		}
		let n = this._head.next;
		while (n !== undefined) {
			let m = n.prev;
			while (m !== undefined && isLess(n.value, m.value)) {
				const t = m.value;
				m.value = n.value;
				n.value = t;
				m = m.prev;
			}
			n = n.next;
		}
	}

	/** Creates a new iterator. */
	protected _createNewIterator(): OrderedSet.SetIterator<Value> {
		return new OrderedSet.SetIterator(this._getHead.bind(this));
	}

	/** Gets the head. */
	private _getHead(): OrderedSet.Node<Value> | undefined {
		return this._head;
	}

	/** The head node. */
	private _head: OrderedSet.Node<Value> | undefined = undefined;

	/** The tail node. */
	private _tail: OrderedSet.Node<Value> | undefined = undefined;

	/** A mapping from values to nodes for easier access. */
	private _valuesToNodes = new Map<Value, OrderedSet.Node<Value>>();
}

export namespace OrderedSet {
	export class SetIterator<Value> extends Ordered.Iterator<Value> {
		private _getHead: () => Node<Value>;

		private node: Node<Value> | undefined = undefined;

		/** The constructor. */
		constructor(getHead: () => Node<Value>) {
			super();
			this._getHead = getHead;
		}

		/** Resets the iterator to the beginning. */
		reset(): void {
			this.node = this._getHead();
			if (this.node !== undefined) {
				this.value = this.node.value;
			}
			else {
				this.iterating = false;
				this.done = true;
			}
		}

		/** Increments the iterator. Returns false if it could not increment. */
		increment(): boolean {
			if (this.node !== undefined && this.node.next !== undefined) {
				this.node = this.node.next;
				this.value = this.node.value;
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
