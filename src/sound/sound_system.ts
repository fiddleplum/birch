import { Counted } from '../utils/counted';

export class SoundSystem {
	/** The constructor. */
	constructor() {
		this._audioContext = new AudioContext();
	}

	/** The destructor. */
	destroy(): void {
		this._audioContext.close();
	}

	load(url: string): void {
		const countedAudio = this._audioObjects.get(url);
		if (countedAudio === undefined) {
			const audioElement = new Audio(url);
			const sourceNode = this._audioContext.createMediaElementSource(audioElement);
			sourceNode.connect(this._audioContext.destination);
			this._audioObjects.set(url, new Counted(audioElement));
		}
		else {
			countedAudio.count += 1;
		}
	}

	unload(url: string): void {
		const countedAudio = this._audioObjects.get(url);
		if (countedAudio !== undefined) {
			countedAudio.count -= 1;
			if (countedAudio.count === 0) {
				this._audioObjects.delete(url);
			}
		}
	}

	play(url: string): void {
		const countedAudio = this._audioObjects.get(url);
		if (countedAudio !== undefined) {
			const audio = countedAudio.value;
			// audio.currentTime = 0;
			audio.play();
		}
	}

	private _audioContext: AudioContext;

	private _audioObjects: Map<string, Counted<HTMLAudioElement>> = new Map();
}
