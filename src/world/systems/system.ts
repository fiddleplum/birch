import { Component } from '../components/component';
import { World } from '../internal';
import { EventQueue, Engine } from '../../internal';

/*
Each system has its own queue.
There is an events class in world.
  It has an addEvent function that the components have access to.
    It adds the event to each system's queue registered for that event type.
  It has a registerSystem(eventType), which registers a system for that event type.
The events are not processed right when received, but only in the system update functions.

--

If an entity has a frame component but not a model component, and the position changes,
  should the position-changed event be sent to the update-uniforms system?
  If yes, then the update-uniforms system would check to see if the entity also has a model,
    or it would already have a set of entities with both a frame and model and see if the
    event's entity is in the set.
  If no, that means the events class would need to know which systems are connected to which
	bags of objects. This is too cumborsome.

*/

/** The base class for all systems. */
export abstract class System {
	/** Called when a system receives an event it was listening for. */
	abstract processEvent(component: Component, eventType: symbol): void;

	/** Constructs the system. */
	constructor(world: World) {
		this._world = world;
	}

	/** Destroys the system. */
	destroy(): void {
	}

	/** Gets the engine as a shortcut. */
	get engine(): Engine {
		return this.world.engine;
	}

	/** Gets the world that contains this. */
	get world(): World {
		return this._world;
	}

	/** Processes the events in the queue. */
	processEventsInQueue(): void {
		for (let i = 0, l = this._numEvents; i < l; i++) {
			const event = this._events[i];
			this.processEvent(event.component as Component, event.type);
		}
		this._numEvents = 0;
	}

	/** Adds an event. Only called by the event system. */
	addEvent(component: Component, type: symbol): void {
		// We've hit the maximum number of events, so double the capacity.
		if (this._numEvents === this._events.length) {
			for (let i = this._numEvents; i < Math.max(8, this._numEvents * 2); i++) {
				this._events.push(new EventQueue.Event());
			}
		}
		// Setup the event.
		const event = this._events[this._numEvents];
		event.component = component;
		event.type = type;
		this._numEvents += 1;
	}

	/** The world that contains this. */
	private _world: World;

	/** The events in the event queue. The length of the array is the capacity, not the number of events. */
	private _events: EventQueue.Event[] = [];

	/** The number of events in the queue. */
	private _numEvents: number = 0;
}
