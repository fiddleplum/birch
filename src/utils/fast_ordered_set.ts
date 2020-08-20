import { FastIterable, FastIterableBase } from './fast_iterable';

export class FastOrderedSet<Value> extends FastIterableBase<Value> {
	/** Constructs the FastList. Takes an *iterable*. */
	constructor(iterable?: Iterable<Value>) {
		super();
		if (iterable !== undefined) {
			for (const value of iterable) {
				this.add(value);
			}
		}
	}

	/** Gets the number of values. */
	size(): number {
		return this._valuesToNodes.size;
	}

	/** Returns true if the *value* is in the set. (1). */
	has(value: Value): boolean {
		return this._valuesToNodes.has(value);
	}

	/** Adds a node with the *value* placed before the *before* node or at the end. If the value already exists, it readds it. O(1) */
	add(value: Value, before?: Value): void {
		if (this._valuesToNodes.has(value)) {
			this.remove(value);
		}
		const newNode = new FastOrderedSet.Node<Value>(value);
		if (before !== undefined) {
			const beforeNode = this._valuesToNodes.get(before);
			if (beforeNode === undefined) {
				throw new Error('The value ' + before + ' was not found.');
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

	/** Sorts the values for iteration based on the *isLess* function. Uses insertion sort. */
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
	protected _createNewIterator(): FastOrderedSet.Iterator<Value> {
		return new FastOrderedSet.Iterator(this._getHead.bind(this));
	}

	/** Gets the head. */
	private _getHead(): FastOrderedSet.Node<Value> | undefined {
		return this._head;
	}

	/** The head node. */
	private _head: FastOrderedSet.Node<Value> | undefined = undefined;

	/** The tail node. */
	private _tail: FastOrderedSet.Node<Value> | undefined = undefined;

	/** A mapping from values to nodes for easier access. */
	private _valuesToNodes = new Map<Value, FastOrderedSet.Node<Value>>();
}

export namespace FastOrderedSet {
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
