import { Renderer } from './render/renderer';

export class Game {
	constructor(canvas: HTMLCanvasElement) {
		this._renderer = new Renderer(canvas, true);

		// Run the game.
		this._running = true;
		this._runBound = this._run.bind(this);
		this._run();
	}

	private _destroy(): void {
		this._renderer.destroy();
	}

	private _run(): void {
		if (!this._running) {
			this._destroy();
			return;
		}
		requestAnimationFrame(this._runBound);
	}

	// Running
	private _running: boolean = false;
	private _runBound: () => void;

	// Systems
	private _renderer: Renderer;
}
