export class Sound {
	/** The constructor. */
	constructor(url: string, audioContext: AudioContext) {
		this._elem = new Audio(url);
		const sourceNode = audioContext.createMediaElementSource(this._elem);
		sourceNode.connect(audioContext.destination);
	}

	/** Gets the url. */
	get url(): string {
		return this._elem.src;
	}

	/** Plays the sound. */
	play(): void {
		this._elem.play();
	}

	/** The audio element. */
	private _elem: HTMLAudioElement;
}
