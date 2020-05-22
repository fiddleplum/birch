/** A readonly quaternion. */
export class QuaternionReadonly {
	protected _w: number;
	protected _x: number;
	protected _y: number;
	protected _z: number;

	/** The identity quaternion. */
	static Identity = new QuaternionReadonly(1, 0, 0, 0);

	/** The constructor. Defaults to the identity quaternion. */
	constructor(w = 1, x = 0, y = 0, z = 0) {
		this._w = w;
		this._x = x;
		this._y = y;
		this._z = z;
	}

	/** Gets the *w* component. */
	get w(): number {
		return this._w;
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
	toString(): string {
		return '[' + this._w + ', ' + this._x + ', ' + this._y + ', ' + this._z + ']';
	}

	/** Returns true if *this* equals *a*. */
	equals(a: QuaternionReadonly): boolean {
		return this._w === a._w && this._x === a._x && this._y === a._y && this._z === a._z;
	}

	/** Gets the dot product between *this* and *a*. */
	dot(a: QuaternionReadonly): number {
		return this._w * a._w + this._x * a._x + this._y * a._y + this._z * a._z;
	}

	/** Gets the norm of *this*. */
	norm(): number {
		return Math.sqrt(this.dot(this));
	}
}
