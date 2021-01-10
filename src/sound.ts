export class Sound {
	/** The constructor. */
	constructor(audioContext: AudioContext) {
		// Save the audio context.
		this._audioContext = audioContext;

		// Create the element and source node.
		this._elem = new Audio();
		this._sourceNode = audioContext.createMediaElementSource(this._elem);
		this._sourceNode.connect(this._audioContext.destination);
	}

	/** The destructor. */
	destroy(): void {
		this._sourceNode.disconnect(this._audioContext.destination);
	}

	/** Gets the url. */
	get url(): string {
		return this._elem.src;
	}

	/** Sets the url. Returns a promise when it is loaded. */
	setUrl(url: string): Promise<void> {
		return new Promise((resolve, rejected) => {
			this._elem.src = url;
			this._elem.addEventListener('canplaythrough', (): void => {
				resolve();
			}, true);
			this._elem.addEventListener('error', (): void => {
				rejected();
			}, true);
			this._elem.load();
		});
	}

	/** Plays the sound. */
	play(): void {
		this._elem.play();
	}

	/** The audio context. */
	private _audioContext: AudioContext;

	/** The audio element. */
	private _elem: HTMLAudioElement;

	/** The source node. */
	private _sourceNode: MediaElementAudioSourceNode;
}
