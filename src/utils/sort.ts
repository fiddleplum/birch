/** Sorting functions for array. All sorting is done in ascending order. */
export class Sort {
	/** Gets the least index of a sorted array that is greater than or equal to the value. O(log n). */
	static getIndex<ArrayType, ValueType>(value: ValueType, array: ArrayType[], isLess: (a: ArrayType, b: ValueType) => boolean): number {
		let low = 0;
		let high = array.length;
		while (low < high) {
			const mid = (low + high) >>> 1;
			if (isLess(array[mid], value)) {
				low = mid + 1;
			}
			else {
				high = mid;
			}
		}
		return low;
	}

	/** Returns true if the value was found in the sorted array. */
	static has<ArrayType, ValueType>(value: ValueType, array: ArrayType[], isLess: (a: ArrayType, b: ValueType) => boolean, isEqual: (a: ArrayType, b: ValueType) => boolean): boolean {
		const index = this.getIndex(value, array, isLess);
		if (index < array.length && isEqual(array[index], value)) {
			return true;
		}
		return false;
	}

	/** Adds the value into the sorted array. */
	static add<ArrayType>(value: ArrayType, array: ArrayType[], isLess: (a: ArrayType, b: ArrayType) => boolean): void {
		const index = this.getIndex(value, array, isLess);
		array.splice(index, 0, value);
	}

	/** Removes the value from the sorted array. Returns true if the value was found. */
	static remove<ArrayType, ValueType>(value: ValueType, array: ArrayType[], isLess: (a: ArrayType, b: ValueType) => boolean, isEqual: (a: ArrayType, b: ValueType) => boolean): boolean {
		const index = this.getIndex(value, array, isLess);
		if (index < array.length && isEqual(array[index], value)) {
			array.splice(index, 1);
			return true;
		}
		return false;
	}

	/** Sorts the values in the array based on the *isLess* function. Uses insertion sort. */
	static sort<ArrayType>(array: ArrayType[], isLess: (a: ArrayType, b: ArrayType) => boolean): void {
		if (array.length === 0) {
			return;
		}
		let n = 1;
		while (n < array.length) {
			let m = n - 1;
			while (m >= 0 && isLess(array[n], array[m])) {
				const t = array[m];
				array[m] = array[m + 1];
				array[m + 1] = t;
				m--;
			}
			n++;
		}
	}
}
