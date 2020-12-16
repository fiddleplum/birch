import { QuaternionReadonly } from './quaternion_readonly';
import { Vector3Readonly } from './vector3_readonly';
import { Vector3 } from './vector3';
import Pool from './pool';

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

	/** Sets *this* to the quaternion that represents an orientation frame given by at least two axes, the other being undefined.
	 * The given axes must be orthonormal. */
	setFromAxes(xAxis: Vector3 | undefined, yAxis: Vector3 | undefined, zAxis: Vector3 | undefined): void {
		if (xAxis === undefined && yAxis !== undefined && zAxis !== undefined) {
			xAxis = Quaternion._tempVector3;
			xAxis.cross(yAxis, zAxis);
		}
		else if (yAxis === undefined && zAxis !== undefined && xAxis !== undefined) {
			yAxis = Quaternion._tempVector3;
			yAxis.cross(zAxis, xAxis);
		}
		else if (zAxis === undefined && xAxis !== undefined && yAxis !== undefined) {
			zAxis = Quaternion._tempVector3;
			zAxis.cross(xAxis, yAxis);
		}
		else {
			throw new Error('Exactly two of the axes must be defined.');
		}
		const tr = xAxis.x + yAxis.y + zAxis.z;
		if (tr > 0) {
			const S = Math.sqrt(tr + 1.0) * 2; // S = 4 * this._m[0]
			this._m[0] = 0.25 * S;
			this._m[1] = (yAxis.z - zAxis.y) / S;
			this._m[2] = (zAxis.x - xAxis.z) / S;
			this._m[3] = (xAxis.y - yAxis.x) / S;
		}
		else if ((xAxis.x > yAxis.y) && (xAxis.x > zAxis.z)) {
			const S = Math.sqrt(1 + xAxis.x - yAxis.y - zAxis.z) * 2; // S = 4 * this._m[1]
			this._m[0] = (yAxis.z - zAxis.y) / S;
			this._m[1] = 0.25 * S;
			this._m[2] = (yAxis.x + xAxis.y) / S;
			this._m[3] = (zAxis.x + xAxis.z) / S;
		}
		else if (yAxis.y > zAxis.z) {
			const S = Math.sqrt(1 + yAxis.y - zAxis.z - xAxis.x) * 2; // S = 4 * this._m[2]
			this._m[0] = (zAxis.x - xAxis.z) / S;
			this._m[1] = (yAxis.x + xAxis.y) / S;
			this._m[2] = 0.25 * S;
			this._m[3] = (zAxis.y + yAxis.z) / S;
		}
		else {
			const S = Math.sqrt(1 + zAxis.z - xAxis.x - yAxis.y) * 2; // S = 4 * this._m[3]
			this._m[0] = (xAxis.y - yAxis.x) / S;
			this._m[1] = (zAxis.x + xAxis.z) / S;
			this._m[2] = (zAxis.y + yAxis.z) / S;
			this._m[3] = 0.25 * S;
		}
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

	/** Sets *this* to (the inverse of quaternion *a*) * quaternion *b*. */
	multInverseL(a: Quaternion, b: Quaternion): void {
		const w = a._m[0] * b._m[0] + a._m[1] * b._m[1] + a._m[2] * b._m[2] + a._m[3] * b._m[3];
		const x = a._m[0] * b._m[1] - a._m[1] * b._m[0] - a._m[2] * b._m[3] + a._m[3] * b._m[2];
		const y = a._m[0] * b._m[2] + a._m[1] * b._m[3] - a._m[2] * b._m[0] - a._m[3] * b._m[1];
		const z = a._m[0] * b._m[3] - a._m[1] * b._m[2] + a._m[2] * b._m[1] - a._m[3] * b._m[0];
		this.set(w, x, y, z);
	}

	/** Sets *this* to quaternion *a* * (the inverse of quaternion *b*). */
	multInverseR(a: Quaternion, b: Quaternion): void {
		const w = +a._m[0] * b._m[0] + a._m[1] * b._m[1] + a._m[2] * b._m[2] + a._m[3] * b._m[3];
		const x = -a._m[0] * b._m[1] + a._m[1] * b._m[0] - a._m[2] * b._m[3] + a._m[3] * b._m[2];
		const y = -a._m[0] * b._m[2] + a._m[1] * b._m[3] + a._m[2] * b._m[0] - a._m[3] * b._m[1];
		const z = -a._m[0] * b._m[3] - a._m[1] * b._m[2] + a._m[2] * b._m[1] + a._m[3] * b._m[0];
		this.set(w, x, y, z);
	}

	/** Sets *this* to quaternion *a*, with its rotation angle multiplied by *b*. */
	scaleAngle(a: Quaternion, b: number): void {
		const halfAngle = Math.acos(a._m[0]);
		const sinHalfAngle = Math.sin(halfAngle);
		if (sinHalfAngle === 0) {
			this.copy(a);
			return;
		}
		const sinHalfAngleB = Math.sin(halfAngle * b);
		this._m[0] = Math.cos(halfAngle * b);
		this._m[1] = a._m[1] / sinHalfAngle * sinHalfAngleB;
		this._m[2] = a._m[2] / sinHalfAngle * sinHalfAngleB;
		this._m[3] = a._m[3] / sinHalfAngle * sinHalfAngleB;
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

	/** Sets *this* to be spherically interpolated between *a* and *b* by the factor *u*. The parameter *u* is not clamped. */
	slerp(a: Quaternion, b: Quaternion, u: number): void {
		let dot = a._m[0] * b._m[0] + a._m[1] * b._m[1] + a._m[2] * b._m[2] + a._m[3] * b._m[3];
		let f = 1;
		if (dot < 0.0) {
			f = -1;
			dot = -dot;
		}
		if (dot <= 0.9995) {
			const angle = Math.acos(dot);
			const A = f * Math.sin((1.0 - u) * angle) / Math.sin(angle);
			const B = Math.sin(u * angle) / Math.sin(angle);
			this._m[0] = A * a._m[0] + B * b._m[0];
			this._m[1] = A * a._m[1] + B * b._m[1];
			this._m[2] = A * a._m[2] + B * b._m[2];
			this._m[3] = A * a._m[3] + B * b._m[3];
		}
		else { // too small, so lerp
			const A = f * (1.0 - u);
			const B = u;
			this._m[0] = A * a._m[0] + B * b._m[0];
			this._m[1] = A * a._m[1] + B * b._m[1];
			this._m[2] = A * a._m[2] + B * b._m[2];
			this._m[3] = A * a._m[3] + B * b._m[3];
			this.normalize(this);
		}
	}

	/** An internal temp vector for Quaternion. */
	private static _tempVector3 = new Vector3();

	/** Pool for temporary quaternions. */
	static pool = new Pool(Quaternion);
}
