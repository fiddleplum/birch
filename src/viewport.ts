import { World, Render, Vector2, Vector2Readonly, Vector3, Vector3Readonly } from './internal';
import { RectangleReadonly } from './utils/rectangle_readonly';
import { ColorReadonly } from './utils/color_readonly';
import { CameraComponent, FrameComponent } from './world/internal';

export class Viewport {
	/** The constructor. Takes a *bounds*. */
	constructor(renderer: Render.Renderer, viewportsElement: HTMLDivElement) {
		// Set the viewports element and renderer.
		this._renderer = renderer;
		// Create the render stage.
		this._stage = renderer.stages.create();
		// Create the div element.
		this._divElement = document.createElement('div');
		this._divElement.style.position = 'absolute';
		this._divElement.style.overflow = 'hidden';
		viewportsElement.appendChild(this._divElement);
		// Creates a uniform block.
		this._stage.uniforms.setUniformTypes([{
			name: 'viewMatrix',
			type: Render.Uniforms.Type.mat4x4
		}, {
			name: 'projectionMatrix',
			type: Render.Uniforms.Type.mat4x4
		}, {
			name: 'renderSize',
			type: Render.Uniforms.Type.vec2
		}]);
	}

	/** Destroys the viewport. */
	destroy(): void {
		// Destroy the div element.
		this._divElement.remove();
		// Remove the render stage.
		this._renderer.stages.destroy(this._stage);
	}

	/** Gets the div element. */
	get div(): HTMLDivElement {
		return this._divElement;
	}

	/** Gets the stage created by this viewport. */
	get stage(): Render.Stage {
		return this._stage;
	}

	/** Gets the camera connected to this viewport. */
	get camera(): World.Entity | undefined {
		return this._cameraEntity;
	}

	/** Sets the camera connected to this viewport. It must have a camera and frame component to work. */
	set camera(camera: World.Entity | undefined) {
		this._cameraEntity = camera;
	}

	/** Gets the aspect ratio as the *width* / *height*. */
	get aspectRatio(): number {
		return this._divElement.clientWidth / this._divElement.clientHeight;
	}

	/** Sets the clear color. It does not clear if it is undefined. */
	set clearColor(color: ColorReadonly | undefined) {
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

	/** Prepares the viewport for a render. */
	prepareForRender(): void {
		// Updates the bounds of the viewport to reflect the div.
		this._stage.bounds.set(this._divElement.clientLeft, this._divElement.clientTop, this._divElement.clientWidth * devicePixelRatio, this._divElement.clientHeight);
		// Set the uniforms.
		if (this._cameraEntity !== undefined) {
			const cameraComponent = this._cameraEntity.getComponent(CameraComponent, 0);
			const frameComponent = this._cameraEntity.getComponent(FrameComponent, 0);
			if (cameraComponent !== undefined && frameComponent !== undefined) {
				cameraComponent.aspectRatio = this._stage.bounds.size.x / this._stage.bounds.size.y;
				this._stage.uniforms.setUniform('viewMatrix', frameComponent.worldToLocal.array);
				this._stage.uniforms.setUniform('projectionMatrix', cameraComponent.localToNDC.array);
				this._stage.uniforms.setUniform('renderSize', this._stage.bounds.size.array);
			}
		}
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
	private _renderer: Render.Renderer;

	/** The div element for the viewport. */
	private _divElement: HTMLDivElement;

	/** Whether or not the viewport is enabled. */
	private _enabled: boolean = true;

	/** The render stage. */
	private _stage: Render.Stage;

	/** The camera to be rendered. */
	private _cameraEntity: World.Entity | undefined = undefined;
}
