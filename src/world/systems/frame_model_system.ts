import { Component, FrameComponent, ModelComponent, System, World } from '../internal';

export class FrameModelSystem extends System {
	/** Constructs this. */
	constructor(world: World) {
		super(world);

		this.world.eventQueue.subscribeToEvent(this, FrameComponent.Events.PositionChanged);
		this.world.eventQueue.subscribeToEvent(this, FrameComponent.Events.OrientationChanged);
	}

	/** Destroys this. */
	destroy(): void {
		this.world.eventQueue.unsubscribeFromEvent(this, FrameComponent.Events.PositionChanged);
		this.world.eventQueue.unsubscribeFromEvent(this, FrameComponent.Events.OrientationChanged);
	}

	update(): void {
		super.update();
	}

	processEvent(component: Component, eventType: symbol): void {
		if (eventType === FrameComponent.Events.PositionChanged || eventType === FrameComponent.Events.OrientationChanged) {
			const numModelComponents = component.entity.components.getNumItemsOfType(ModelComponent);
			for (let i = 0; i < numModelComponents; i++) {
				// const modelComponent = component.entity.components.getByType(ModelComponent, i);
				// modelComponent.model.uniformsFunction
			}
		}
	}
}
