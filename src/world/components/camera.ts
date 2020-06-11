import { Matrix44, Matrix44Readonly } from '../../internal';

/** The camera component. */
export class Camera {
	/** Gets the aspect ratio. */
	get aspectRatio(): number {
		return this._aspectRatio;
	}

	/** Sets the aspect ratio. */
	set aspectRatio(aspectRatio: number) {
		this._aspectRatio = aspectRatio;
		this._localToNDCDirty = this._ndcToLocalDirty = true;
	}

	/** Gets the near clipping distance. */
	get near(): number {
		return this._near;
	}

	/** Sets the near clipping distance. */
	set near(near) {
		this._near = near;
		this._localToNDCDirty = this._ndcToLocalDirty = true;
	}

	/** Gets the far clipping distance. */
	get far(): number {
		return this._far;
	}

	/** Sets the far clipping distance. */
	set far(far) {
		this._far = far;
		this._localToNDCDirty = this._ndcToLocalDirty = true;
	}

	/** Gets the field of view. */
	get fov(): number {
		return this._fov;
	}

	/** Sets the field of view. */
	set fov(fov) {
		this._fov = fov;
		this._localToNDCDirty = this._ndcToLocalDirty = true;
	}

	/** Gets the local to NDC transform. */
	get localToNDC(): Matrix44Readonly {
		if (this._localToNDCDirty) {
			const tanHalfFOV = Math.tan(this._fov / 2);
			if (this._aspectRatio >= 1) {
				this._localToNDC.set(0, 0, 1 / (tanHalfFOV * this.aspectRatio));
				this._localToNDC.set(1, 1, 1 / tanHalfFOV);
			}
			else {
				this._localToNDC.set(0, 0, 1 / tanHalfFOV);
				this._localToNDC.set(1, 1, this.aspectRatio / tanHalfFOV);
			}
			const nmf = this._near - this._far;
			this._localToNDC.set(2, 2, (this._near + this._far) / nmf);
			this._localToNDC.set(2, 3, (2 * this._near * this._far) / nmf);
			this._localToNDCDirty = false;
		}
		return this._localToNDC;
	}

	/** Gets the NDC to local transform. */
	get ndcToLocal(): Matrix44Readonly {
		if (this._ndcToLocalDirty) {
			const tanHalfFOV = Math.tan(this._fov / 2);
			if (this._aspectRatio >= 1) {
				this._ndcToLocal.set(0, 0, tanHalfFOV * this.aspectRatio);
				this._ndcToLocal.set(1, 1, tanHalfFOV);
			}
			else {
				this._ndcToLocal.set(0, 0, tanHalfFOV);
				this._ndcToLocal.set(1, 1, tanHalfFOV / this.aspectRatio);
			}
			const nf2 = 2 * this._near * this._far;
			this._ndcToLocal.set(3, 2, (this._near - this._far) / nf2);
			this._ndcToLocal.set(3, 3, (this._near + this._far) / nf2);
			this._ndcToLocalDirty = false;
		}
		return this._ndcToLocal;
	}

	/** The aspect ratio. */
	private _aspectRatio: number = 1;

	/** The near clipping distance. */
	private _near: number = 1;

	/** The far clipping distance. */
	private _far: number = 10;

	/** The field of view. */
	private _fov: number = 90;

	/** The local to NDC transform. */
	private _localToNDC: Matrix44 = new Matrix44(
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 0, 1,
		0, 0, -1, 0
	);

	/** Whether or not the local to NDC transform is dirty. */
	private _localToNDCDirty: boolean = true;

	/** The NDC to local transform. */
	private _ndcToLocal: Matrix44 = new Matrix44(
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 0, -1,
		0, 0, 1, 0
	);

	/** Whether or not the NDC to local transform is dirty. */
	private _ndcToLocalDirty: boolean = true;
}
