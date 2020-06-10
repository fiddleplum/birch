import { Vector3, Vector3Readonly, Quaternion, QuaternionReadonly, Matrix44, Matrix44Readonly } from '../../internal';

export class Frame {
	get position(): Vector3Readonly {
		return this._position;
	}

	set position(position: Vector3Readonly) {
		this._position.copy(position);
		this._localToWorldDirty = this._worldToLocalDirty = true;
	}

	get orientation(): QuaternionReadonly {
		return this._orientation;
	}

	set orientation(orientation: QuaternionReadonly) {
		this._orientation.copy(orientation);
		this._localToWorldDirty = this._worldToLocalDirty = true;
	}

	get localToWorld(): Matrix44Readonly {
		if (this._localToWorldDirty) {
			this._localToWorld.setFromQuat(this._orientation);
			this._localToWorld.set(0, 3, this._position.x);
			this._localToWorld.set(1, 3, this._position.y);
			this._localToWorld.set(2, 3, this._position.z);
			this._localToWorldDirty = false;
		}
		return this._localToWorld;
	}

	get worldToLocal(): Matrix44Readonly {
		if (this._worldToLocalDirty) {
			const w2l = this._worldToLocal; // Shorter variable name for brevity.
			let t: number;
			w2l.setFromQuat(this._orientation);
			t = w2l.get(1, 0);
			w2l.set(1, 0, w2l.get(0, 1));
			w2l.set(0, 1, t);
			t = w2l.get(2, 0);
			w2l.set(2, 0, w2l.get(0, 2));
			w2l.set(0, 2, t);
			t = w2l.get(1, 2);
			w2l.set(1, 2, w2l.get(2, 1));
			w2l.set(2, 1, t);
			w2l.set(0, 3, - this._position.x * w2l.get(0, 0) - this._position.y * w2l.get(0, 1) - this._position.z * w2l.get(0, 2));
			w2l.set(1, 3, - this._position.x * w2l.get(1, 0) - this._position.y * w2l.get(1, 1) - this._position.z * w2l.get(1, 2));
			w2l.set(2, 3, - this._position.x * w2l.get(2, 0) - this._position.y * w2l.get(2, 1) - this._position.z * w2l.get(2, 2));
			this._worldToLocalDirty = false;
		}
		return this._worldToLocal;
	}

	private _position: Vector3 = new Vector3();
	private _orientation: Quaternion = new Quaternion();
	private _localToWorld: Matrix44 = new Matrix44();
	private _localToWorldDirty: boolean = false;
	private _worldToLocal: Matrix44 = new Matrix44();
	private _worldToLocalDirty: boolean = false;
}
