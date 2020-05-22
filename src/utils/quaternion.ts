import { Vector3 } from '../internal';

/** A quaternion. */
export class Quaternion {
	w: number;
	x: number;
	y: number;
	z: number;

	/** The constructor. Defaults to the identity quaternion. */
	constructor(w = 1, x = 0, y = 0, z = 0) {
		this.w = w;
		this.x = x;
		this.y = y;
		this.z = z;
	}

	/** Gets *this* as a string. */
	toString(): string {
		return '[' + this.w + ', ' + this.x + ', ' + this.y + ', ' + this.z + ']';
	}

	/** Returns true if *this* equals *a*. */
	equals(a: Quaternion): boolean {
		return this.w === a.w && this.x === a.x && this.y === a.y && this.z === a.z;
	}

	/** Copies *a* to *this*. */
	copy(a: Quaternion): void {
		this.w = a.w;
		this.x = a.x;
		this.y = a.y;
		this.z = a.z;
	}

	/** Sets *this* to the components *w*, *x*, *y*, and *z*. */
	set(w: number, x: number, y: number, z: number): void {
		this.w = w;
		this.x = x;
		this.y = y;
		this.z = z;
	}

	get(): Readonly<Quaternion> {
		return this;
	}

	/** Sets *this* to the quaternion represented by the rotation *angle* in radians about the *axis*, which should be normalized. */
	setAxisAngle(axis: Readonly<Vector3>, angle: number): void {
		const cosHalfAngle = Math.cos(angle * 0.5);
		const sinHalfAngle = Math.sin(angle * 0.5);
		this.w = cosHalfAngle;
		this.x = sinHalfAngle * Math.cos(axis.x);
		this.y = sinHalfAngle * Math.cos(axis.y);
		this.z = sinHalfAngle * Math.cos(axis.z);
	}

	/**
	 * Sets this to the quaterion represented by the roll (x), pitch (y), and yaw (z) rotations. The order of application is x, y, then z.
	 * @param {number} x
	 * @param {number} y
	 * @param {number} z
	 */
	setFromEulerAngles(x, y, z): void {
		const cx = Math.cos(x * 0.5);
		const sx = Math.sin(x * 0.5);
		const cy = Math.cos(y * 0.5);
		const sy = Math.sin(y * 0.5);
		const cz = Math.cos(z * 0.5);
		const sz = Math.sin(z * 0.5);
		this.w = cx * cy * cz + sx * sy * sz;
		this.x = cx * cy * sz - sx * sy * cz;
		this.y = cx * sy * cz + sx * cy * sz;
		this.z = sx * cy * cz - cx * sy * sz;
	}

	/**
	 * Sets this to the inverse of a.
	 * @param {Quaternion} a
	 */
	inv(a) {
		this.w = a.w;
		this.x = -a.x;
		this.y = -a.y;
		this.z = -a.z;
	}

	/**
	 * Sets this to a * b.
	 * @param {Quaternion} a
	 * @param {Quaternion} b
	 */
	mult(a, b) {
		const temp = Quaternion.Pool.get();
		temp.x = a.x * b.w + a.w * b.x - a.z * b.y + a.y * b.z;
		temp.y = a.y * b.w + a.z * b.x + a.w * b.y - a.x * b.z;
		temp.z = a.z * b.w - a.y * b.x + a.x * b.y + a.w * b.z;
		temp.w = a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z;
		this.copy(temp);
		Quaternion.Pool.release(temp);
	}

	/**
	 * Gets the dot product between this and a.
	 * @param {Quaternion} a
	 * @returns {number}
	 */
	dot(a) {
		return this.w * a.w + this.x * a.x + this.y * a.y + this.z * a.z;
	}

	/**
	 * Gets the norm of this.
	 * @returns {number}
	 */
	norm() {
		return Math.sqrt(this.dot(this));
	}

	/**
	 * Sets this to a normalized.
	 * @param {Quaternion} a
	 */
	normalize(a) {
		const n = a.norm();
		if (n !== 0) {
			this.w = a.w / n;
			this.x = a.x / n;
			this.y = a.y / n;
			this.z = a.z / n;
		}
	}
}

/**
 * The identity quaternion.
 * @type {Quaternion}
 */
Quaternion.Identity = new Quaternion(1, 0, 0, 0);
Quaternion.Identity.freeze();

/**
 * A poll of quaternions.
 * @type {Pool<Quaternion>}
*/
Quaternion.Pool = new Pool(Quaternion);

