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
		}
		else if (event === Component.ComponentDestroyed) {
			this.unsubscribeFromEvents(component);
		}
		else {
			const frameComponent = component as FrameComponent;
			const modelComponents = component.entity.getAll(ModelComponent);
			if (modelComponents !== undefined) {
				for (const modelComponent of modelComponents) {
					modelComponent.model.uniforms.setUniform('modelMatrix', frameComponent.localToWorld.array);
				}
			}
		}
	}
}
