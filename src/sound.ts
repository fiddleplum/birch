export class Sound {
	/** The constructor. */
	constructor(audioContext: AudioContext) {
		// Save the audio context.
		this._audioContext = audioContext;
	}

	/** The destructor. */
	destroy(): void {
	}

	/** Gets the url. */
	get url(): string {
		return this._url;
	}

	/** Sets the url. Returns a promise when it is loaded. */
	async setUrl(url: string): Promise<void> {
		this._url = url;
		const response = await fetch(url);
		const arrayBuffer = await response.arrayBuffer();
		this._audioBuffer = await this._audioContext.decodeAudioData(arrayBuffer);
	}

	/** Plays the sound. */
	play(): void {
		if (this._audioBuffer !== undefined) {
			const track = this._audioContext.createBufferSource();
			track.buffer = this._audioBuffer;
			track.connect(this._audioContext.destination);
			track.start();
		}
	}

	/** The url. */
	private _url: string = '';

	/** The audio buffer. */
	private _audioBuffer: AudioBuffer | undefined;

	/** The audio context. */
	private _audioContext: AudioContext;
}
