export class Num {
	/** The number that when multiplied converts from radians to degrees. */
	static RadToDeg = 57.295779513082320877;

	/** The number that when multiplied converts from degrees to radians. */
	static DegToRad = 0.017453292519943295769;

	/** Returns *x* clamped between *a* and *b*. */
	static clamp(x: number, a: number, b: number): number {
		return x < a ? a : (b < x ? b : x);
	}

	/** Returns *x* clamped between 0 and 1. */
	static clamp01(x: number): number {
		return x < 0 ? 0 : (1 < x ? 1 : x);
	}

	/** Returns the point *x* between *a* and *b* as if they were a cycle. */
	static wrap(x: number, a: number, b: number): number {
		let phase = (x - a) % (b - a) + a;
		if (phase < b) {
			phase += b - a;
		}
		return phase;
	}

	/** Returns the *u* lerped value between *a* and *b*. */
	static lerp(a: number, b: number, u: number): number {
		return a === b ? a : (a * (1 - u) + b * u);
	}

	/** Returns true if *a* is a power of two. */
	static isPow2(a: number): boolean {
		return Math.log2(a) % 1 === 0;
	}

	/** Returns the next power of two that is <= *a*. */
	static floorPow2(a: number): number {
		return Math.pow(2, Math.floor(Math.log2(a)));
	}

	/** Returns the next power of two that is >= *a*. */
	static ceilPow2(a: number): number {
		return Math.pow(2, Math.ceil(Math.log2(a)));
	}

	/** Returns the angle to get from *a* to *b* in the shortest direction. */
	static angleDiff(a: number, b: number): number {
		const at = this.wrap(a, 0, 360);
		const bt = this.wrap(b, 0, 360);
		if (at - bt > Math.PI) {
			return bt - at + 2 * Math.PI;
		}
		else if (bt - at > Math.PI) {
			return bt - at - 2 * Math.PI;
		}
		else {
			return bt - at;
		}
	}
}
