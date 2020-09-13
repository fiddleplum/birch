import { Component, FrameComponent, ModelComponent, Entity, System, World } from '../internal';

export class FrameModelSystem extends System {
	/** Constructs the frame-model system. */
	constructor(world: World) {
		super(world);

		this.monitorComponentTypes([FrameComponent]);
	}

	/** Process any events. */
	processEvent(component: Component, event: symbol): void {
		if (event === Entity.ComponentCreated) {
			this.subscribeToEvents(component);
			this._updateModels(component as FrameComponent);
		}
		else if (event === Component.ComponentDestroyed) {
			this.unsubscribeFromEvents(component);
		}
		else {
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
