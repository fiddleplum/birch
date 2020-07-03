import { Component, FrameComponent, ModelComponent, System, World } from '../../internal';

export class ModelSystem extends System {
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
			const numModelComponents = component.entity.getNumComponentsOfType(ModelComponent);
			for (let i = 0; i < numModelComponents; i++) {
				const modelComponent = component.entity.getComponent(ModelComponent, i) as ModelComponent;
				modelComponent.model.uniformsFunction
			}
		}
	}
}
