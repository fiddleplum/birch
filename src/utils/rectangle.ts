import { RectangleReadonly } from './rectangle_readonly';
import { Vector2Readonly } from './vector2_readonly';

// When TypeScript fixes issue https://github.com/microsoft/TypeScript/issues/2521,
// I can properly implement "get min(): Vector2" and "get size(): Vector2".

/** A rectangle. */
export class Rectangle extends RectangleReadonly {
	/** Gets the *min*. */
	get min(): Vector2Readonly {
		return super.min;
	}

	/** Sets the *min*. */
	set min(min: Vector2Readonly) {
		this._min.copy(min);
	}

	/** Gets the *size*. */
	get size(): Vector2Readonly {
		return super.size;
	}

	/** Sets the *size*. */
	set size(size: Vector2Readonly) {
		this._size.copy(size);
	}

	/** Copies *a* to *this*. */
	copy(a: RectangleReadonly): void {
		this._min.copy(a.min);
		this._size.copy(a.size);
	}

	/** Sets the *min* and *max*. */
	set(minX = 0, minY = 0, sizeX = 0, sizeY = 0): void {
		this._min.set(minX, minY);
		this._size.set(sizeX, sizeY);
	}

	/** Extends *this* to include *point*. Modifies whichever sides are closest to the *point*. If integral is true, it treats *this* and the *point* as integral numbers. */
	extendToInclude(point: Vector2Readonly, integral: boolean): void {
		this._min.x = Math.min(this._min.x, point.x);
		this._min.y = Math.min(this._min.y, point.y);
		this._size.x = Math.max(this._size.x, point.x - this._min.x + (integral ? 1 : 0));
		this._size.y = Math.max(this._size.y, point.y - this._min.y + (integral ? 1 : 0));
	}

	/** Sets *this* to be the union of *a* and *b*. */
	union(a: RectangleReadonly, b: RectangleReadonly): void {
		this._min.x = Math.min(a.min.x, b.min.x);
		this._min.y = Math.min(a.min.y, b.min.y);
		this._size.x = Math.max(a.min.x + a.size.x, b.min.x + b.size.x) - this._min.x;
		this._size.y = Math.max(a.min.y + a.size.y, b.min.y + b.size.y) - this._min.y;
	}

	/** Sets *this* to be the intersection of *a* and *b*. */
	intersection(a: RectangleReadonly, b: RectangleReadonly): void {
		this._min.x = Math.max(a.min.x, b.min.x);
		this._min.y = Math.max(a.min.y, b.min.y);
		this._size.x = Math.min(a.min.x + a.size.x, b.min.x + b.size.x) - this._min.x;
		this._size.y = Math.min(a.min.y + a.size.y, b.min.y + b.size.y) - this._min.y;
	}
}
