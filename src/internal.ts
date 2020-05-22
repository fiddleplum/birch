export * from './utils/immutable';
export * from './utils/quaternion';
export * from './utils/vector2';
export * from './utils/vector3';

import { Immutable } from './utils/immutable';
import { Vector3 } from './utils/vector3';
import { Quaternion } from './utils/quaternion';

export function f(): void {
	const x: Immutable<Quaternion> = new Quaternion();

	x.set(1, 0, 0, 0);

	const y = x.toString();

	const z: Vector3 = new Vector3();

	x.setAxisAngle(z, 3);
	y.x = 4;
}
