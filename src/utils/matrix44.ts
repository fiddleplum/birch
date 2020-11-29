import { Matrix44Readonly } from './matrix44_readonly';
import { QuaternionReadonly } from './quaternion_readonly';

/** A 4-by-4 matrix. */
export class Matrix44 extends Matrix44Readonly {
	/** Copies *a* to *this*. */
	copy(a: Matrix44Readonly): void {
		const array = a.array;
		for (let i = 0; i < 16; i++) {
			this._m[i] = array[i];
		}
	}

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

	// Temporaries to use.
	static temp0 = new Matrix44();
	static temp1 = new Matrix44();
	static temp2 = new Matrix44();
	static temp3 = new Matrix44();
	static temp4 = new Matrix44();
	static temp5 = new Matrix44();
	static temp6 = new Matrix44();
	static temp7 = new Matrix44();
}
