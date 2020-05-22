import { QuaternionReadonly } from './quaternion_readonly';
import { Vector3Readonly } from './vector3_readonly';

/** A quaternion. */
export class Quaternion extends QuaternionReadonly {
	set w(w: number) {
		this._w = w;
	}

	set x(x: number) {
		this._x = x;
	}

	set y(y: number) {
		this._y = y;
	}

	set z(z: number) {
		this._z = z;
	}

	/** Copies *a* to *this*. */
	copy(a: QuaternionReadonly): void {
		this._w = a.w;
		this._x = a.x;
		this._y = a.y;
		this._z = a.z;
	}

	/** Sets *this* to the components *w*, *x*, *y*, and *z*. */
	set(w: number, x: number, y: number, z: number): void {
		this._w = w;
		this._x = x;
		this._y = y;
		this._z = z;
	}

	/** Sets *this* to the quaternion represented by the rotation *angle* in radians about the *axis*, which should be normalized. */
	setFromAxisAngle(axis: Vector3Readonly, angle: number): void {
		const cosHalfAngle = Math.cos(angle * 0.5);
		const sinHalfAngle = Math.sin(angle * 0.5);
		this._w = cosHalfAngle;
		this._x = sinHalfAngle * Math.cos(axis.x);
		this._y = sinHalfAngle * Math.cos(axis.y);
		this._z = sinHalfAngle * Math.cos(axis.z);
	}

	/** Sets *this* to the quaterion represented by the roll (*x*), pitch (*y*), and yaw (*z*) rotations. The order of application is *x*, *y*, then *z*. */
	setFromEulerAngles(x: number, y: number, z: number): void {
		const cx = Math.cos(x * 0.5);
		const sx = Math.sin(x * 0.5);
		const cy = Math.cos(y * 0.5);
		const sy = Math.sin(y * 0.5);
		const cz = Math.cos(z * 0.5);
		const sz = Math.sin(z * 0.5);
		this._w = cx * cy * cz + sx * sy * sz;
		this._x = cx * cy * sz - sx * sy * cz;
		this._y = cx * sy * cz + sx * cy * sz;
		this._z = sx * cy * cz - cx * sy * sz;
	}

	/** Sets this to the inverse of *a*. */
	inverse(a: QuaternionReadonly): void {
		this._w = a.w;
		this._x = -a.x;
		this._y = -a.y;
		this._z = -a.z;
	}

	/** Sets this to *a* * *b*. */
	mult(a: QuaternionReadonly, b: QuaternionReadonly): void {
		const w = a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z;
		const x = a.x * b.w + a.w * b.x - a.z * b.y + a.y * b.z;
		const y = a.y * b.w + a.z * b.x + a.w * b.y - a.x * b.z;
		const z = a.z * b.w - a.y * b.x + a.x * b.y + a.w * b.z;
		this.set(w, x, y, z);
	}

	/** Sets this to *a* normalized. */
	normalize(a: QuaternionReadonly): void {
		const n = a.norm();
		if (n !== 0) {
			this._w = a.w / n;
			this._x = a.x / n;
			this._y = a.y / n;
			this._z = a.z / n;
		}
	}
}
