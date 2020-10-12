import { Component, Entity, FrameComponent, ModelComponent, System, World } from '../internal';

export class FrameModelSystem extends System {
	/** Constructs the frame-model system. */
	constructor(world: World) {
		super(world);

		this.monitorComponentTypes([FrameComponent, ModelComponent]);
	}

	/** Process any events. */
	processEvent(component: Component, event: symbol): void {
		if (component instanceof FrameComponent) {
			if (event === Entity.ComponentCreated) {
				this.subscribeToEvents(component);
				this._updateModels(component);
			}
			else if (event === Entity.ComponentWillBeDestroyed) {
				this.unsubscribeFromEvents(component);
			}
			else {
				this._updateModels(component);
			}
		}
		else if (component instanceof ModelComponent) {
			if (event === Entity.ComponentCreated) {
				const frameComponent = component.entity.get(FrameComponent);
				if (frameComponent !== undefined) {
					this._updateModel(frameComponent, component);
				}
			}
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
