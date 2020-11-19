/** A base class that produces events. */
export abstract class EventSource {
	/** Destroys the event source. */
	destroy(): void {
		this.sendEvent(EventSource.Destroyed);
	}

	/** Subscribes an event sink to a event source's events.
	 *  If event is undefined, it subscribes to all events. */
	__subscribeToEvents(eventSink: EventSink, event?: symbol): void {
		this._subscriptions.push(new Subscription(eventSink, event));
	}

	/** Unsubscribes an event sink from a event source's events.
	 *  If event is undefined, it will unsubscribe the event sink from all events. */
	__unsubscribeFromEvents(eventSink: EventSink, event?: symbol): void {
		for (let i = 0, l = this._subscriptions.length; i < l; i++) {
			const subscription = this._subscriptions[i];
			if (subscription.eventSink === eventSink && (subscription.event === event || event === undefined)) {
				this._subscriptions.splice(i, 1);
				break;
			}
		}
	}

	/** Sends an event to all subscribed event sinks. */
	protected sendEvent(event: symbol): void {
		for (const subscription of this._subscriptions) {
			if (subscription.event === undefined || subscription.event === event) {
				subscription.eventSink.processEventBase(this, event);
			}
		}
	}

	/** Subscribed event sinks. */
	private _subscriptions: Subscription[] = [];

	/** The event sent when the event source has been destroyed.
	 *  The event source has already been unsubscribed. */
	static Destroyed = Symbol('Destroyed');
}

/** A subscription in an event source. */
class Subscription {
	constructor(eventSink: EventSink, event: symbol | undefined) {
		this.eventSink = eventSink;
		this.event = event;
	}
	eventSink: EventSink;
	event: symbol | undefined;
}

/** A base class that consumes events. */
export abstract class EventSink {
	/** Destroys the event sink. */
	destroy(): void {
		// Unsubscribe from all events.
		for (const eventSource of this._subscribedEventSources) {
			eventSource.__unsubscribeFromEvents(this);
		}
	}

	/** Called when an event sink receives an event to which it was subscribed. */
	processEventBase(eventSource: EventSource, event: symbol): void {
		if (event === EventSource.Destroyed) {
			this._subscribedEventSources.delete(eventSource);
		}
		this.processEvent(eventSource, event);
	}

	/** Called when an event sink receives an event to which it was subscribed. */
	abstract processEvent(eventSource: EventSource, event: symbol): void;

	/** Subscribes to an EventSource's events. */
	protected subscribeToEvents(eventSource: EventSource, event?: symbol): void {
		if (!this._subscribedEventSources.has(eventSource)) {
			eventSource.__subscribeToEvents(this, event);
			this._subscribedEventSources.add(eventSource);
		}
	}

	/** Unsubscribes from an EventSource's events. */
	protected unsubscribeFromEvents(eventSource: EventSource, event?: symbol): void {
		if (this._subscribedEventSources.has(eventSource)) {
			eventSource.__unsubscribeFromEvents(this, event);
			this._subscribedEventSources.delete(eventSource);
		}
	}

	/** The set of subscribed EventSources. */
	private _subscribedEventSources: Set<EventSource> = new Set();
}
