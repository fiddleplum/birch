/** A three-dimensional vector. */
export class Vector3 {
	x: number;
	y: number;
	z: number;

	/** A zero vector. */
	static Zero = new Vector3(0, 0, 0);

	/** A one vector. */
	static One = new Vector3(1, 1, 1);

	/** The constructor. Defaults to the zero vector. */
	constructor(x = 0, y = 0, z = 0) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	/** Gets *this* as a string. */
	public toString(): string {
		return '[' + this.x + ', ' + this.y + ', ' + this.z + ']';
	}

	/** Returns true if *this* equals *a*. */
	equals(a: Vector3): boolean {
		return this.x === a.x && this.y === a.y && this.z === a.z;
	}

	/** Copies *a* to *this*. */
	copy(a: Vector3): void {
		this.x = a.x;
		this.y = a.y;
		this.z = a.z;
	}

	/** Sets *this* to the components *x*, *y*, and *z*. */
	set(x: number, y: number, z: number): void {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	/** Sets *this* to -*a*. */
	neg(a: Vector3): void {
		this.x = -a.x;
		this.y = -a.y;
		this.z = -a.z;
	}

	/** Sets *this* to *a* + *b*. */
	add(a: Vector3, b: Vector3): void {
		this.x = a.x + b.x;
		this.y = a.y + b.y;
		this.z = a.z + b.z;
	}

	/** Sets *this* to *a* - *b*. */
	sub(a: Vector3, b: Vector3): void {
		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;
	}

	/** Sets *this* to *a* * *b*. */
	mult(a: Vector3, b: number): void {
		this.x = a.x * b;
		this.y = a.y * b;
		this.z = a.z * b;
	}

	/** Sets *this* to *a* scaled by *b*, component-wise. */
	scale(a: Vector3, b: Vector3): void {
		this.x = a.x * b.x;
		this.y = a.y * b.y;
		this.z = a.z * b.z;
	}

	/** Sets *this* to *a* inverse-scaled by *b*, component-wise. */
	scaleInv(a: Vector3, b: Vector3): void {
		this.x = a.x / b.x;
		this.y = a.y / b.y;
		this.z = a.z / b.z;
	}

	/** Gets the dot product between *this* and *a*. */
	dot(a: Vector3): number {
		return this.x * a.x + this.y * a.y + this.z * a.z;
	}

	/** Gets the norm of *this*. */
	norm(): number {
		return Math.sqrt(this.dot(this));
	}

	/** Sets *this* to *a* normalized. */
	normalize(a: Vector3): void {
		const n = a.norm();
		if (n !== 0) {
			this.x = a.x / n;
			this.y = a.y / n;
			this.z = a.z / n;
		}
	}

	/** Sets *this* to *a*, clamped between *min* and *max*. */
	clamp(a: Vector3, min: Vector3, max: Vector3): void {
		this.x = Math.max(min.x, Math.min(max.x, a.x));
		this.y = Math.max(min.y, Math.min(max.y, a.y));
		this.z = Math.max(min.z, Math.min(max.z, a.z));
	}

	/** Sets *this* to the lerp between *a* and *b*, with lerp factor *u*. */
	lerp(a: Vector3, b: Vector3, u: number): void {
		this.x = a.x + (b.x - a.x) * u;
		this.y = a.y + (b.y - a.y) * u;
		this.z = a.z + (b.z - a.z) * u;
	}

	/** Sets *this* to *a* cross *b*. */
	cross(a: Vector3, b: Vector3): void {
		const x = a.y * b.z - a.z * b.y;
		const y = a.z * b.x - a.x * b.z;
		const z = a.x * b.y - a.y * b.x;
		this.x = x;
		this.y = y;
		this.z = z;
	}

// /**
// 	 * Sets this to b rotated by a.
// 	 * @param {Quaternion} a
// 	 * @param {Vector3} b
// 	 */
// 	rotate(a, b) {
// 		this.throwIfFrozen();
// 		let x = 2 * (a._v[1] * b._v[2] - a._v[2] * b._v[1]);
// 		let y = 2 * (a._v[2] * b._v[0] - a._v[0] * b._v[2]);
// 		let z = 2 * (a._v[0] * b._v[1] - a._v[1] * b._v[0]);
// 		this._v[0] = b._v[0] + a._w * x + a._v[1] * z - a._v[2] * y;
// 		this._v[1] = b._v[1] + a._w * y + a._v[2] * x - a._v[0] * z;
// 		this._v[2] = b._v[2] + a._w * z + a._v[0] * y - a._v[1] * x;
// 		// from http://blog.molecular-matters.com/2013/05/24/a-faster-quaternion-vector-multiplication/
// 	}
}
