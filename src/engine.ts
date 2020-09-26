import { Downloader, Input, Render, FastOrderedSet, Viewport, World, Collection } from './internal';

export class Engine {
	constructor(rootElement: HTMLDivElement) {
		// Set and prepare the root element.
		this._rootElement = rootElement;
		this._prepareRootElement();
		// Create the renderer.
		this._renderer = new Render.Renderer(this._canvas, true);
		// Create the input system.
		this._input = new Input.Input();
		// Create the downloader.
		this._downloader = new Downloader();
		// Run the engine.
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

	/** Gets the input system. */
	get input(): Input.Input {
		return this._input;
	}

	/** Gets the downloader. */
	get downloader(): Downloader {
		return this._downloader;
	}

	/** Gets the viewports. New viewports are automatically added to the end of the viewport order. */
	get viewports(): Collection<Viewport> {
		return this._viewports;
	}

	/** Gets the worlds. */
	get worlds(): Collection<World.World> {
		return this._worlds;
	}

	/** Gets the viewport order. */
	get viewportOrder(): FastOrderedSet<Viewport> {
		return this._viewportOrder;
	}

	/** Stops the engine. */
	stop(): void {
		this._running = false;
	}

	/** Destroys the engine. */
	private _destroy(): void {
		this._viewports.clear();
		this._worlds.clear();
	}

	/** Runs the main engine loop. */
	private _run(): void {
		// Check if not running, and if not, destroy the engine and wrap it all up.
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

		// Update the inputs.
		this._input.update();

		// Update the worlds.
		for (const entry of this._worlds) {
			const world = entry.key;
			world.update();
		}

		// Update the bounds of the viewports.
		for (const viewport of this._viewportOrder) {
			viewport.prepareForRender();
		}

		// Render all of the stages.
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
		this._viewportsElement = document.createElement('div');
		this._viewportsElement.classList.add('viewports');
		this._viewportsElement.style.position = 'absolute';
		this._viewportsElement.style.left = '0';
		this._viewportsElement.style.top = '0';
		this._viewportsElement.style.width = '100%';
		this._viewportsElement.style.height = '100%';
		this._viewportsElement.style.overflow = 'hidden';
		this._rootElement.appendChild(this._viewportsElement);
	}

	/** The root element. */
	private _rootElement: HTMLDivElement;

	/** The canvas. */
	private _canvas!: HTMLCanvasElement;

	/** The viewports element. */
	private _viewportsElement!: HTMLDivElement;

	/** A flag that says whether or not the engine is running. */
	private _running: boolean = false;

	/** A this-bound function of the run method, used by requestAnimationFrame. */
	private _runBound: () => void;

	/** The renderer. */
	private _renderer: Render.Renderer;

	/** The input system. */
	private _input: Input.Input;

	/** The downloader. */
	private _downloader: Downloader;

	/** The viewport order. */
	private _viewportOrder: FastOrderedSet<Viewport> = new FastOrderedSet();

	/** The viewports. */
	private _viewports: Collection<Viewport> = new Collection(() => {
		const viewport = new Viewport(this._renderer, this._viewportsElement);
		this._viewportOrder.add(viewport);
		return viewport;
	}, (viewport: Viewport) => {
		viewport.destroy();
		this._viewportOrder.remove(viewport);
	});

	/** The worlds. */
	private _worlds: Collection<World.World> = new Collection(() => {
		return new World.World(this);
	}, (world: World.World) => {
		world.destroy();
	});
}
