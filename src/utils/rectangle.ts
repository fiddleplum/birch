import Pool from './pool';
import { RectangleReadonly } from './rectangle_readonly';
import { Vector2Readonly } from './vector2_readonly';

/** A rectangle. */
export class Rectangle extends RectangleReadonly {
	/** Sets the *min*. */
	setMin(min: Vector2Readonly): void {
		this._min.copy(min);
	}

	/** Sets the *size*. */
	setSize(size: Vector2Readonly): void {
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
		this._min.setX(Math.min(this._min.x, point.x));
		this._min.setY(Math.min(this._min.y, point.y));
		this._size.setX(Math.max(this._size.x, point.x - this._min.x + (integral ? 1 : 0)));
		this._size.setY(Math.max(this._size.y, point.y - this._min.y + (integral ? 1 : 0)));
	}

	/** Sets *this* to be the union of *a* and *b*. */
	union(a: RectangleReadonly, b: RectangleReadonly): void {
		this._min.setX(Math.min(a.min.x, b.min.x));
		this._min.setY(Math.min(a.min.y, b.min.y));
		this._size.setX(Math.max(a.min.x + a.size.x, b.min.x + b.size.x) - this._min.x);
		this._size.setY(Math.max(a.min.y + a.size.y, b.min.y + b.size.y) - this._min.y);
	}

	/** Sets *this* to be the intersection of *a* and *b*. */
	intersection(a: RectangleReadonly, b: RectangleReadonly): void {
		this._min.setX(Math.max(a.min.x, b.min.x));
		this._min.setY(Math.max(a.min.y, b.min.y));
		this._size.setX(Math.min(a.min.x + a.size.x, b.min.x + b.size.x) - this._min.x);
		this._size.setY(Math.min(a.min.y + a.size.y, b.min.y + b.size.y) - this._min.y);
	}

	/** Pool for temporary rectangles. */
	static pool = new Pool(Rectangle);
}
