import { Component, FrameComponent, ModelComponent, Entity, Engine, System } from '../internal';

export class FrameModelSystem extends System {
	/** Constructs the frame-model system. */
	constructor(engine: Engine) {
		super(engine);

		this.monitorComponentTypes([FrameComponent]);
	}

	/** Process any events. */
	processEvent(component: Component, event: symbol): void {
		if (event === Entity.ComponentCreated) {
			this.subscribeToComponent(component);
		}
		else if (event === Entity.ComponentWillBeDestroyed) {
			this.unsubscribeFromComponent(component);
		}
		else if (event === FrameComponent.PositionChanged || event === FrameComponent.OrientationChanged) {
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
