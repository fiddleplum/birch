/** A readonly 4-by-4 matrix. */
export class Matrix44Readonly {
	/** The components in column-major order. */
	protected _m: number[];

	/** The identity matrix. */
	static Identity = new Matrix44Readonly(
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1);

	/** The constructor. The arguments are in row-major order so that they can be written nicer. Defaults to the identity matrix. */
	constructor(
		m00 = 1, m01 = 0, m02 = 0, m03 = 0,
		m10 = 0, m11 = 1, m12 = 0, m13 = 0,
		m20 = 0, m21 = 0, m22 = 1, m23 = 0,
		m30 = 0, m31 = 0, m32 = 0, m33 = 1) {
		this._m = [
			m00, m10, m20, m30,
			m01, m11, m21, m31,
			m02, m12, m22, m32,
			m03, m13, m23, m33];
	}

	/** Gets *this* as a string. */
	toString(): string {
		return ('[' +
			'[' + this._m[0] + ', ' + this._m[4] + ', ' + this._m[8] + ', ' + this._m[12] + '], ' +
			'[' + this._m[1] + ', ' + this._m[5] + ', ' + this._m[9] + ', ' + this._m[13] + '], ' +
			'[' + this._m[2] + ', ' + this._m[6] + ', ' + this._m[10] + ', ' + this._m[14] + '], ' +
			'[' + this._m[3] + ', ' + this._m[7] + ', ' + this._m[11] + ', ' + this._m[15] + ']]');
	}

	/** Gets the component at the *row* and *column*. */
	get(row: number, column: number): number {
		return this._m[column * 4 + row];
	}

	/** Gets the underlying array, which is column-major. */
	get array(): readonly number[] {
		return this._m;
	}
}
