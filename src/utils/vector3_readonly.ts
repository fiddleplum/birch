/** A readonly three-dimensional vector. */
export class Vector3Readonly {
	protected _x: number;
	protected _y: number;
	protected _z: number;

	/** The zero vector. */
	static Zero = new Vector3Readonly(0, 0, 0);

	/** The one vector. */
	static One = new Vector3Readonly(1, 1, 1);

	/** The constructor. Defaults to the zero vector. */
	constructor(x = 0, y = 0, z = 0) {
		this._x = x;
		this._y = y;
		this._z = z;
	}

	/** Gets the *x* component. */
	get x(): number {
		return this._x;
	}

	/** Gets the *y* component. */
	get y(): number {
		return this._y;
	}

	/** Gets the *z* component. */
	get z(): number {
		return this._z;
	}

	/** Gets *this* as a string. */
	public toString(): string {
		return '[' + this._x + ', ' + this._y + ', ' + this._z + ']';
	}

	/** Returns true if *this* equals *a*. */
	equals(a: Vector3Readonly): boolean {
		return this._x === a._x && this._y === a._y && this._z === a._z;
	}

	/** Gets the dot product between *this* and *a*. */
	dot(a: Vector3Readonly): number {
		return this._x * a._x + this._y * a._y + this._z * a._z;
	}

	/** Gets the norm of *this*. */
	norm(): number {
		return Math.sqrt(this.dot(this));
	}
}
