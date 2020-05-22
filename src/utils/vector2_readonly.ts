/** A readonly two-dimensional vector. */
export class Vector2Readonly {
	protected _x: number;
	protected _y: number;

	/** The zero vector. */
	static Zero = new Vector2Readonly(0, 0);

	/** The one vector. */
	static One = new Vector2Readonly(1, 1);

	/** The constructor. Defaults to the zero vector. */
	constructor(x = 0, y = 0) {
		this._x = x;
		this._y = y;
	}

	/** Gets the *x* component. */
	get x(): number {
		return this._x;
	}

	/** Gets the *y* component. */
	get y(): number {
		return this._y;
	}

	/** Gets *this* as a string. */
	public toString(): string {
		return '[' + this._x + ', ' + this._y + ']';
	}

	/** Returns true if *this* equals *a*. */
	equals(a: Vector2Readonly): boolean {
		return this._x === a._x && this._y === a._y;
	}

	/** Gets the dot product between *this* and *a*. */
	dot(a: Vector2Readonly): number {
		return this._x * a._x + this._y * a._y;
	}

	/** Gets the norm of *this*. */
	norm(): number {
		return Math.sqrt(this.dot(this));
	}
}
