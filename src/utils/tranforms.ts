import { Matrix44 } from './matrix44';
import { QuaternionReadonly } from './quaternion_readonly';
import { Vector3Readonly } from './vector3_readonly';

export class Transforms {
	/** Sets *matrixOut* to a local-to-world matrix. */
	static localToWorld(matrixOut: Matrix44, position: Vector3Readonly, orientation: QuaternionReadonly): void {
		this.orientation(matrixOut, orientation, false);
		matrixOut.set(0, 3, position.x);
		matrixOut.set(1, 3, position.y);
		matrixOut.set(2, 3, position.z);
	}

	/** Sets *matrixOut* to a world-to-local matrix. */
	static worldToLocal(matrixOut: Matrix44, position: Vector3Readonly, orientation: QuaternionReadonly): void {
		const w2l = matrixOut; // Shorter variable name for brevity.
		this.orientation(w2l, orientation, true);
		w2l.set(0, 3, - position.x * w2l.get(0, 0) - position.y * w2l.get(0, 1) - position.z * w2l.get(0, 2));
		w2l.set(1, 3, - position.x * w2l.get(1, 0) - position.y * w2l.get(1, 1) - position.z * w2l.get(1, 2));
		w2l.set(2, 3, - position.x * w2l.get(2, 0) - position.y * w2l.get(2, 1) - position.z * w2l.get(2, 2));
	}

	/** Sets *matrixOut* to the local-to-ndc using a perspective projection.
	 *  It makes the most widest aspect ratio direction be the field of view.
	 *  If update is true, it sets up only the values that change with the params. */
	static localToNDCPerspective(matrixOut: Matrix44, fov: number, aspectRatio: number, near: number, far: number, update: boolean = false): void {
		if (!update) {
			matrixOut.copy(Matrix44.Identity);
			matrixOut.set(3, 2, -1);
			matrixOut.set(3, 3, 0);
		}
		const tanHalfFOV = Math.tan(fov / 2);
		if (aspectRatio <= 1) {
			matrixOut.set(0, 0, 1 / (tanHalfFOV * aspectRatio));
			matrixOut.set(1, 1, 1 / tanHalfFOV);
		}
		else {
			matrixOut.set(0, 0, 1 / tanHalfFOV);
			matrixOut.set(1, 1, aspectRatio / tanHalfFOV);
		}
		if (isFinite(far)) {
			const nmf = near - far;
			matrixOut.set(2, 2, (near + far) / nmf);
			matrixOut.set(2, 3, (2 * near * far) / nmf);
		}
		else {
			matrixOut.set(2, 2, Number.EPSILON - 1);
			matrixOut.set(2, 3, (Number.EPSILON - 1) * 2 * near);
		}
	}

	/** Sets *matrixOut* to the ndc-to-local using a perspective projection.
	 *  It makes the most widest aspect ratio direction be the field of view. */
	static ndcToLocalPerspective(matrixOut: Matrix44, fov: number, aspectRatio: number, near: number, far: number, update: boolean): void {
		if (!update) {
			matrixOut.copy(Matrix44.Identity);
			matrixOut.set(2, 2, 0);
			matrixOut.set(2, 3, -1);
		}
		const tanHalfFOV = Math.tan(fov / 2);
		if (aspectRatio >= 1) {
			matrixOut.set(0, 0, tanHalfFOV * aspectRatio);
			matrixOut.set(1, 1, tanHalfFOV);
		}
		else {
			matrixOut.set(0, 0, tanHalfFOV);
			matrixOut.set(1, 1, tanHalfFOV / aspectRatio);
		}
		if (isFinite(far)) {
			const nf2 = 2 * near * far;
			matrixOut.set(3, 2, (near - far) / nf2);
			matrixOut.set(3, 3, (near + far) / nf2);
		}
		else {
			const n2 = 2 * near * (Number.EPSILON - 1);
			matrixOut.set(3, 2, 1 / n2);
			matrixOut.set(3, 3, -1 / n2);
		}
	}

	/** Sets *matrixOut* to the rotation represented by the quaternion. */
	private static orientation(matrixOut: Matrix44, orientation: QuaternionReadonly, inverse: boolean): void {
		const xx = orientation.x * orientation.x;
		const xy = orientation.x * orientation.y;
		const xz = orientation.x * orientation.z;
		const xw = orientation.x * orientation.w * (inverse ? -1 : 1);
		const yy = orientation.y * orientation.y;
		const yz = orientation.y * orientation.z;
		const yw = orientation.y * orientation.w * (inverse ? -1 : 1);
		const zz = orientation.z * orientation.z;
		const zw = orientation.z * orientation.w * (inverse ? -1 : 1);
		matrixOut.setAll(
			1 - 2 * (yy + zz),	2 * (xy - zw),		2 * (xz + yw),		0,
			2 * (xy + zw),		1 - 2 * (xx + zz),	2 * (yz - xw),		0,
			2 * (xz - yw),		2 * (yz + xw),		1 - 2 * (xx + yy),	0,
			0,					0,					0,					1);
	}
}
