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

	/** Returns the *u* lerped value between *a* and *b*. */
	static lerp(a: number, b: number, u: number): number {
		return a === b ? a : (a * (1 - u) + b * u);
	}
}
