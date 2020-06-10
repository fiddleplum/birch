import { Matrix44, Matrix44Readonly } from '../../internal';

export class Camera {
	get aspectRatio(): number {
		return this._aspectRatio;
	}

	set aspectRatio(aspectRatio: number) {
		this._aspectRatio = aspectRatio;
		this._localToNDCDirty = this._ndcToLocalDirty = true;
	}

	get near(): number {
		return this._near;
	}

	set near(near) {
		this._near = near;
		this._localToNDCDirty = this._ndcToLocalDirty = true;
	}

	get far(): number {
		return this._far;
	}

	set far(far) {
		this._far = far;
		this._localToNDCDirty = this._ndcToLocalDirty = true;
	}

	get fov(): number {
		return this._fov;
	}

	set fov(fov) {
		this._fov = fov;
		this._localToNDCDirty = this._ndcToLocalDirty = true;
	}

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
			this._localToNDCDirty = false;
		}
		return this._localToNDC;
	}

	get ndcToLocal(): Matrix44Readonly {
		if (this._ndcToLocalDirty) {
			this._ndcToLocalDirty = false;
		}
		return this._ndcToLocal;
	}

	/** The aspect ratio. */
	private _aspectRatio: number = 1;

	/** The near distance. */
	private _near: number = 1;

	/** The far distance. */
	private _far: number = 10;

	/** The field of view. */
	private _fov: number = 90;

	/** The local to NDC transform. */
	private _localToNDC: Matrix44 = new Matrix44();

	/** Whether or not the local to NDC transform is dirty. */
	private _localToNDCDirty: boolean = false;

	/** The NDC to local transform. */
	private _ndcToLocal: Matrix44 = new Matrix44();

	/** Whether or not the NDC to local transform is dirty. */
	private _ndcToLocalDirty: boolean = false;
}
