/** A readonly two-dimensional vector. */
export class Vector2Readonly {
	/** The components. */
	protected _m: number[];

	/** The zero vector. */
	static Zero = new Vector2Readonly(0, 0);

	/** The one vector. */
	static One = new Vector2Readonly(1, 1);

	/** The unit X vector. */
	static UnitX = new Vector2Readonly(1, 0);

	/** The unit Y vector. */
	static UnitY = new Vector2Readonly(0, 1);

	/** The unit negative X vector. */
	static UnitNegX = new Vector2Readonly(-1, 0);

	/** The unit negative Y vector. */
	static UnitNegY = new Vector2Readonly(0, -1);

	/** The constructor. Defaults to the zero vector. */
	constructor(x = 0, y = 0) {
		this._m = [x, y];
	}

	/** Gets the *x* component. */
	get x(): number {
		return this._m[0];
	}

	/** Gets the *y* component. */
	get y(): number {
		return this._m[1];
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
		return '[' + this._m[0] + ', ' + this._m[1] + ']';
	}

	/** Returns true if *this* equals *a*. */
	equals(a: Vector2Readonly): boolean {
		return this._m[0] === a._m[0] && this._m[1] === a._m[1];
	}

	/** Gets the dot product between *this* and *a*. */
	dot(a: Vector2Readonly): number {
		return this._m[0] * a._m[0] + this._m[1] * a._m[1];
	}

	/** Gets the cross product between *this* and *a*, which is: sin(the angle in radians from *this* to *a*) X norm(*this*) X norm(*a*). */
	cross(a: Vector2Readonly): number {
		return this._m[0] * a._m[1] - this._m[1] * a._m[0];
	}

	/** Gets the distance between *this* and *a*. */
	distance(a: Vector2Readonly): number {
		const x = this.x - a.x;
		const y = this.y - a.y;
		return Math.sqrt(x * x + y * y);
	}
}
