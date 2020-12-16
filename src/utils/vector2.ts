import { Vector2Readonly } from './vector2_readonly';
import { Num } from './num';
import Pool from './pool';

/** A two-dimensional vector. */
export class Vector2 extends Vector2Readonly {
	/** Sets the *x* component. */
	setX(x: number): void {
		this._m[0] = x;
	}

	/** Sets the *y* component. */
	setY(y: number): void {
		this._m[1] = y;
	}

	/** Copies *a* to *this*. */
	copy(a: Vector2Readonly): void {
		this._m[0] = a.x;
		this._m[1] = a.y;
	}

	/** Sets *this* to the components *x* and *y*. */
	set(x: number, y: number): void {
		this._m[0] = x;
		this._m[1] = y;
	}

	/** Sets *this* to -*a*. */
	neg(a: Vector2Readonly): void {
		this._m[0] = -a.x;
		this._m[1] = -a.y;
	}

	/** Sets *this* to *a* + *b*. */
	add(a: Vector2Readonly, b: Vector2Readonly): void {
		this._m[0] = a.x + b.x;
		this._m[1] = a.y + b.y;
	}

	/** Sets *this* to *a* - *b*. */
	sub(a: Vector2Readonly, b: Vector2Readonly): void {
		this._m[0] = a.x - b.x;
		this._m[1] = a.y - b.y;
	}

	/** Sets *this* to *a* * *b*. */
	mult(a: Vector2Readonly, b: number): void {
		this._m[0] = a.x * b;
		this._m[1] = a.y * b;
	}

	/** Sets *this* to *a* / *b*. */
	div(a: Vector2Readonly, b: number): void {
		this._m[0] = a.x / b;
		this._m[1] = a.y / b;
	}

	/** Sets *this* to *a* * *b*, component-wise. */
	multV(a: Vector2Readonly, b: Vector2Readonly): void {
		this._m[0] = a.x * b.x;
		this._m[1] = a.y * b.y;
	}

	/** Sets *this* to *a* / *b*, component-wise. */
	divV(a: Vector2Readonly, b: Vector2Readonly): void {
		this._m[0] = a.x / b.x;
		this._m[1] = a.y / b.y;
	}

	/** Sets *this* to *a* * *aMult* + *b* * *bMult*. */
	addMult(a: Vector2Readonly, aMult: number, b: Vector2Readonly, bMult: number): void {
		this._m[0] = a.x * aMult + b.x * bMult;
		this._m[1] = a.y * aMult + b.y * bMult;
	}

	/** Sets *this* to *a* normalized. */
	normalize(a: Vector2Readonly): void {
		const n = a.norm;
		if (n !== 0) {
			this._m[0] = a.x / n;
			this._m[1] = a.y / n;
		}
	}

	/** Sets *this* to *a*, clamped between *min* and *max*. */
	clamp(a: Vector2Readonly, min: number, max: number): void {
		this._m[0] = Num.clamp(a.x, min, max);
		this._m[1] = Num.clamp(a.y, min, max);
	}

	/** Sets *this* to *a*, clamped between *min* and *max*, component-wise. */
	clampV(a: Vector2Readonly, min: Vector2Readonly, max: Vector2Readonly): void {
		this._m[0] = Num.clamp(a.x, min.x, max.x);
		this._m[1] = Num.clamp(a.y, min.y, max.y);
	}

	/** Sets *this* to the lerp between *a* and *b*, with lerp factor *u*. */
	lerp(a: Vector2Readonly, b: Vector2Readonly, u: number): void {
		this._m[0] = Num.lerp(a.x, b.x, u);
		this._m[1] = Num.lerp(a.y, b.y, u);
	}

	/** Sets *this* to *a* rotated by *angle* radians. */
	rot(a: Vector2Readonly, angle: number): void {
		const cosAngle = Math.cos(angle);
		const sinAngle = Math.sin(angle);
		const ax = a.x; // In case this is a.
		this._m[0] = a.x * cosAngle - a.y * sinAngle;
		this._m[1] = ax * sinAngle + a.y * cosAngle;
	}

	/** Sets *this* to *a* rotated by 90 degrees counter-clockwise. */
	rot90(a: Vector2Readonly): void {
		const ax = a.x; // In case this is a.
		this._m[0] = -a.y;
		this._m[1] = ax;
	}

	/** Pool for temporary vectors. */
	static pool = new Pool(Vector2);
}
