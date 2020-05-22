import { Matrix44Readonly } from './matrix44_readonly';
import { QuaternionReadonly } from './quaternion_readonly';

/** A 4-by-4 matrix. */
export class Matrix44 extends Matrix44Readonly {
	/** Sets the component at the *row* and *column*. */
	set(row: number, column: number, value: number): void {
		this._m[column * 4 + row] = value;
	}

	/** Sets the components in row-major order. */
	setAll(m00: number, m01: number, m02: number, m03: number,
		m10: number, m11: number, m12: number, m13: number,
		m20: number, m21: number, m22: number, m23: number,
		m30: number, m31: number, m32: number, m33: number): void {
		this._m[0] = m00;
		this._m[1] = m10;
		this._m[2] = m20;
		this._m[3] = m30;
		this._m[4] = m01;
		this._m[5] = m11;
		this._m[6] = m21;
		this._m[7] = m31;
		this._m[8] = m02;
		this._m[9] = m12;
		this._m[10] = m22;
		this._m[11] = m32;
		this._m[12] = m03;
		this._m[13] = m13;
		this._m[14] = m23;
		this._m[15] = m33;
	}

	/** Sets *this* from the quaternion *a*. */
	setFromQuat(a: QuaternionReadonly): void {
		const ii = a.x * a.x;
		const ij = a.x * a.y;
		const ik = a.x * a.z;
		const ir = a.x * a.w;
		const jj = a.y * a.y;
		const jk = a.y * a.z;
		const jr = a.y * a.w;
		const kk = a.z * a.z;
		const kr = a.z * a.w;
		this._m[0] = 1 - 2 * (jj + kk);
		this._m[1] = 2 * (ij + kr);
		this._m[2] = 2 * (ik - jr);
		this._m[3] = 0;
		this._m[4] = 2 * (ij - kr);
		this._m[5] = 1 - 2 * (ii + kk);
		this._m[6] = 2 * (jk + ir);
		this._m[7] = 0;
		this._m[8] = 2 * (ik + jr);
		this._m[9] = 2 * (jk - ir);
		this._m[10] = 1 - 2 * (ii + jj);
		this._m[11] = 0;
		this._m[12] = 0;
		this._m[13] = 0;
		this._m[14] = 0;
		this._m[15] = 1;
	}
}
