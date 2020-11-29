import { Component, Entity } from '../internal';
import { Matrix44, Matrix44Readonly } from '../../internal';
import { Transforms } from '../../utils/tranforms';

/** The camera component. */
export class CameraComponent extends Component {
	constructor(entity: Entity) {
		super(entity);

		// Initialize the transforms.
		Transforms.localToNDCPerspective(this._localToNDC, this._fov, this._aspectRatio, this._near, this._far, false);
		Transforms.ndcToLocalPerspective(this._ndcToLocal, this._fov, this._aspectRatio, this._near, this._far, false);
	}

	/** Gets the aspect ratio. */
	get aspectRatio(): number {
		return this._aspectRatio;
	}

	/** Sets the aspect ratio. */
	setAspectRatio(aspectRatio: number): void {
		if (this._aspectRatio !== aspectRatio) {
			this._localToNDCDirty = this._ndcToLocalDirty = true;
			this._aspectRatio = aspectRatio;
			this.sendEvent(CameraComponent.AspectRatioChanged);
		}
	}

	/** Gets the near clipping distance. */
	get near(): number {
		return this._near;
	}

	/** Sets the near clipping distance. */
	setNear(near: number): void {
		if (this._near !== near) {
			this._localToNDCDirty = this._ndcToLocalDirty = true;
			this._near = near;
			this.sendEvent(CameraComponent.NearChanged);
		}
	}

	/** Gets the far clipping distance. */
	get far(): number {
		return this._far;
	}

	/** Sets the far clipping distance. */
	setFar(far: number): void {
		if (this._far !== far) {
			this._localToNDCDirty = this._ndcToLocalDirty = true;
			this._far = far;
			this.sendEvent(CameraComponent.FarChanged);
		}
	}

	/** Gets the field of view. */
	get fov(): number {
		return this._fov;
	}

	/** Sets the field of view. */
	setFov(fov: number): void {
		if (this._fov !== fov) {
			this._localToNDCDirty = this._ndcToLocalDirty = true;
			this._fov = fov;
			this.sendEvent(CameraComponent.FovChanged);
		}
	}

	/** Gets the local to NDC transform. */
	get localToNDC(): Matrix44Readonly {
		if (this._localToNDCDirty) {
			Transforms.localToNDCPerspective(this._localToNDC, this._fov, this._aspectRatio, this._near, this._far, true);
			this._localToNDCDirty = false;
		}
		return this._localToNDC;
	}

	/** Gets the NDC to local transform. */
	get ndcToLocal(): Matrix44Readonly {
		if (this._ndcToLocalDirty) {
			Transforms.ndcToLocalPerspective(this._ndcToLocal, this._fov, this._aspectRatio, this._near, this._far, true);
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
	private _localToNDC: Matrix44 = new Matrix44();

	/** Whether or not the local to NDC transform is dirty. */
	private _localToNDCDirty: boolean = true;

	/** The NDC to local transform. */
	private _ndcToLocal: Matrix44 = new Matrix44();

	/** Whether or not the NDC to local transform is dirty. */
	private _ndcToLocalDirty: boolean = true;

	/** The event sent when the fov has changed. */
	static FovChanged = Symbol('FOVChanged');

	/** The event sent when the fov has changed. */
	static NearChanged = Symbol('NearChanged');

	/** The event sent when the fov has changed. */
	static FarChanged = Symbol('FarChanged');

	/** The event sent when the fov has changed. */
	static AspectRatioChanged = Symbol('AspectRatioChanged');
}
