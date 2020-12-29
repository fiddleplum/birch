export class Counted<Value> {
	constructor(value: Value) {
		this.value = value;
		this.count = 1;
	}

	value: Value;
	count: number;
}
