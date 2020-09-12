import { ColorReadonly } from './color_readonly';
import { Num } from './num';

/** An RGBA color. */
export class Color extends ColorReadonly {
	/** Gets the *r* component. */
	get r(): number {
		return super.r;
	}

	/** Sets the *r* component. */
	set r(r: number) {
		this._m[0] = r;
	}

	/** Gets the *g* component. */
	get g(): number {
		return super.g;
	}

	/** Sets the *g* component. */
	set g(g: number) {
		this._m[1] = g;
	}

	/** Gets the *b* component. */
	get b(): number {
		return super.b;
	}

	/** Sets the *b* component. */
	set b(b: number) {
		this._m[2] = b;
	}

	/** Gets the *a* component. */
	get a(): number {
		return super.a;
	}

	/** Sets the *a* component. */
	set a(a: number) {
		this._m[3] = a;
	}

	/** Copies *c* to *this*. */
	copy(c: ColorReadonly): void {
		this._m[0] = c.r;
		this._m[1] = c.g;
		this._m[2] = c.b;
		this._m[3] = c.a;
	}

	/** Sets *this* to the components *r*, *g*, *b*, and *a*. */
	set(r: number, g: number, b: number, a: number): void {
		this._m[0] = r;
		this._m[1] = g;
		this._m[2] = b;
		this._m[3] = a;
	}

	/** Sets *this* to *c* + *d*. */
	add(c: ColorReadonly, d: ColorReadonly): void {
		this._m[0] = c.r + d.r;
		this._m[1] = c.g + d.g;
		this._m[2] = c.b + d.b;
		this._m[3] = c.a + d.a;
	}

	/** Sets *this* to *c* - *d*. */
	sub(c: ColorReadonly, d: ColorReadonly): void {
		this._m[0] = c.r - d.r;
		this._m[1] = c.g - d.g;
		this._m[2] = c.b - d.b;
		this._m[3] = c.a - d.a;
	}

	/** Sets *this* to *c* * *d*. */
	mult(c: ColorReadonly, d: number): void {
		this._m[0] = c.r * d;
		this._m[1] = c.g * d;
		this._m[2] = c.b * d;
		this._m[2] = c.a * d;
	}

	/** Sets *this* to *c* / *d*. */
	div(c: ColorReadonly, d: number): void {
		this._m[0] = c.r / d;
		this._m[1] = c.g / d;
		this._m[2] = c.b / d;
		this._m[2] = c.a / d;
	}

	/** Sets *this* to *c* scaled by *d*, component-wise. */
	multV(c: ColorReadonly, d: ColorReadonly): void {
		this._m[0] = c.r * d.r;
		this._m[1] = c.g * d.g;
		this._m[2] = c.b * d.b;
		this._m[3] = c.a * d.a;
	}

	/** Sets *this* to *c* / *d*, component-wise. */
	divV(c: ColorReadonly, d: ColorReadonly): void {
		this._m[0] = c.r / d.r;
		this._m[1] = c.g / d.g;
		this._m[2] = c.b / d.b;
		this._m[3] = c.a / d.a;
	}

	/** Sets *this* to *c*, clamped between *min* and *max*. */
	clamp(c: ColorReadonly, min: ColorReadonly, max: ColorReadonly): void {
		this._m[0] = Num.clamp(c.r, min.r, max.r);
		this._m[1] = Num.clamp(c.g, min.g, max.g);
		this._m[2] = Num.clamp(c.b, min.b, max.b);
		this._m[3] = Num.clamp(c.a, min.a, max.a);
	}

	/** Sets *this* to the lerp between *c* and *d*, with lerp factor *u*. */
	lerp(c: ColorReadonly, d: ColorReadonly, u: number): void {
		this._m[0] = Num.lerp(c.r, d.r, u);
		this._m[1] = Num.lerp(c.g, d.g, u);
		this._m[2] = Num.lerp(c.b, d.b, u);
		this._m[3] = Num.lerp(c.a, d.a, u);
	}

	// Temporaries to use.
	static temp0 = new Color();
	static temp1 = new Color();
	static temp2 = new Color();
	static temp3 = new Color();
	static temp4 = new Color();
	static temp5 = new Color();
	static temp6 = new Color();
	static temp7 = new Color();
}
