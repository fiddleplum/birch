import { QuaternionReadonly } from './quaternion_readonly';
import { Vector3Readonly } from './vector3_readonly';
import { Vector3 } from './vector3';

/** A quaternion. */
export class Quaternion extends QuaternionReadonly {
	/** Gets the *w* component. */
	get w(): number {
		return super.w;
	}

	/** Sets the *w* component. */
	set w(w: number) {
		this._m[0] = w;
	}

	/** Gets the *x* component. */
	get x(): number {
		return super.x;
	}

	/** Sets the *x* component. */
	set x(x: number) {
		this._m[1] = x;
	}

	/** Gets the *y* component. */
	get y(): number {
		return super.y;
	}

	/** Sets the *y* component. */
	set y(y: number) {
		this._m[2] = y;
	}

	/** Gets the *z* component. */
	get z(): number {
		return super.z;
	}

	/** Sets the *z* component. */
	set z(z: number) {
		this._m[3] = z;
	}

	/** Copies *a* to *this*. */
	copy(a: QuaternionReadonly): void {
		this._m[0] = a.w;
		this._m[1] = a.x;
		this._m[2] = a.y;
		this._m[3] = a.z;
	}

	/** Sets *this* to the components *w*, *x*, *y*, and *z*. */
	set(w: number, x: number, y: number, z: number): void {
		this._m[0] = w;
		this._m[1] = x;
		this._m[2] = y;
		this._m[3] = z;
	}

	/** Sets *this* to the quaternion represented by the rotation *angle* in radians about the *axis*, which should be normalized. */
	setFromAxisAngle(axis: Vector3Readonly, angle: number): void {
		const cosHalfAngle = Math.cos(angle * 0.5);
		const sinHalfAngle = Math.sin(angle * 0.5);
		this._m[0] = cosHalfAngle;
		this._m[1] = sinHalfAngle * Math.cos(axis.x);
		this._m[2] = sinHalfAngle * Math.cos(axis.y);
		this._m[3] = sinHalfAngle * Math.cos(axis.z);
	}

	/** Sets *this* to the quaterion represented by the roll (*x*), pitch (*y*), and yaw (*z*) rotations. The order of application is *x*, *y*, then *z*. */
	setFromEulerAngles(x: number, y: number, z: number): void {
		const cx = Math.cos(x * 0.5);
		const sx = Math.sin(x * 0.5);
		const cy = Math.cos(y * 0.5);
		const sy = Math.sin(y * 0.5);
		const cz = Math.cos(z * 0.5);
		const sz = Math.sin(z * 0.5);
		this._m[0] = cx * cy * cz + sx * sy * sz;
		this._m[1] = cx * cy * sz - sx * sy * cz;
		this._m[2] = cx * sy * cz + sx * cy * sz;
		this._m[3] = sx * cy * cz - cx * sy * sz;
	}

	/** Sets *this* to the quaternion represented by a rotation from *a* to *b*, which should be normalized. */
	setFromVectorRotation(a: Vector3Readonly, b: Vector3Readonly): void {
		this._m[0] = 1 + a.dot(b);
		if (this._m[0] !== 0) {
			Quaternion.tempVector3.cross(a, b);
		}
		else {
			Quaternion.tempVector3.perp(a);
		}
		this._m[1] = Quaternion.tempVector3.x;
		this._m[2] = Quaternion.tempVector3.y;
		this._m[3] = Quaternion.tempVector3.z;
		this.normalize(this);
	}

	/** Sets this to the inverse of *a*. */
	inverse(a: QuaternionReadonly): void {
		this._m[0] = a.w;
		this._m[1] = -a.x;
		this._m[2] = -a.y;
		this._m[3] = -a.z;
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
			this._m[0] = a.w / n;
			this._m[1] = a.x / n;
			this._m[2] = a.y / n;
			this._m[3] = a.z / n;
		}
	}

	static tempVector3 = new Vector3();
}
