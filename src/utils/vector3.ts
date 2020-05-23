import { QuaternionReadonly } from './quaternion_readonly';
import { Vector3Readonly } from './vector3_readonly';
import { Num } from './num';

/** A three-dimensional vector. */
export class Vector3 extends Vector3Readonly {
	/** Sets the *x* component. */
	set x(x: number) {
		this._m[0] = x;
	}

	/** Sets the *y* component. */
	set y(y: number) {
		this._m[1] = y;
	}

	/** Sets the *z* component. */
	set z(z: number) {
		this._m[2] = z;
	}

	/** Copies *a* to *this*. */
	copy(a: Vector3Readonly): void {
		this._m[0] = a.x;
		this._m[1] = a.y;
		this._m[2] = a.z;
	}

	/** Sets *this* to the components *x*, *y*, and *z*. */
	set(x: number, y: number, z: number): void {
		this._m[0] = x;
		this._m[1] = y;
		this._m[2] = z;
	}

	/** Sets *this* to -*a*. */
	neg(a: Vector3Readonly): void {
		this._m[0] = -a.x;
		this._m[1] = -a.y;
		this._m[2] = -a.z;
	}

	/** Sets *this* to *a* + *b*. */
	add(a: Vector3Readonly, b: Vector3Readonly): void {
		this._m[0] = a.x + b.x;
		this._m[1] = a.y + b.y;
		this._m[2] = a.z + b.z;
	}

	/** Sets *this* to *a* - *b*. */
	sub(a: Vector3Readonly, b: Vector3Readonly): void {
		this._m[0] = a.x - b.x;
		this._m[1] = a.y - b.y;
		this._m[2] = a.z - b.z;
	}

	/** Sets *this* to *a* * *b*. */
	mult(a: Vector3Readonly, b: number): void {
		this._m[0] = a.x * b;
		this._m[1] = a.y * b;
		this._m[2] = a.z * b;
	}

	/** Sets *this* to *a* / *b*. */
	div(a: Vector3Readonly, b: number): void {
		this._m[0] = a.x / b;
		this._m[1] = a.y / b;
		this._m[2] = a.z / b;
	}

	/** Sets *this* to *a* * *b*, component-wise. */
	multV(a: Vector3Readonly, b: Vector3Readonly): void {
		this._m[0] = a.x * b.x;
		this._m[1] = a.y * b.y;
		this._m[2] = a.z * b.z;
	}

	/** Sets *this* to *a* / *b*, component-wise. */
	divV(a: Vector3Readonly, b: Vector3Readonly): void {
		this._m[0] = a.x / b.x;
		this._m[1] = a.y / b.y;
		this._m[2] = a.z / b.z;
	}

	/** Sets *this* to *a* normalized. */
	normalize(a: Vector3Readonly): void {
		const n = a.norm;
		if (n !== 0) {
			this._m[0] = a.x / n;
			this._m[1] = a.y / n;
			this._m[2] = a.z / n;
		}
	}

	/** Sets *this* to *a*, clamped between *min* and *max*. */
	clamp(a: Vector3Readonly, min: number, max: number): void {
		this._m[0] = Num.clamp(a.x, min, max);
		this._m[1] = Num.clamp(a.y, min, max);
		this._m[2] = Num.clamp(a.z, min, max);
	}

	/** Sets *this* to *a*, clamped between *min* and *max*, component-wise. */
	clampV(a: Vector3Readonly, min: Vector3Readonly, max: Vector3Readonly): void {
		this._m[0] = Num.clamp(a.x, min.x, max.x);
		this._m[1] = Num.clamp(a.y, min.y, max.y);
		this._m[2] = Num.clamp(a.z, min.z, max.z);
	}

	/** Sets *this* to the lerp between *a* and *b*, with lerp factor *u*. */
	lerp(a: Vector3Readonly, b: Vector3Readonly, u: number): void {
		this._m[0] = Num.lerp(a.x, b.x, u);
		this._m[1] = Num.lerp(a.y, b.y, u);
		this._m[2] = Num.lerp(a.z, b.z, u);
	}

	/** Sets *this* to *a* cross *b*. */
	cross(a: Vector3Readonly, b: Vector3Readonly): void {
		const x = a.y * b.z - a.z * b.y;
		const y = a.z * b.x - a.x * b.z;
		const z = a.x * b.y - a.y * b.x;
		this._m[0] = x;
		this._m[1] = y;
		this._m[2] = z;
	}

	/** Sets *this* to a vector that is perpendicular to *a*. It tries on the xy-plane first otherwise chooses the X axis. */
	perp(a: Vector3Readonly): void {
		if (a.y !== 0 || a.x !== 0) {
			this.set(-a.y, a.x, 0);
		}
		else {
			this.set(1, 0, 0);
		}
	}

	/** Sets *this* to *b* rotated by *a*. */
	rotate(a: QuaternionReadonly, b: Vector3Readonly): void {
		const x = 2 * (a.y * b.z - a.z * b.y);
		const y = 2 * (a.z * b.x - a.x * b.z);
		const z = 2 * (a.x * b.y - a.y * b.x);
		this._m[0] = b.x + a.w * x + a.y * z - a.z * y;
		this._m[1] = b.y + a.w * y + a.z * x - a.x * z;
		this._m[2] = b.z + a.w * z + a.x * y - a.y * x;
		// from http://blog.molecular-matters.com/2013/05/24/a-faster-quaternion-vector-multiplication/
	}

	/** Sets *this* to the axis *i* (0, 1, or 2) of the quaternion *a*. */
	quatAxis(a: QuaternionReadonly, i: number): void {
		const j = (i + 1) % 3;
		const k = (i + 2) % 3;
		const q = a.array;
		this._m[i] = 1 - 2 * (q[1 + j] * q[1 + j] + q[1 + k] * q[1 + k]);
		this._m[j] = 2 * (q[1 + i] * q[1 + j] + q[1 + k] * q[0]);
		this._m[k] = 2 * (q[1 + i] * q[1 + k] - q[1 + j] * q[0]);
	}
}
