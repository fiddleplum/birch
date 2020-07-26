import { Controller } from './controller';

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

	/** Gets the number of gamepads. */
	getNumGamepads(): number {
		return this._gamepads.size;
	}

	/** The 'gamepadconnected' event handler. */
	private _gamepadConnected(event: GamepadEvent): void {
		console.log('Gamepad connected', event.gamepad);
		this._gamepads.set(event.gamepad.index, new Controller(event.gamepad));
	}

	/** The 'gamepaddisconnected' event handler. */
	private _gamepadDisconnected(event: GamepadEvent): void {
		console.log('Gamepad disconnected', event.gamepad);
		this._gamepads.delete(event.gamepad.index);
	}

	/** The 'gamepadconnected' bound event handler. */
	private _gamepadConnectedBound: (event: GamepadEvent) => void;

	/** The 'gamepaddisconnected' bound event handler. */
	private _gamepadDisconnectedBound: (event: GamepadEvent) => void;

	/** The currently connected gamepads. */
	private _gamepads: Map<number, Controller> = new Map();
}
