import { Component, FrameComponent, ModelComponent, System, World } from '../internal';

export class FrameModelSystem extends System {
	/** Constructs the frame-model system. */
	constructor(world: World) {
		super(world);

		this.engine.eventQueue.subscribeToEvent(this, FrameComponent.PositionChanged);
		this.engine.eventQueue.subscribeToEvent(this, FrameComponent.OrientationChanged);
	}

	/** Destroys the frame-model system. */
	destroy(): void {
		this.engine.eventQueue.unsubscribeFromEvent(this, FrameComponent.PositionChanged);
		this.engine.eventQueue.unsubscribeFromEvent(this, FrameComponent.OrientationChanged);
	}

	/** Process any events. */
	processEvent(component: Component, eventType: symbol): void {
		if (eventType === FrameComponent.PositionChanged || eventType === FrameComponent.OrientationChanged) {
			const frameComponent = component as FrameComponent;
			const numModelComponents = component.entity.components.getNumItemsOfType(ModelComponent);
			for (let i = 0; i < numModelComponents; i++) {
				const modelComponent = component.entity.components.getByType(ModelComponent, i) as ModelComponent;
				modelComponent.model.uniforms.setUniform('modelMatrix', frameComponent.localToWorld.array);
			}
		}
	}
}
