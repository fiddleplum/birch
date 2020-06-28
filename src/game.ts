import { Render, Viewport, World } from './internal';

export class Game {
	constructor(rootElement: HTMLDivElement) {
		// Set and prepare the root element.
		this._rootElement = rootElement;
		this._prepareRootElement();
		// Create the renderer.
		this._renderer = new Render.Renderer(this._rootElement.querySelector('canvas') as HTMLCanvasElement, true);
		// Run the game.
		this._running = true;
		this._runBound = this._run.bind(this);
		this._run();
	}

	/** Gets the root element. */
	get rootElement(): HTMLDivElement {
		return this._rootElement;
	}

	/** Gets the renderer. */
	get renderer(): Render.Renderer {
		return this._renderer;
	}

	/** Stops the game. */
	stop(): void {
		this._running = false;
	}

	/** Adds a viewport. */
	addViewport(index?: number): Viewport {
		const viewportsElement = this._rootElement.querySelector('viewports') as HTMLDivElement;
		const viewport = new Viewport(viewportsElement, this._renderer);
		if (index !== undefined) {
			this._viewports.splice(index, 0, viewport);
		}
		else {
			this._viewports.push(viewport);
		}
		return viewport;
	}

	/** Removes a viewport. */
	removeViewport(viewport: Viewport): void {
		for (let i = 0, l = this._viewports.length; i < l; i++) {
			if (this._viewports[i] === viewport) {
				this._viewports[i].destroy();
				this._viewports.splice(i, 1);
				break;
			}
		}
	}

	/** Destroys the game. */
	private _destroy(): void {
		// Destroys the viewports.
		for (let i = 0, l = this._viewports.length; i < l; i++) {
			this._viewports[i].destroy();
		}
		// Destroy the render system.
		this._renderer.destroy();
	}

	/** Runs the main game loop. */
	private _run(): void {
		// Check if not running, and if not, destroy the game and wrap it all up.
		if (!this._running) {
			this._destroy();
			return;
		}

		// Render everything.
		this._renderer.render();

		// Ask the browser for another frame.
		requestAnimationFrame(this._runBound);
	}

	/** Prepares the root element, adding styles and child elements. */
	private _prepareRootElement(): void {
		// Remove all children.
		while (this._rootElement.lastChild !== null) {
			this._rootElement.removeChild(this._rootElement.lastChild);
		}
		// Make sure it is a positioned element so that absolutely positioned children will work.
		if (this._rootElement.style.position === '' || this._rootElement.style.position === 'static') {
			this._rootElement.style.position = 'relative';
		}
		// Make it have no user interaction so child elements can specify the user interaction directly.
		this._rootElement.style.userSelect = 'none';
		this._rootElement.style.webkitUserSelect = 'none';
		this._rootElement.style.touchAction = 'none';
		// Add a canvas.
		const canvas = document.createElement('canvas');
		canvas.style.position = 'absolute';
		canvas.style.left = '0';
		canvas.style.top = '0';
		canvas.style.width = '100%';
		canvas.style.height = '100%';
		this._rootElement.appendChild(canvas);
		// Add a viewports div.
		const viewportsDiv = document.createElement('div');
		viewportsDiv.classList.add('viewports');
		viewportsDiv.style.position = 'absolute';
		viewportsDiv.style.left = '0';
		viewportsDiv.style.top = '0';
		viewportsDiv.style.width = '100%';
		viewportsDiv.style.height = '100%';
		viewportsDiv.style.overflow = 'hidden';
		this._rootElement.appendChild(viewportsDiv);
	}

	/** The root element. */
	private _rootElement: HTMLDivElement;

	/** A flag that says whether or not the game is running. */
	private _running: boolean = false;

	/** A this-bound function of the run method, used by requestAnimationFrame. */
	private _runBound: () => void;

	/** The render system. */
	private _renderer: Render.Renderer;

	/** The viewports. */
	private _viewports: Viewport[] = [];

	/** The worlds. */
	private _worlds: World[] = [];
}
