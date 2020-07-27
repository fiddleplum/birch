import { Controller } from './controller';
import { OrderedMap } from '../utils/ordered_map';

export class Input {
	/** Constructs the input system. */
	constructor() {
		this._gamepadConnectedBound = this._gamepadConnected.bind(this);
		this._gamepadDisconnectedBound = this._gamepadDisconnected.bind(this);

		window.addEventListener('gamepadconnected', this._gamepadConnectedBound);
		window.addEventListener('gamepaddisconnected', this._gamepadDisconnectedBound);
	}

	/** Destroys the input system. */
	destroy(): void {
		window.removeEventListener('gamepadconnected', this._gamepadConnectedBound);
		window.removeEventListener('gamepaddisconnected', this._gamepadDisconnectedBound);
	}

	/** Set the callback for when a controller is connected or disconnected. */
	setControllerConnectedCallback(callback: (index: number, connected: boolean) => void): void {
		this._controllerConnectedCallback = callback;
	}

	/** Gets the controller at the given index. */
	getController(index: number): Controller {
		const controller = this._controllers.get(index);
		if (controller === undefined) {
			throw new Error('Controller ' + index + ' not found.');
		}
		return controller;
	}

	/** Gets the index of the controller with the highest index. If there are no controllers, returns NaN. */
	getHighestControllerIndex(): number {
		return this._highestIndex;
	}

	/** Gets the number of gamepads. */
	getNumControllers(): number {
		return this._controllers.size;
	}

	/** The 'gamepadconnected' event handler. */
	private _gamepadConnected(event: GamepadEvent): void {
		this._controllers.set(event.gamepad.index, new Controller(event.gamepad));
		if (this._highestIndex < event.gamepad.index) {
			this._highestIndex = event.gamepad.index;
		}
		// Call the callback.
		if (this._controllerConnectedCallback !== undefined) {
			this._controllerConnectedCallback(event.gamepad.index, true);
		}
	}

	/** The 'gamepaddisconnected' event handler. */
	private _gamepadDisconnected(event: GamepadEvent): void {
		this._controllers.remove(event.gamepad.index);
		if (event.gamepad.index === this._highestIndex) {
			// This was the highest index, so find a new one.
			this._highestIndex = NaN;
			for (const controllerEntry of this._controllers) {
				if (isNaN(this._highestIndex) || this._highestIndex < controllerEntry.key) {
					this._highestIndex = controllerEntry.key;
				}
			}
		}
		// Call the callback.
		if (this._controllerConnectedCallback !== undefined) {
			this._controllerConnectedCallback(event.gamepad.index, false);
		}
	}

	/** The 'gamepadconnected' bound event handler. */
	private _gamepadConnectedBound: (event: GamepadEvent) => void;

	/** The 'gamepaddisconnected' bound event handler. */
	private _gamepadDisconnectedBound: (event: GamepadEvent) => void;

	/** The currently connected gamepads. */
	private _controllers: OrderedMap<number, Controller> = new OrderedMap();

	/** The highest index of the controllers. */
	private _highestIndex: number = NaN;

	/** The controller connected callback. */
	private _controllerConnectedCallback: ((index: number, connected: boolean) => void) | undefined = undefined;
}
