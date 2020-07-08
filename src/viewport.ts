import { CameraComponent, Render, Vector2, Vector2Readonly, Vector3, Vector3Readonly } from './internal';

export class Viewport {
	/** The constructor. Takes a *bounds*. */
	constructor(viewportsElement: HTMLDivElement, renderer: Render.Renderer) {
		// Set the viewports element and renderer.
		this._viewportsElement = viewportsElement;
		this._renderer = renderer;
		// Create the render stage.
		this._stage = new Render.Stage(renderer.gl);
		renderer.stages.add(this._stage);
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
		this._renderer.stages.remove(this._stage);
		this._stage.destroy();
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

	/** The renderer. */
	private _renderer: Render.Renderer;

	/** The div element for the viewport. */
	private _divElement: HTMLDivElement;

	/** Whether or not the viewport is enabled. */
	private _enabled: boolean = true;

	/** The render stage. */
	private _stage: Render.Stage;

	/** The camera to be rendered. */
	private _camera: CameraComponent | null = null;
}
