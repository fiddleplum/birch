/** Sorting functions. */
export class Sort {
	/** Insertion sort. */
	static insertionSort<T>(array: T[], compare: Sort.compareFunction<T>, swap: Sort.swapFunction): void {
		let i = 1;
		while (i < array.length) {
			const x = array[i];
			let j = i - 1;
			while (j >= 0 && compare(array[j], x) > 0) {
				swap(j + 1, j);
				j -= 1;
			}
			i += 1;
		}
	}
}

export namespace Sort {
	/** A generic compare function called by the sort functions. */
	export type compareFunction<T> = (a: T, b: T) => number;

	/** A generic swap function called by the sort functions. */
	export type swapFunction = (i: number, j: number) => void;

	/** All sort functions have this signature. */
	export type sortFunction<T> = (array: T[], compare: compareFunction<T>, swap: Sort.swapFunction) => void;
}
