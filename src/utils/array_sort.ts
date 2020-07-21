declare global {
	interface Array<T> {
		isLess: (<Y>(a: T, b: Y) => boolean) | undefined;
	}
}

/** Array sorting functions. If *isLess* is given as a parameter, it is used. Otherwise if *isLess* is defined as an array property, it is used. */
export class ArraySort {
	/** Sets the array isLess function for use by other functions. */
	static setIsLessFunction<T>(array: T[], isLess: <Y>(a: T, b: Y) => boolean): void {
		array.isLess = isLess;
	}

	/** Gets the index of the item, or if not found, where the item would be. O(log n) */
	static find<T, Y>(sortedArray: T[], item: Y, isLess?: (a: T, b: Y) => boolean): number {
		let isLessFunction = isLess;
		if (isLessFunction === undefined) {
			isLessFunction = sortedArray.isLess;
		}
		if (isLessFunction === undefined) {
			throw new Error('isLess must be set.');
		}
		let low = 0;
		let high = sortedArray.length;
		while (low < high) {
			const mid = (low + high) >>> 1;
			if (isLessFunction(sortedArray[mid], item)) {
				low = mid + 1;
			}
			else {
				high = mid;
			}
		}
		return low;
	}

	/** Inserts an item into the sorted array. O(n). */
	static insert<T>(sortedArray: T[], item: T, isLess?: (a: T, b: T) => boolean): void {
		const index = this.find(sortedArray, item, isLess); // O(log n)
		sortedArray.splice(index, 0, item); // O(n)
	}

	/** Insertion sort. O(n^2) worst, O(n) if mostly sorted. */
	static sortByInsertion<T>(array: T[], isLess?: (a: T, b: T) => boolean): void {
		let isLessFunction = isLess;
		if (isLessFunction === undefined) {
			isLessFunction = array.isLess;
		}
		if (isLessFunction === undefined) {
			throw new Error('isLess must be set.');
		}
		for (let i = 1, l = array.length; i < l; i++) {
			const x = array[i];
			// If x is less than the previous element,
			if (isLessFunction(x, array[i - 1])) {
				// Do a binary search to find where it should go.
				let low = 0;
				let high = i;
				while (low < high) {
					const mid = (low + high) >>> 1;
					if (isLessFunction(array[mid], x)) {
						low = mid + 1;
					}
					else {
						high = mid;
					}
				}
				// Move up all of the other elements.
				for (let j = i; j > low; j--) {
					array[j] = array[j - 1];
				}
				array[low] = x;
			}
		}
	}
}
