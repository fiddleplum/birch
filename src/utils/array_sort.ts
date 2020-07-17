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

	/** Gets the index of the item, or if not found, where the item would be. */
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

	/** Inserts an item into the sorted array. */
	static insert<T>(sortedArray: T[], item: T, isLess?: (a: T, b: T) => boolean): void {
		const index = this.find(sortedArray, item, isLess);
		sortedArray.splice(index, 0, item);
	}

	/** Insertion sort. */
	static sortByInsertion<T>(array: T[], isLess?: (a: T, b: T) => boolean): void {
		let isLessFunction = isLess;
		if (isLessFunction === undefined) {
			isLessFunction = array.isLess;
		}
		if (isLessFunction === undefined) {
			throw new Error('isLess must be set.');
		}
		let i = 1;
		while (i < array.length) {
			const x = array[i];
			let j = i - 1;
			while (j >= 0 && isLessFunction(x, array[j])) {
				array[i] = array[j];
				array[j] = x;
				j -= 1;
			}
			i += 1;
		}
	}
}
