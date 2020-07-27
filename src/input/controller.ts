export class Controller {
	/** Constructs the controller. */
	constructor(gamepad: Gamepad) {
		this._gamepad = gamepad;
	}

	/** Gets the value of the *index* button. 0 means unpressed, 1 means fully pressed. */
	button(index: number): number {
		return this._gamepad.buttons[index].value;
	}

	/** Gets the value of the *index* axis, ranging from -1 to +1. */
	axis(index: number): number {
		return this._gamepad.axes[index];
	}

	/** The browser gamepad object. */
	private _gamepad: Gamepad;
}
