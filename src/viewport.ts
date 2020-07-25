import { CameraComponent, Render, Vector2, Vector2Readonly, Vector3, Vector3Readonly } from './internal';
import { RectangleReadonly } from './utils/rectangle_readonly';
import { Renderer } from './render/renderer';
import { ColorReadonly } from './utils/color_readonly';

export class Viewport {
	/** The constructor. Takes a *bounds*. */
	constructor(renderer: Render.Renderer, viewportsElement: HTMLDivElement) {
		// Set the viewports element and renderer.
		this._renderer = renderer;
		// Create the render stage.
		this._stage = renderer.createStage();
		// Create the div element.
		this._divElement = document.createElement('div');
		this._divElement.style.position = 'absolute';
		this._divElement.style.overflow = 'hidden';
		viewportsElement.appendChild(this._divElement);
	}

	/** Destroys the viewport. */
	destroy(): void {
		// Destroy the div element.
		this._divElement.remove();
		// Remove the render stage.
		this._renderer.destroyStage(this._stage);
	}

	/** Gets the div element. */
	getDiv(): HTMLDivElement {
		return this._divElement;
	}

	/** Gets the aspect ratio as the *width* / *height*. */
	getAspectRatio(): number {
		return this._divElement.clientWidth / this._divElement.clientHeight;
	}

	/** Sets the clear color. It does not clear if it is undefined. */
	setClearColor(color: ColorReadonly | undefined): void {
		this._stage.setClearColor(color);
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

	/** Gets the bounds. */
	get bounds(): RectangleReadonly {
		return this._stage.bounds;
	}

	/** Updates the bounds of the viewport to reflect the div. */
	updateBounds(): void {
		this._stage.bounds.set(this._divElement.clientLeft, this._divElement.clientTop, this._divElement.clientWidth * devicePixelRatio, this._divElement.clientHeight);
	}

	/** Converts a normal-space position to a pixel-space position. It ignores the z component. */
	convertNormalSpaceToPixelSpacePosition(pixelPosition: Vector2, normalPosition: Vector3Readonly): void {
		this._stage.convertNormalSpaceToPixelSpacePosition(pixelPosition, normalPosition);
	}

	/** Converts a pixel-space position to a normal-space position. The z component is set to -1. */
	convertPixelSpaceToNormalSpacePosition(normalPosition: Vector3, pixelPosition: Vector2Readonly): void {
		this._stage.convertPixelSpaceToNormalSpacePosition(normalPosition, pixelPosition);
	}

	/** The renderer. */
	private _renderer: Renderer;

	/** The div element for the viewport. */
	private _divElement: HTMLDivElement;

	/** Whether or not the viewport is enabled. */
	private _enabled: boolean = true;

	/** The render stage. */
	private _stage: Render.Stage;

	/** The camera to be rendered. */
	private _camera: CameraComponent | null = null;
}
