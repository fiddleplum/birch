import { Num } from './num';

export class Vec {
	/** Sets *b* arguments onto *a*. */
	static set(a: number[], ...b: readonly number[]): void {
		const minLength = Math.min(a.length, b.length);
		for (let i = 0; i < minLength; i++) {
			a[i] = b[i];
		}
	}

	/** Copies *b* onto *a*. */
	static copy(a: number[], b: readonly number[]): void {
		const minLength = Math.min(a.length, b.length);
		for (let i = 0; i < minLength; i++) {
			a[i] = b[i];
		}
	}

	/** Adds *b* onto *a*. */
	static add(a: number[], b: readonly number[]): void {
		const minLength = Math.min(a.length, b.length);
		for (let i = 0; i < minLength; i++) {
			a[i] += b[i];
		}
	}

	/** Subtracts *b* from *a*. */
	static sub(a: number[], b: readonly number[]): void {
		const minLength = Math.min(a.length, b.length);
		for (let i = 0; i < minLength; i++) {
			a[i] -= b[i];
		}
	}

	/** Multiplies *a* by *b*. */
	static mult(a: number[], b: readonly number[]): void {
		const minLength = Math.min(a.length, b.length);
		for (let i = 0; i < minLength; i++) {
			a[i] *= b[i];
		}
	}

	/** Divides *a* by *b*. */
	static div(a: number[], b: readonly number[]): void {
		const minLength = Math.min(a.length, b.length);
		for (let i = 0; i < minLength; i++) {
			a[i] /= b[i];
		}
	}

	/** Multiplies *a* by *b*. */
	static multS(a: number[], b: number): void {
		for (let i = 0, l = a.length; i < l; i++) {
			a[i] *= b;
		}
	}

	/** Divides *a* by *b*. */
	static divS(a: number[], b: number): void {
		for (let i = 0, l = a.length; i < l; i++) {
			a[i] /= b;
		}
	}

	/** Clamps *a* between *min* and *max*. */
	static clamp(a: number[], min: readonly number[], max: readonly number[]): void {
		const minLength = Math.min(a.length, min.length, max.length);
		for (let i = 0; i < minLength; i++) {
			a[i] = Num.clamp(a[i], min[i], max[i]);
		}
	}

	/** Clamps *a* between *min* and *max*. */
	static clampS(a: number[], min: number, max: number): void {
		for (let i = 0, l = a.length; i < l; i++) {
			a[i] = Num.clamp(a[i], min, max);
		}
	}

	/** Clamps *a* between 0 and 1. */
	static clamp01(a: number[]): void {
		for (let i = 0, l = a.length; i < l; i++) {
			a[i] = Num.clamp01(a[i]);
		}
	}

	/** Sets *a* to the *u* lerp from *v0* to *v1*. */
	static lerp(a: number[], v0: readonly number[], v1: readonly number[], u: number) {
		const minLength = Math.min(a.length, v0.length, v1.length);
		for (let i = 0; i < minLength; i++) {
			a[i] = Num.lerp(v0[i], v1[i], u);
		}
	}
}
