import { OrderedSet, SortedList, Viewport, World } from './internal';

export class Engine {
	constructor(rootElement: HTMLDivElement) {
		// Set and prepare the root element.
		this._rootElement = rootElement;
		this._prepareRootElement();
		// Get the WebGL context.
		const gl = this._canvas.getContext('webgl2', { antialias: true });
		if (gl === null) {
			throw new Error('Could not get a WebGL 2.0 context. Your browser may not support WebGL 2.0.');
		}
		this._gl = gl;
		// Run the game.
		this._running = true;
		this._runBound = this._run.bind(this);
		this._run();
	}

	/** Gets the root element. */
	get rootElement(): HTMLDivElement {
		return this._rootElement;
	}

	/** Stops the game. */
	stop(): void {
		this._running = false;
	}

	/** Creates a viewport. */
	createViewport(zIndex?: number): Viewport {
		const viewportsElement = this._rootElement.querySelector('viewports') as HTMLDivElement;
		const viewport = new Viewport(viewportsElement);
		if (zIndex !== undefined) {
			viewport.zIndex = zIndex;
		}
		this._viewports.add(viewport);
		return viewport;
	}

	/** Destroys a viewport. */
	destroyViewport(viewport: Viewport): void {
		if (this._viewports.remove(viewport)) {
			viewport.destroy();
		}
	}

	/** Creates a world. */
	createWorld(): World {
		const world = new World(this);
		this._worlds.add(world);
		return world;
	}

	/** Destroys a world. */
	destroyWorld(world: World): void {
		if (this._worlds.remove(world)) {
			// world.destroy();
		}
	}

	/** Destroys the game. */
	private _destroy(): void {
		// Destroys the viewports.
		for (const viewport of this._viewports) {
			viewport.destroy();
		}
		// Lose the WebGL context.
		const loseContextExtension = this._gl.getExtension('WEBGL_lose_context');
		if (loseContextExtension !== null) {
			loseContextExtension.loseContext();
		}
	}

	/** Runs the main game loop. */
	private _run(): void {
		// Check if not running, and if not, destroy the game and wrap it all up.
		if (!this._running) {
			this._destroy();
			return;
		}

		// Check the canvas size and resize if needed.
		const canvas = this._canvas;
		if (canvas.width !== canvas.clientWidth * devicePixelRatio) {
			canvas.width = canvas.clientWidth * devicePixelRatio;
		}
		if (canvas.height !== canvas.clientHeight * devicePixelRatio) {
			canvas.height = canvas.clientHeight * devicePixelRatio;
		}

		// Render the viewports.

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
		this._canvas = document.createElement('canvas');
		this._canvas.style.position = 'absolute';
		this._canvas.style.left = '0';
		this._canvas.style.top = '0';
		this._canvas.style.width = '100%';
		this._canvas.style.height = '100%';
		this._canvas.style.imageRendering = 'crisp-edges';
		this._canvas.style.imageRendering = 'pixelated';
		this._canvas.width = this._canvas.clientWidth * devicePixelRatio;
		this._canvas.height = this._canvas.clientHeight * devicePixelRatio;
		this._rootElement.appendChild(this._canvas);
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

	/** The canvas element. */
	private _canvas!: HTMLCanvasElement;

	/** A flag that says whether or not the game is running. */
	private _running: boolean = false;

	/** The WebGL context. */
	private _gl: WebGL2RenderingContext;

	/** A this-bound function of the run method, used by requestAnimationFrame. */
	private _runBound: () => void;

	/** The viewports. */
	private _viewports: SortedList<Viewport> = new SortedList((a: Viewport, b: Viewport) => {
		return a.zIndex < b.zIndex;
	});

	/** The worlds. */
	private _worlds: OrderedSet<World> = new OrderedSet();
}
