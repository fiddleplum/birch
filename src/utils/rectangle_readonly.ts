import { Vector2 } from './vector2';
import { Vector2Readonly} from './vector2_readonly';
import { Num } from './num';

/** A readonly rectangle. */
export class RectangleReadonly {
	protected _min: Vector2;
	protected _size: Vector2;

	/** The constructor. Defaults to zero min and zero size. */
	constructor(minX = 0, minY = 0, sizeX = 0, sizeY = 0) {
		this._min = new Vector2(minX, minY);
		this._size = new Vector2(sizeX, sizeY);
	}

	/** Gets the *min*. */
	get min(): Vector2Readonly {
		return this._min;
	}

	/** Gets the *size*. */
	get size(): Vector2Readonly {
		return this._size;
	}

	/** Gets *this* as a string. */
	toString(): string {
		return '{ min: ' + this._min + ', size: ' + this._size + ' }';
	}

	/** Returns true if *this* contains the *point*. */
	contains(point: Vector2Readonly): boolean {
		return this._min.x <= point.x && point.x < this._min.x + this._size.x
			&& this._min.y <= point.y && point.y < this._min.y + this._size.y;
	}

	/** Returns true if *this* intersects with *a*. */
	intersects(a: RectangleReadonly): boolean {
		return this._min.x < a._min.x + a._size.x && a._min.x < this._min.x + this._size.x
			&& this._min.y < a._min.y + a._size.y && a._min.y < this._min.y + this._size.y;
}

	/** Sets *out* to the closest point within *this* to *point*. */
	closest(out: Vector2, point: Vector2Readonly): void {
		out.x = Num.clamp(point.x, this._min.x, this._min.x + this._size.x);
		out.y = Num.clamp(point.y, this._min.y, this._min.y + this._size.y);
	}
}
