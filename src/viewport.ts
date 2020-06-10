import { RectangleReadonly } from './utils/rectangle_readonly';
import { Rectangle } from './utils/rectangle';

export class Viewport {
	/** The constructor. Takes a *bounds*. */
	constructor(bounds: RectangleReadonly) {
		this._bounds.copy(bounds);
	}

	/** Gets the aspect ratio as the *width* / *height*. */
	get aspectRatio(): number {
		return this._bounds.size.x / this._bounds.size.y;
	}

	// /** Renders the attached camera. */
	// render(): void {

	// }

	private _bounds: Rectangle = new Rectangle(0, 0, 0, 0, true);
	// private _camera: Camera | null;
}
