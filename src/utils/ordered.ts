export interface Ordered<Value> {
	/** Gets the value at the *index*. */
	getAt(index: number): Value;

	/** The number of values. */
	size: number;
}