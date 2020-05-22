import { Vector2Readonly } from './vector2_readonly';

/** A two-dimensional vector. */
export class Vector2 extends Vector2Readonly {
	/** Sets the *x* component. */
	set x(x: number) {
		this._x = x;
	}

	/** Sets the *y* component. */
	set y(y: number) {
		this._y = y;
	}

	/** Copies *a* to *this*. */
	copy(a: Vector2Readonly): void {
		this._x = a.x;
		this._y = a.y;
	}

	/** Sets *this* to the components *x* and *y*. */
	set(x: number, y: number): void {
		this._x = x;
		this._y = y;
	}

	/** Sets *this* to -*a*. */
	neg(a: Vector2Readonly): void {
		this._x = -a.x;
		this._y = -a.y;
	}

	/** Sets *this* to *a* + *b*. */
	add(a: Vector2Readonly, b: Vector2Readonly): void {
		this._x = a.x + b.x;
		this._y = a.y + b.y;
	}

	/** Sets *this* to *a* - *b*. */
	sub(a: Vector2Readonly, b: Vector2Readonly): void {
		this._x = a.x - b.x;
		this._y = a.y - b.y;
	}

	/** Sets *this* to *a* * *b*. */
	mult(a: Vector2Readonly, b: number): void {
		this._x = a.x * b;
		this._y = a.y * b;
	}

	/** Sets *this* to *a* scaled by *b*, component-wise. */
	scale(a: Vector2Readonly, b: Vector2Readonly): void {
		this._x = a.x * b.x;
		this._y = a.y * b.y;
	}

	/** Sets *this* to *a* inverse-scaled by *b*, component-wise. */
	scaleInv(a: Vector2Readonly, b: Vector2Readonly): void {
		this._x = a.x / b.x;
		this._y = a.y / b.y;
	}

	/** Sets *this* to *a* normalized. */
	normalize(a: Vector2Readonly): void {
		const n = a.norm();
		if (n !== 0) {
			this._x = a.x / n;
			this._y = a.y / n;
		}
	}

	/** Sets *this* to *a*, clamped between *min* and *max*. */
	clamp(a: Vector2Readonly, min: Vector2Readonly, max: Vector2Readonly): void {
		this._x = Math.max(min.x, Math.min(max.x, a.x));
		this._y = Math.max(min.y, Math.min(max.y, a.y));
	}

	/** Sets *this* to the lerp between *a* and *b*, with lerp factor *u*. */
	lerp(a: Vector2Readonly, b: Vector2Readonly, u: number): void {
		this._x = a.x + (b.x - a.x) * u;
		this._y = a.y + (b.y - a.y) * u;
	}
}
