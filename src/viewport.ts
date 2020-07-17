import { CameraComponent, Render, Vector2, Vector2Readonly, Vector3, Vector3Readonly } from './internal';
import { RectangleReadonly } from './utils/rectangle_readonly';

export class Viewport {
	/** The constructor. Takes a *bounds*. */
	constructor(viewportsElement: HTMLDivElement) {
		// Set the viewports element and renderer.
		this._viewportsElement = viewportsElement;
		// Create the render stage.
		this._stage = renderer.createStage();
		// Create the div element.
		this._divElement = document.createElement('div');
		this._divElement.style.position = 'absolute';
		this._divElement.style.overflow = 'hidden';
		viewportsElement.appendChild(this._divElement);
	}

	/* Destroys the viewport. */
	destroy(): void {
		// Destroy the div element.
		this._viewportsElement.removeChild(this._divElement);
		// Remove the render stage.
		this._renderer.destroyStage(this._stage);
	}

	/** Gets the aspect ratio as the *width* / *height*. */
	get aspectRatio(): number {
		return this._stage.bounds.size.x / this._stage.bounds.size.y;
	}

	/** Gets whether or not the viewport is enabled. */
	get enabled(): boolean {
		return this._enabled;
	}

	/** Sets whether or not the viewport is enabled. */
	set enabled(enabled: boolean) {
		this._enabled = enabled;
		this._divElement.style.display = this._enabled ? '' : 'none';
	}

	/** Gets the z-index. */
	get zIndex(): number {
		return this._zIndex;
	}

	/** Sets the z-index. */
	set zIndex(zIndex: number) {
		this._zIndex = zIndex;
	}

	/** Gets the bounds. */
	get bounds(): RectangleReadonly {
		return this._stage.bounds;
	}

	/** Sets the bounds. */
	set bounds(bounds: RectangleReadonly) {
		this._stage.bounds.copy(bounds);
	}

	clear(color: ColorReadonly): void {
		this._gl.clearColor(color.r, color.g, color.b, color.a);
		this._gl.clear(this._gl.COLOR_BUFFER_BIT);
	}

	/** Converts a normal-space position to a pixel-space position. It ignores the z component. */
	convertNormalSpaceToPixelSpacePosition(pixelPosition: Vector2, normalPosition: Vector3Readonly): void {
		this._stage.convertNormalSpaceToPixelSpacePosition(pixelPosition, normalPosition);
	}

	/** Converts a pixel-space position to a normal-space position. The z component is set to -1. */
	convertPixelSpaceToNormalSpacePosition(normalPosition: Vector3, pixelPosition: Vector2Readonly): void {
		this._stage.convertPixelSpaceToNormalSpacePosition(normalPosition, pixelPosition);
	}

	/** The viewports element, which contains all of the viewport divs. */
	private _viewportsElement: HTMLDivElement;

	/** The div element for the viewport. */
	private _divElement: HTMLDivElement;

	/** Whether or not the viewport is enabled. */
	private _enabled: boolean = true;

	/** The render stage. */
	private _stage: Render.Stage;

	/** The z-index of the viewport. */
	private _zIndex: number = 0;

	/** The camera to be rendered. */
	private _camera: CameraComponent | null = null;
}
