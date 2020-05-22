/** A two-dimensional vector. */
export class Vector2Readonly {
	private _x: number;
	private _y: number;

	/** A zero vector. */
	static Zero = new Vector2Readonly(0, 0);

	/** A one vector. */
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

	/** Copies *a* to *this*. */
	copy(a: Vector2): void {
		this._x = a._x;
		this._y = a._y;
	}

	/** Sets *this* to the components *x* and *y*. */
	set(x: number, y: number): void {
		this._x = x;
		this._y = y;
	}

	/** Sets *this* to -*a*. */
	neg(a: Vector2): void {
		this._x = -a._x;
		this._y = -a._y;
	}

	/** Sets *this* to *a* + *b*. */
	add(a: Vector2, b: Vector2): void {
		this._x = a._x + b._x;
		this._y = a._y + b._y;
	}

	/** Sets *this* to *a* - *b*. */
	sub(a: Vector2, b: Vector2): void {
		this._x = a._x - b._x;
		this._y = a._y - b._y;
	}

	/** Sets *this* to *a* * *b*. */
	mult(a: Vector2, b: number): void {
		this._x = a._x * b;
		this._y = a._y * b;
	}

	/** Sets *this* to *a* scaled by *b*, component-wise. */
	scale(a: Vector2, b: Vector2): void {
		this._x = a._x * b._x;
		this._y = a._y * b._y;
	}

	/** Sets *this* to *a* inverse-scaled by *b*, component-wise. */
	scaleInv(a: Vector2, b: Vector2): void {
		this._x = a._x / b._x;
		this._y = a._y / b._y;
	}

	/** Gets the dot product between *this* and *a*. */
	dot(a: Vector2): number {
		return this._x * a._x + this._y * a._y;
	}

	/** Gets the norm of *this*. */
	norm(): number {
		return Math.sqrt(this.dot(this));
	}

	/** Sets *this* to *a* normalized. */
	normalize(a: Vector2): void {
		const n = a.norm();
		if (n !== 0) {
			this._x = a._x / n;
			this._y = a._y / n;
		}
	}

	/** Sets *this* to *a*, clamped between *min* and *max*. */
	clamp(a: Vector2, min: Vector2, max: Vector2): void {
		this._x = Math.max(min._x, Math.min(max._x, a._x));
		this._y = Math.max(min._y, Math.min(max._y, a._y));
	}

	/** Sets *this* to the lerp between *a* and *b*, with lerp factor *u*. */
	lerp(a: Vector2, b: Vector2, u: number): void {
		this._x = a._x + (b._x - a._x) * u;
		this._y = a._y + (b._y - a._y) * u;
	}
}
