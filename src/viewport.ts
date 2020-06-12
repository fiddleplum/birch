import { RectangleReadonly } from './utils/rectangle_readonly';
import { Rectangle } from './utils/rectangle';
import { Camera } from './world/components/camera';

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

	/** The bounds of the viewport. */
	private _bounds: Rectangle = new Rectangle(0, 0, 0, 0, true);

	/** The camera to be rendered. */
	private _camera: Camera | null = null;
}
