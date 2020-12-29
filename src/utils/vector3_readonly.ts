/** A readonly three-dimensional vector. */
export class Vector3Readonly {
	/** The components. */
	protected _m: number[];

	/** The zero vector. */
	static Zero = new Vector3Readonly(0, 0, 0);

	/** The one vector. */
	static One = new Vector3Readonly(1, 1, 1);

	/** The unit X vector. */
	static UnitX = new Vector3Readonly(1, 0, 0);

	/** The unit Y vector. */
	static UnitY = new Vector3Readonly(0, 1, 0);

	/** The unit Z vector. */
	static UnitZ = new Vector3Readonly(0, 0, 1);

	/** The unit negative X vector. */
	static UnitNegX = new Vector3Readonly(-1, 0, 0);

	/** The unit negative Y vector. */
	static UnitNegY = new Vector3Readonly(0, -1, 0);

	/** The unit negative Z vector. */
	static UnitNegZ = new Vector3Readonly(0, 0, -1);

	/** The constructor. Defaults to the zero vector. */
	constructor(x = 0, y = 0, z = 0) {
		this._m = [x, y, z];
	}

	/** Gets the *x* component. */
	get x(): number {
		return this._m[0];
	}

	/** Gets the *y* component. */
	get y(): number {
		return this._m[1];
	}

	/** Gets the *z* component. */
	get z(): number {
		return this._m[2];
	}

	/** Gets the square norm of *this*. */
	get normSq(): number {
		return this.dot(this);
	}

	/** Gets the norm of *this*. */
	get norm(): number {
		return Math.sqrt(this.normSq);
	}

	/** Gets the underlying array. */
	get array(): readonly number[] {
		return this._m;
	}

	/** Gets *this* as a string. */
	public toString(): string {
		return '[' + this._m[0] + ', ' + this._m[1] + ', ' + this._m[2] + ']';
	}

	/** Returns true if *this* equals *a*. */
	equals(a: Vector3Readonly): boolean {
		return this._m[0] === a._m[0] && this._m[1] === a._m[1] && this._m[2] === a._m[2];
	}

	/** Gets the dot product between *this* and *a*. */
	dot(a: Vector3Readonly): number {
		return this._m[0] * a._m[0] + this._m[1] * a._m[1] + this._m[2] * a._m[2];
	}

	/** Gets the distance between *this* and *a*. */
	distance(a: Vector3Readonly): number {
		const x = this.x - a.x;
		const y = this.y - a.y;
		const z = this.z - a.z;
		return Math.sqrt(x * x + y * y + z * z);
	}
}
