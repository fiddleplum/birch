import { EventSource } from '../../utils/events';
import { Viewport } from '../../viewport';
import { Component, Entity, CameraComponent, FrameComponent, System, World } from '../internal';

export class CameraSystem extends System {
	/** Constructs the system. */
	constructor(world: World) {
		super(world);
	}

	/** Connects a camera entity and a viewport. */
	connectCameraWithViewport(cameraEntity: Entity, viewport: Viewport): void {
		// Get the camera and frame components.
		const cameraComponent = cameraEntity.get(CameraComponent);
		const frameComponent = cameraEntity.get(FrameComponent);
		if (cameraComponent === undefined || frameComponent === undefined) {
			throw new Error('The camera entity must have a camera and frame component.');
		}
		// Check if the viewport is used elsewhere.
		for (const entry of this._cameraViewports) {
			if (entry[1] === viewport) {
				this._cameraViewports.delete(entry[0]);
				break;
			}
		}
		// Add it.
		this._cameraViewports.set(cameraEntity, viewport);
		// Set the viewport bounds changed callback.
		viewport.boundsChangedCallback = this.viewportBoundsChanged.bind(this, cameraEntity);
		// Set the uniforms of the components.
		viewport.stage.uniforms.setUniform('projectionMatrix', cameraComponent.localToNDC.array);
		viewport.stage.uniforms.setUniform('viewMatrix', frameComponent.worldToLocal.array);
		// Subscribe to the components.
		this.subscribeToEvents(cameraComponent);
		this.subscribeToEvents(frameComponent);
	}

	/** Disconnects a camera entity from any viewports. */
	disconnectCameraFromViewport(cameraEntity: Entity): void {
		const viewport = this._cameraViewports.get(cameraEntity);
		if (viewport !== undefined) {
			// Get the camera and frame components.
			const cameraComponent = cameraEntity.get(CameraComponent);
			const frameComponent = cameraEntity.get(FrameComponent);
			// Remove it.
			this._cameraViewports.delete(cameraEntity);
			// Remove the callback.
			viewport.boundsChangedCallback = undefined;
			// Unsubscribe from the components.
			if (cameraComponent !== undefined) {
				this.unsubscribeFromEvents(cameraComponent);
			}
			if (frameComponent !== undefined) {
				this.unsubscribeFromEvents(frameComponent);
			}
		}
	}

	/** Called when the system receives events from the camera or frame components. */
	processEvent(component: Component, event: symbol): void {
		const entity = component.entity;
		const viewport = this._cameraViewports.get(entity);
		if (viewport === undefined) {
			throw new Error('Viewport could not be found.');
		}
		if (event === EventSource.Destroyed) {
			this.disconnectCameraFromViewport(entity);
		}
		else if (component instanceof CameraComponent) {
			viewport.stage.uniforms.setUniform('projectionMatrix', component.localToNDC.array);
		}
		else if (component instanceof FrameComponent) {
			viewport.stage.uniforms.setUniform('viewMatrix', component.worldToLocal.array);
		}
	}

	private viewportBoundsChanged(cameraEntity: Entity, viewport: Viewport): void {
		const cameraComponent = cameraEntity.get(CameraComponent);
		if (cameraComponent !== undefined) {
			const bounds = viewport.bounds;
			cameraComponent.setAspectRatio(bounds.size.x / bounds.size.y);
		}
	}

	/** The camera entity and viewport connections. */
	private _cameraViewports: Map<Entity, Viewport> = new Map();
}
