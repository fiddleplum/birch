import { QuaternionReadonly } from './quaternion_readonly';
import { Vector3Readonly } from './vector3_readonly';

/** A three-dimensional vector. */
export class Vector3 extends Vector3Readonly {
	/** Sets the *x* component. */
	set x(x: number) {
		this._x = x;
	}

	/** Sets the *y* component. */
	set y(y: number) {
		this._y = y;
	}

	/** Sets the *z* component. */
	set z(z: number) {
		this._z = z;
	}

	/** Copies *a* to *this*. */
	copy(a: Vector3Readonly): void {
		this._x = a.x;
		this._y = a.y;
		this._z = a.z;
	}

	/** Sets *this* to the components *x*, *y*, and *z*. */
	set(x: number, y: number, z: number): void {
		this._x = x;
		this._y = y;
		this._z = z;
	}

	/** Sets *this* to -*a*. */
	neg(a: Vector3Readonly): void {
		this._x = -a.x;
		this._y = -a.y;
		this._z = -a.z;
	}

	/** Sets *this* to *a* + *b*. */
	add(a: Vector3Readonly, b: Vector3Readonly): void {
		this._x = a.x + b.x;
		this._y = a.y + b.y;
		this._z = a.z + b.z;
	}

	/** Sets *this* to *a* - *b*. */
	sub(a: Vector3Readonly, b: Vector3Readonly): void {
		this._x = a.x - b.x;
		this._y = a.y - b.y;
		this._z = a.z - b.z;
	}

	/** Sets *this* to *a* * *b*. */
	mult(a: Vector3Readonly, b: number): void {
		this._x = a.x * b;
		this._y = a.y * b;
		this._z = a.z * b;
	}

	/** Sets *this* to *a* scaled by *b*, component-wise. */
	scale(a: Vector3Readonly, b: Vector3Readonly): void {
		this._x = a.x * b.x;
		this._y = a.y * b.y;
		this._z = a.z * b.z;
	}

	/** Sets *this* to *a* inverse-scaled by *b*, component-wise. */
	scaleInv(a: Vector3Readonly, b: Vector3Readonly): void {
		this._x = a.x / b.x;
		this._y = a.y / b.y;
		this._z = a.z / b.z;
	}

	/** Sets *this* to *a* normalized. */
	normalize(a: Vector3Readonly): void {
		const n = a.norm();
		if (n !== 0) {
			this._x = a.x / n;
			this._y = a.y / n;
			this._z = a.z / n;
		}
	}

	/** Sets *this* to *a*, clamped between *min* and *max*. */
	clamp(a: Vector3Readonly, min: Vector3Readonly, max: Vector3Readonly): void {
		this._x = Math.max(min.x, Math.min(max.x, a.x));
		this._y = Math.max(min.y, Math.min(max.y, a.y));
		this._z = Math.max(min.z, Math.min(max.z, a.z));
	}

	/** Sets *this* to the lerp between *a* and *b*, with lerp factor *u*. */
	lerp(a: Vector3Readonly, b: Vector3Readonly, u: number): void {
		this._x = a.x + (b.x - a.x) * u;
		this._y = a.y + (b.y - a.y) * u;
		this._z = a.z + (b.z - a.z) * u;
	}

	/** Sets *this* to *a* cross *b*. */
	cross(a: Vector3Readonly, b: Vector3Readonly): void {
		const x = a.y * b.z - a.z * b.y;
		const y = a.z * b.x - a.x * b.z;
		const z = a.x * b.y - a.y * b.x;
		this._x = x;
		this._y = y;
		this._z = z;
	}

	/** Sets *this* to *b* rotated by *a*. */
	rotate(a: QuaternionReadonly, b: Vector3Readonly): void {
		const x = 2 * (a.y * b.z - a.z * b.y);
		const y = 2 * (a.z * b.x - a.x * b.z);
		const z = 2 * (a.x * b.y - a.y * b.x);
		this._x = b.x + a.w * x + a.y * z - a.z * y;
		this._y = b.y + a.w * y + a.z * x - a.x * z;
		this._z = b.z + a.w * z + a.x * y - a.y * x;
		// from http://blog.molecular-matters.com/2013/05/24/a-faster-quaternion-vector-multiplication/
	}
}
