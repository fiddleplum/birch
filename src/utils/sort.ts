export class Sort {
	static insertionSort<T>(array: T[], compare: Sort.compareFunction<T>): void {
		let i = 1;
		while (i < array.length) {
			const x = array[i];
			let j = i - 1;
			while (j >= 0 && compare(array[j], x) > 0) {
				array[j + 1] = array[j];
				j -= 1;
			}
			array[j + 1] = x;
			i += 1;
		}
	}
}

export namespace Sort {
	export type compareFunction<T> = (a: T, b: T) => number;

	export type sortFunction<T> = (array: T[], compare: compareFunction<T>) => void;
}
