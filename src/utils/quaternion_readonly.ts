/** A readonly quaternion. */
export class QuaternionReadonly {
	/** The components. */
	protected _m: number[];

	/** The identity quaternion. */
	static Identity = new QuaternionReadonly(1, 0, 0, 0);

	/** The constructor. Defaults to the identity quaternion. */
	constructor(w = 1, x = 0, y = 0, z = 0) {
		this._m = [w, x, y, z];
	}

	/** Gets the *w* component. */
	get w(): number {
		return this._m[0];
	}

	/** Gets the *x* component. */
	get x(): number {
		return this._m[1];
	}

	/** Gets the *y* component. */
	get y(): number {
		return this._m[2];
	}

	/** Gets the *z* component. */
	get z(): number {
		return this._m[3];
	}

	/** Gets the angle of the rotation that this represents. */
	get angle(): number {
		return Math.acos(this._m[0]) * 2;
	}

	/** Gets *this* as a string. */
	toString(): string {
		return '[' + this._m[0] + ', ' + this._m[1] + ', ' + this._m[2] + ', ' + this._m[3] + ']';
	}

	/** Returns true if *this* equals *a*. */
	equals(a: QuaternionReadonly): boolean {
		return this._m[0] === a._m[0] && this._m[1] === a._m[1] && this._m[2] === a._m[2] && this._m[3] === a._m[3];
	}

	/** Gets the dot product between *this* and *a*. */
	dot(a: QuaternionReadonly): number {
		return this._m[0] * a._m[0] + this._m[1] * a._m[1] + this._m[2] * a._m[2] + this._m[3] * a._m[3];
	}

	/** Gets the norm of *this*. */
	norm(): number {
		return Math.sqrt(this.dot(this));
	}

	/** Returns the angle in radians between *this* and quaternion *a*. */
	angleBetween(a: QuaternionReadonly): number {
		return Math.acos(this._m[0] * a._m[0] + this._m[1] * a._m[1] + this._m[2] * a._m[2] + this._m[3] * a._m[3]) * 2.0;
	}

	/** Gets the underlying array. */
	get array(): readonly number[] {
		return this._m;
	}
}
