import { Component, Entity, FrameComponent, ModelComponent, System, World } from '../internal';

export class FrameModelSystem extends System {
	/** Constructs the frame-model system. */
	constructor(world: World) {
		super(world);

		this.monitorComponentTypes([FrameComponent, ModelComponent]);
	}

	/** Process any events. */
	processEvent(component: Component, event: symbol): void {
		if (event === Entity.ComponentCreated) {
			if (component instanceof FrameComponent) {
				this.subscribeToEvents(component);
				this._updateModels(component as FrameComponent);
			}
			else { // It must be a model component.
				const frameComponent = component.entity.get(FrameComponent);
				if (frameComponent !== undefined) {
					this._updateModel(frameComponent, component as ModelComponent);
				}
			}
		}
		else if (event === Entity.ComponentWillBeDestroyed) {
			if (component instanceof FrameComponent) {
				this.unsubscribeFromEvents(component);
			}
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
				this._updateModel(frameComponent, modelComponent);
			}
		}
	}

	/** Updates the model with the given frame. */
	private _updateModel(frameComponent: FrameComponent, modelComponent: ModelComponent): void {
		modelComponent.model.uniforms.setUniform('modelMatrix', frameComponent.localToWorld.array);
	}
}
