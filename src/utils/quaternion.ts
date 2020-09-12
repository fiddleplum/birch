import { QuaternionReadonly } from './quaternion_readonly';
import { Vector3Readonly } from './vector3_readonly';
import { Vector3 } from './vector3';

/** A quaternion. */
export class Quaternion extends QuaternionReadonly {
	/** Sets the *w* component. */
	setW(w: number): void {
		this._m[0] = w;
	}

	/** Sets the *x* component. */
	setX(x: number): void {
		this._m[1] = x;
	}

	/** Sets the *y* component. */
	setY(y: number): void {
		this._m[2] = y;
	}

	/** Sets the *z* component. */
	setZ(z: number): void {
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
		this._m[1] = sinHalfAngle * axis.x;
		this._m[2] = sinHalfAngle * axis.y;
		this._m[3] = sinHalfAngle * axis.z;
	}

	/** Sets *this* to the quaterion represented by the pitch (*x*), yaw (*y*), and roll (*z*) rotations. The order of application is *x*, *y*, then *z*. */
	setFromEulerAngles(x: number, y: number, z: number): void {
		const cx = Math.cos(x * 0.5);
		const sx = Math.sin(x * 0.5);
		const cy = Math.cos(y * 0.5);
		const sy = Math.sin(y * 0.5);
		const cz = Math.cos(z * 0.5);
		const sz = Math.sin(z * 0.5);
		this._m[0] = cz * cy * cx + sz * sy * sx;
		this._m[1] = cz * cy * sx - sz * sy * cx;
		this._m[2] = cz * sy * cx + sz * cy * sx;
		this._m[3] = sz * cy * cx - cz * sy * sx;
	}

	/** Sets *this* to the quaternion represented by a rotation from *a* to *b*, which should be normalized. */
	setFromVectorRotation(a: Vector3Readonly, b: Vector3Readonly): void {
		this._m[0] = 1 + a.dot(b);
		if (this._m[0] !== 0) {
			Quaternion._tempVector3.cross(a, b);
		}
		else {
			Quaternion._tempVector3.perp(a);
		}
		this._m[1] = Quaternion._tempVector3.x;
		this._m[2] = Quaternion._tempVector3.y;
		this._m[3] = Quaternion._tempVector3.z;
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

	/** An internal temp vector for Quaternion. */
	private static _tempVector3 = new Vector3();

	// Temporaries to use.
	static temp0 = new Quaternion();
	static temp1 = new Quaternion();
	static temp2 = new Quaternion();
	static temp3 = new Quaternion();
	static temp4 = new Quaternion();
	static temp5 = new Quaternion();
	static temp6 = new Quaternion();
	static temp7 = new Quaternion();
}
