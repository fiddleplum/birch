import { FastMap, Renderer, Viewport } from './internal';

export class Game {
	constructor(rootElement: HTMLDivElement) {
		// Set and prepare the root element.
		this._rootElement = rootElement;
		this._prepareRootElement();

		// Create the renderer.
		this._renderer = new Renderer(this._rootElement.querySelector('canvas') as HTMLCanvasElement, true);

		// Run the game.
		this._running = true;
		this._runBound = this._run.bind(this);
		this._run();
	}

	get rootElement(): HTMLDivElement {
		return this._rootElement;
	}

	stop(): void {
		this._running = false;
	}

	addViewport(name: string, ) : Viewport {
		const viewport = new Viewport(this);
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

	private _prepareRootElement(): void {
		// Remove all children.
		while (this._rootElement.lastChild) {
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

	// The root element.
	private _rootElement: HTMLDivElement;

	// Running
	private _running: boolean = false;
	private _runBound: () => void;

	// Systems
	private _renderer: Renderer;

	// Viewports
	private _viewports: FastMap<string, Viewport> = new FastMap();
}
