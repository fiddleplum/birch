import { Component } from '../internal';
import { Vector3, Vector3Readonly, Quaternion, QuaternionReadonly,
	Matrix44, Matrix44Readonly, Transforms } from '../../internal';

/** The frame component. */
export class FrameComponent extends Component {
	/** Gets the position. */
	get position(): Vector3Readonly {
		return this._position;
	}

	/** Sets the position. */
	setPosition(position: Vector3Readonly): void {
		if (!this._position.equals(position)) {
			this._position.copy(position);
			this._localToWorldDirty = this._worldToLocalDirty = true;
			this.sendEvent(FrameComponent.PositionChanged);
		}
	}

	/** Gets the orientation. */
	get orientation(): QuaternionReadonly {
		return this._orientation;
	}

	/** Sets the orientation. */
	setOrientation(orientation: QuaternionReadonly): void {
		if (!this._orientation.equals(orientation)) {
			this._orientation.copy(orientation);
			this._localToWorldDirty = this._worldToLocalDirty = true;
			this.sendEvent(FrameComponent.OrientationChanged);
		}
	}

	/** Gets the local to world transform. */
	get localToWorld(): Matrix44Readonly {
		if (this._localToWorldDirty) {
			Transforms.localToWorld(this._localToWorld, this._position, this._orientation);
			this._localToWorldDirty = false;
		}
		return this._localToWorld;
	}

	/** Gets the world to local transform. */
	get worldToLocal(): Matrix44Readonly {
		if (this._worldToLocalDirty) {
			Transforms.worldToLocal(this._worldToLocal, this._position, this._orientation);
			this._worldToLocalDirty = false;
		}
		return this._worldToLocal;
	}

	/** The position. */
	private _position: Vector3 = new Vector3();

	/** The orientation. */
	private _orientation: Quaternion = new Quaternion();

	/** The local to world transform. */
	private _localToWorld: Matrix44 = new Matrix44();

	/** Whether or not the local to world transform is dirty. */
	private _localToWorldDirty: boolean = false;

	/** The world to local transform. */
	private _worldToLocal: Matrix44 = new Matrix44();

	/** Whether or not the world to local transform is dirty. */
	private _worldToLocalDirty: boolean = false;

	/** The event sent when the position has changed. */
	static PositionChanged = Symbol('PositionChanged');

	/** The event sent when the orientation has changed. */
	static OrientationChanged = Symbol('OrientationChanged');
}
