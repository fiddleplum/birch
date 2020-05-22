/** A two-dimensional vector. */
export class Vector2 {
	x: number;
	y: number;

	/** A zero vector. */
	static Zero = new Vector2(0, 0);

	/** A one vector. */
	static One = new Vector2(1, 1);

	/** The constructor. Defaults to the zero vector. */
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	/** Gets *this* as a string. */
	public toString(): string {
		return '[' + this.x + ', ' + this.y + ']';
	}

	/** Returns true if *this* equals *a*. */
	equals(a: Vector2): boolean {
		return this.x === a.x && this.y === a.y;
	}

	/** Copies *a* to *this*. */
	copy(a: Vector2): void {
		this.x = a.x;
		this.y = a.y;
	}

	/** Sets *this* to the components *x* and *y*. */
	set(x: number, y: number): void {
		this.x = x;
		this.y = y;
	}

	/** Sets *this* to -*a*. */
	neg(a: Vector2): void {
		this.x = -a.x;
		this.y = -a.y;
	}

	/** Sets *this* to *a* + *b*. */
	add(a: Vector2, b: Vector2): void {
		this.x = a.x + b.x;
		this.y = a.y + b.y;
	}

	/** Sets *this* to *a* - *b*. */
	sub(a: Vector2, b: Vector2): void {
		this.x = a.x - b.x;
		this.y = a.y - b.y;
	}

	/** Sets *this* to *a* * *b*. */
	mult(a: Vector2, b: number): void {
		this.x = a.x * b;
		this.y = a.y * b;
	}

	/** Sets *this* to *a* scaled by *b*, component-wise. */
	scale(a: Vector2, b: Vector2): void {
		this.x = a.x * b.x;
		this.y = a.y * b.y;
	}

	/** Sets *this* to *a* inverse-scaled by *b*, component-wise. */
	scaleInv(a: Vector2, b: Vector2): void {
		this.x = a.x / b.x;
		this.y = a.y / b.y;
	}

	/** Gets the dot product between *this* and *a*. */
	dot(a: Vector2): number {
		return this.x * a.x + this.y * a.y;
	}

	/** Gets the norm of *this*. */
	norm(): number {
		return Math.sqrt(this.dot(this));
	}

	/** Sets *this* to *a* normalized. */
	normalize(a: Vector2): void {
		const n = a.norm();
		if (n !== 0) {
			this.x = a.x / n;
			this.y = a.y / n;
		}
	}

	/** Sets *this* to *a*, clamped between *min* and *max*. */
	clamp(a: Vector2, min: Vector2, max: Vector2): void {
		this.x = Math.max(min.x, Math.min(max.x, a.x));
		this.y = Math.max(min.y, Math.min(max.y, a.y));
	}

	/** Sets *this* to the lerp between *a* and *b*, with lerp factor *u*. */
	lerp(a: Vector2, b: Vector2, u: number): void {
		this.x = a.x + (b.x - a.x) * u;
		this.y = a.y + (b.y - a.y) * u;
	}
}
