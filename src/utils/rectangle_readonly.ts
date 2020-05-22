import { Vector2 } from './vector2';
import { Vector2Readonly} from './vector2_readonly';
import { Num } from './num';

/** A readonly rectangle. */
export class RectangleReadonly {
	protected _min: Vector2;
	protected _size: Vector2;
	protected _max: Vector2;
	protected _integral: boolean;

	/** The constructor. If integral, then the *max* = *min* + *size* - 1, otherwise *max* = *min* + *size*. Defaults to a zero min and zero size non-integral. */
	constructor(minX = 0, minY = 0, sizeX = 0, sizeY = 0, integral = false) {
		this._min = new Vector2(minX, minY);
		this._size = new Vector2(sizeX, sizeY);
		this._integral = integral;
		this._max = new Vector2(minX + sizeX - (integral ? 1 : 0), minY + sizeY - (integral ? 1 : 0));
	}

	/** Gets the *min*. */
	get min(): Vector2Readonly {
		return this._min;
	}

	/** Gets the *size*. */
	get size(): Vector2Readonly {
		return this._size;
	}

	/** Gets the computed *max*. */
	get max(): Vector2Readonly {
		return this._max;
	}

	/** Gets whether or not *this* is integral. If integral, then the *max* = *min* + *size* - 1, otherwise *max* = *min* + *size*. */
	get integral(): boolean {
		return this._integral;
	}

	/** Gets *this* as a string. */
	toString(): string {
		return '{ min: ' + this._min + ', size: ' + this._size + ' }';
	}

	/** Returns true if *this* contains the *point*. */
	contains(point: Vector2Readonly): boolean {
		if (this._integral) {
			return this._min.x <= point.x && point.x <= this._max.x
				&& this._min.y <= point.y && point.y <= this._max.y;
		}
		else {
			return this._min.x <= point.x && point.x < this._max.x
				&& this._min.y <= point.y && point.y < this._max.y;
		}
	}

	/** Returns true if *this* intersects with *a*. */
	intersects(a: RectangleReadonly): boolean {
		if (this._integral) {
			return this._min.x <= a._max.x && a._min.x <= this._max.x
				&& this._min.y <= a._max.y && a._min.y <= this._max.y;
		}
		else {
			return this._min.x < a._max.x && a._min.x < this._max.x
				&& this._min.y < a._max.y && a._min.y < this._max.y;
		}
	}

	/** Sets *out* to the closest point within *this* to *point*. */
	closest(out: Vector2, point: Vector2Readonly): void {
		out.x = Num.clamp(point.x, this._min.x, this.max.x);
		out.y = Num.clamp(point.y, this._min.y, this.max.y);
	}
}
