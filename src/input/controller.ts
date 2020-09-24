export class Controller {
	/** Constructs the controller. */
	constructor(gamepad: Gamepad) {
		/** The gamepad. */
		this._gamepad = gamepad;

		// Set the initial status of the buttons.
		for (let i = 0; i < this._gamepad.buttons.length; i++) {
			this._buttons.push(this._gamepad.buttons[i].value);
		}
	}

	/** Gets the value of the *index* button. 0 means unpressed, 1 means fully pressed. */
	button(index: number): number {
		return this._gamepad.buttons[index].value;
	}

	/** Gets the value of the *index* axis, ranging from -1 to +1. */
	axis(index: number): number {
		return this._gamepad.axes[index];
	}

	/** Adds a callback to be called when a button has changed. */
	addButtonCallback(callback: (controllerIndex: number, buttonIndex: number, value: number) => void): void {
		this._callbacks.push(callback);
	}

	/** Removes a callback to be called when a button has changed. */
	removeButtonCallback(callback: (controllerIndex: number, buttonIndex: number, value: number) => void): void {
		for (let i = 0; i < this._callbacks.length; i++) {
			if (callback === this._callbacks[i]) {
				this._callbacks.splice(i);
				break;
			}
		}
	}

	/** Updates the controller, sending button events to any listeners. */
	update(): void {
		for (let buttonIndex = 0; buttonIndex < this._gamepad.buttons.length; buttonIndex++) {
			if (this._buttons[buttonIndex] !== this._gamepad.buttons[buttonIndex].value) {
				this._buttons[buttonIndex] = this._gamepad.buttons[buttonIndex].value;
				for (let j = 0; j < this._callbacks.length; j++) {
					this._callbacks[j](this._gamepad.index, buttonIndex, this._buttons[buttonIndex]);
				}
			}
		}
	}

	/** The browser gamepad object. */
	private _gamepad: Gamepad;

	/** The current buttons state. */
	private _buttons: number[] = [];

	/** The button callbacks. */
	private _callbacks: ((controllerIndex: number, buttonIndex: number, value: number) => void)[] = [];
}
