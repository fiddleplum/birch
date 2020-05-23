/** A readonly RGBA color. */
export class ColorReadonly {
	/** The components. */
	protected _m: number[];

	/** Clear. */
	static Clear = new ColorReadonly(0, 0, 0, 0);

	/** Black. */
	static Black = new ColorReadonly(0, 0, 0, 1);

	/** White. */
	static White = new ColorReadonly(1, 1, 1, 1);

	/** Pink. */
	static Pink = new ColorReadonly(1, .41, .71);

	/** The constructor. Defaults to clear. */
	constructor(r = 0, g = 0, b = 0, a = 0) {
		this._m = [r, g, b, a];
	}

	/** Gets the *r* component. */
	get r(): number {
		return this._m[0];
	}

	/** Gets the *g* component. */
	get g(): number {
		return this._m[1];
	}

	/** Gets the *b* component. */
	get b(): number {
		return this._m[2];
	}

	/** Gets the *a* component. */
	get a(): number {
		return this._m[3];
	}

	/** Gets the underlying array. */
	get array(): readonly number[] {
		return this._m;
	}

	/** Gets *this* as a string. */
	public toString(): string {
		return '[' + this._m[0] + ', ' + this._m[1] + ', ' + this._m[2] + ', ' + this._m[3] + ']';
	}

	/** Returns true if *this* equals *c*. */
	equals(c: ColorReadonly): boolean {
		return this._m[0] === c._m[0] && this._m[1] === c._m[1] && this._m[2] === c._m[2] && this._m[3] === c._m[3];
	}
}
