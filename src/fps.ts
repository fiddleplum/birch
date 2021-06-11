/** A class for getting a smoothed frames per second value. */
export class FPS {
	/** Constructor. */
	constructor() {
		for (let i = 0, l = this._samples.length; i < l; i++) {
			this._samples[i] = 0;
		}
	}

	/** Gets the frames per second. */
	get fps(): number {
		return 100 / this._total;
	}

	/** Adds a new delta time sample. */
	add(sample: number): void {
		this._total -= this._samples[this._nextIndex];
		this._samples[this._nextIndex] = sample;
		this._total += sample;
		this._nextIndex += 1;
		if (this._nextIndex === this._samples.length) {
			this._nextIndex = 0;
		}
	}

	/** The last number of delta times for fps calculations, as a circular buffer. */
	private _samples: number[] = new Array(FPS.numSamples);

	/** The current total of the delta times. */
	private _total: number = 0;

	/** The next index in the deltaTimeSamples circular buffer. */
	private _nextIndex = 0;

	static numSamples: number = 100;
}
