import { Component, FrameComponent, ModelComponent, System, World } from '../internal';

export class FrameModelSystem extends System {
	/** Constructs the frame-model system. */
	constructor(world: World) {
		super(world);

		this.monitorComponentTypes([FrameComponent]);
	}

	/** Process any events. */
	processEvent(component: Component, event: symbol): void {
		if (event === Component.ComponentCreated) {
			this.subscribeToEvents(component);
			this._updateModels(component as FrameComponent);
		}
		else if (event === Component.ComponentDestroyed) {
			this.unsubscribeFromEvents(component);
		}
		else { // Some event from a frame component.
			this._updateModels(component as FrameComponent);
		}
	}

	/** Updates all of the models given a frame component. */
	private _updateModels(frameComponent: FrameComponent): void {
		const modelComponents = frameComponent.entity.getAll(ModelComponent);
		if (modelComponents !== undefined) {
			for (const modelComponent of modelComponents) {
				modelComponent.model.uniforms.setUniform('modelMatrix', frameComponent.localToWorld.array);
			}
		}
	}
}
