import { Camera, Game, Num, Rectangle, RectangleReadonly, Vector2, Vector2Readonly, Vector3, Vector3Readonly } from './internal';

export class Viewport {
	/** The constructor. Takes a *bounds*. */
	constructor(game: Game) {
		// Set the game.
		this._game = game;

		// Create the div element.
		this._divElement = document.createElement('div');
		this._divElement.style.position = 'absolute';
		this._divElement.style.overflow = 'hidden';
		const viewportsElement = this._game.rootElement.querySelector('viewports') as HTMLDivElement;
		viewportsElement.appendChild(this._divElement);
	}

	destroy(): void {
		const viewportsElement = this._game.rootElement.querySelector('viewports') as HTMLDivElement;
		viewportsElement.removeChild(this._divElement);
	}

	/** Gets the aspect ratio as the *width* / *height*. */
	get aspectRatio(): number {
		return this._bounds.size.x / this._bounds.size.y;
	}

	/** Gets the game. */
	get game(): Game {
		return this._game;
	}

	/** Gets whether or not the viewport is enabled. */
	get enabled(): boolean {
		return this._enabled;
	}

	/** Sets whether or not the viewport is enabled. */
	set enabled(enabled: boolean) {
		this._enabled = enabled;
		this._divElement.style.display = this._enabled ? '' : 'none';
	}

	/** Converts a normal-space position to a pixel-space position. It ignores the z component. */
	convertNormalSpaceToPixelSpacePosition(pixelPosition: Vector2, normalPosition: Vector3Readonly): void {
		pixelPosition.x = Num.lerp(this._bounds.min.x, this._bounds.max.x, (normalPosition.x + 1) / 2);
		pixelPosition.y = Num.lerp(this._bounds.min.y, this._bounds.max.y, (1 - normalPosition.y) / 2);
	}

	/** Converts a pixel-space position to a normal-space position. The z component is set to -1. */
	convertPixelSpaceToNormalSpacePosition(normalPosition: Vector3, pixelPosition: Vector2Readonly): void {
		normalPosition.x = 2 * (pixelPosition.x - this._bounds.min.x) / this._bounds.size.x - 1;
		normalPosition.y = 1 - 2 * (pixelPosition.y - this._bounds.min.y) / this._bounds.size.y;
		normalPosition.z = -1;
	}

	/** Renders the viewport. */
	render(): void {
		// Update the bounds.
		this._bounds.set(this._divElement.offsetLeft, this._divElement.offsetTop,
			this._divElement.offsetWidth, this._divElement.offsetHeight);

		// RENDER THE STAGES HERE
	}

	/** The game. */
	private _game: Game;

	/** The div element for the viewport. */
	private _divElement: HTMLDivElement;

	/** Whether or not the viewport is enabled. */
	private _enabled: boolean = true;

	/** The bounds of the viewport. */
	private _bounds: Rectangle = new Rectangle(0, 0, 0, 0, true);

	/** The camera to be rendered. */
	private _camera: Camera | null = null;
}
