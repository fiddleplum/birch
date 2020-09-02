import { Component, FrameComponent, ModelComponent, Entity, Engine, System } from '../internal';

export class FrameModelSystem extends System {
	/** Constructs the frame-model system. */
	constructor(engine: Engine) {
		super(engine);

		this.monitorComponentTypes([FrameComponent]);
	}

	/** Process any events. */
	processEvent(component: Component, eventType: symbol): void {
		if (eventType === Entity.ComponentAdded) {
			this.subscribeToComponent(component);
		}
		else if (eventType === Entity.ComponentWillBeRemoved) {
			this.unsubscribeFromComponent(component);
		}
		else if (eventType === FrameComponent.PositionChanged || eventType === FrameComponent.OrientationChanged) {
			const frameComponent = component as FrameComponent;
			const modelComponents = component.entity.components.getAllOfType(ModelComponent);
			if (modelComponents !== undefined) {
				for (const modelComponent of modelComponents) {
					modelComponent.model.uniforms.setUniform('modelMatrix', frameComponent.localToWorld.array);
				}
			}
		}
	}
}
