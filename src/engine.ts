import { Downloader, Input, Render, FastOrderedSet, Viewport, Collection } from './internal';
import { Sound } from './sound';
import { Cache } from './utils/cache';

export class Engine {
	constructor(rootElement: HTMLDivElement) {
		// Set and prepare the root element.
		this._rootElement = rootElement;
		this._prepareRootElement();

		// Create the renderer.
		this._renderer = new Render.Renderer(this._canvas, true);

		// Create the input system.
		this._input = new Input.Input();

		// Create the audio context.
		this._audioContext = new AudioContext();

		// Create the downloader.
		this._downloader = new Downloader();

		// Run the engine.
		this._running = true;
		this._run = this._run.bind(this);
		this._lastTime = Date.now();
		this._run();
	}

	/** Destroys the engine. */
	destroy(): void {
		this._input.destroy();
		this._audioContext.close();
		this._renderer.destroy();
		this._rootElement.innerHTML = '';
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

	/** Gets the sound cache. */
	get sounds(): Cache<Sound> {
		return this._sounds;
	}

	/** Gets the downloader. */
	get downloader(): Downloader {
		return this._downloader;
	}

	/** Gets the viewports. New viewports are automatically added to the end of the viewport order. */
	get viewports(): Collection<Viewport> {
		return this._viewports;
	}

	/** Gets the viewport order. */
	get viewportOrder(): FastOrderedSet<Viewport> {
		return this._viewportOrder;
	}

	/** Gets the time elapsed since the last frame. */
	get deltaTime(): number {
		return this._deltaTime;
	}

	/** Stops the engine. */
	stop(): void {
		this._running = false;
	}

	/** Adds an update callback. */
	addUpdateCallback(callback: (deltaTime: number) => void): void {
		this._updateCallbacks.push(callback);
	}

	/** Removes an updated callback. */
	removeUpdateCallback(callback: (deltaTime: number) => void): void {
		for (let i = 0; i < this._updateCallbacks.length; i++) {
			if (this._updateCallbacks[i] === callback) {
				this._updateCallbacks.splice(i, 1);
				break;
			}
		}
	}

	/** Destroys the engine. */
	private _destroy(): void {
		this._viewports.clear();
	}

	/** Runs the main engine loop. */
	private _run(): void {
		// Check if not running, and if not, destroy the engine and wrap it all up.
		if (!this._running) {
			this._destroy();
			return;
		}

		// Get the time elapsed since the last frame.
		const timeNow = Date.now();
		this._deltaTime = (timeNow - this._lastTime) / 1000.0;
		this._lastTime = timeNow;

		// Check the canvas size and resize if needed.
		const canvas = this._canvas;
		if (canvas.width !== canvas.clientWidth * devicePixelRatio) {
			canvas.width = canvas.clientWidth * devicePixelRatio;
		}
		if (canvas.height !== canvas.clientHeight * devicePixelRatio) {
			canvas.height = canvas.clientHeight * devicePixelRatio;
		}

		// Update the bounds of the viewports.
		for (const viewport of this._viewportOrder) {
			viewport.updateBounds();
		}

		// Update the inputs.
		this._input.update();

		// Call the update callbacks.
		for (let i = 0; i < this._updateCallbacks.length; i++) {
			this._updateCallbacks[i](this.deltaTime);
		}

		// Render all of the stages.
		this._renderer.render();

		// Ask the browser for another frame.
		requestAnimationFrame(this._run);
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

	/** The time last frame. */
	private _lastTime: number = Date.now();

	/** The time elapsed since the last frame. */
	private _deltaTime: number = 0;

	/** The renderer. */
	private _renderer: Render.Renderer;

	/** The input system. */
	private _input: Input.Input;

	/** The audio context. */
	private _audioContext: AudioContext;

	/** The downloader. */
	private _downloader: Downloader;

	/** The viewport order. */
	private _viewportOrder: FastOrderedSet<Viewport> = new FastOrderedSet();

	/** The update callbacks. */
	private _updateCallbacks: ((deltaTime: number) => void)[] = [];

	/** The viewports. */
	private _viewports: Collection<Viewport> = new Collection(() => {
		const viewport = new Viewport(this._renderer, this._viewportsElement);
		this._viewportOrder.add(viewport);
		return viewport;
	}, (viewport: Viewport) => {
		viewport.destroy();
		this._viewportOrder.remove(viewport);
	});

	// Resource Caches

	/** The sound cache. */
	private _sounds = new Cache<Sound>((name: string) => {
		return new Sound(name, this._audioContext);
	}, (object: Sound, url: string) => {
		object.setUrl(url);
	}, (object: Sound) => {
		object.destroy();
	}, (object: Sound) => {
		return object.url;
	});
}
