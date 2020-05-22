import { RectangleReadonly } from './rectangle_readonly';
import { Vector2Readonly} from './vector2_readonly';

/** A rectangle. */
export class Rectangle extends RectangleReadonly {
	/** Sets the *min*. Updates the *max* to keep the *size* the same. */
	set min(min: Vector2Readonly) {
		this._min.copy(min);
		this._max.add(this._min, this._size);
		if (this._integral) {
			this._max.sub(this._max, Vector2Readonly.One);
		}
	}

	/** Sets the *size*. Updates the *max* to keep the *min* the same. */
	set size(size: Vector2Readonly) {
		this._size.copy(size);
		this._max.add(this._min, this._size);
		if (this._integral) {
			this._max.sub(this._max, Vector2Readonly.One);
		}
	}

	/** Sets the *max*. Updates the *size* to keep the *min* the same. */
	set max(max: Vector2Readonly) {
		this._max.copy(max);
		this._size.sub(this._max, this._min);
		if (this._integral) {
			this._size.add(this._size, Vector2Readonly.One);
		}
	}

	/** Copies *a* to *this*. */
	copy(a: RectangleReadonly): void {
		this._min.copy(a.min);
		this._size.copy(a.size);
		this._max.copy(a.max);
		this._integral = a.integral;
	}

	/** Extends *this* to include *point*. Modifies whichever sides are closest to the *point*. */
	extendToInclude(point: Vector2Readonly): void {
		this._min.x = Math.min(this._min.x, point.x);
		this._min.y = Math.min(this._min.y, point.y);
		this._max.x = Math.max(this._max.x, point.x);
		this._max.y = Math.max(this._max.y, point.y);
		this._size.sub(this._max, this._min);
		if (this._integral) {
			this._size.add(this._size, Vector2Readonly.One);
		}
	}

	/** Sets *this* to be the union of *a* and *b*. */
	union(a: RectangleReadonly, b: RectangleReadonly): void {
		this._min.x = Math.min(a.min.x, b.min.x);
		this._min.y = Math.min(a.min.y, b.min.y);
		this._max.x = Math.max(a.max.x, b.max.x);
		this._max.y = Math.max(a.max.y, b.max.y);
		this._size.sub(this._max, this._min);
		if (this._integral) {
			this._size.add(this._size, Vector2Readonly.One);
		}
	}

	/** Sets *this* to be the intersection of *a* and *b*. */
	intersection(a: RectangleReadonly, b: RectangleReadonly): void {
		this._min.x = Math.max(a.min.x, b.min.x);
		this._min.y = Math.max(a.min.y, b.min.y);
		this._max.x = Math.min(a.max.x, b.max.x);
		this._max.y = Math.min(a.max.y, b.max.y);
		if (this._max.x - this._min.x < (this._integral ? -1 : 0)) {
			this._max.x = this._min.x + (this._integral ? -1 : 0);
		}
		if (this._max.y - this._min.y < (this._integral ? -1 : 0)) {
			this._max.y = this._min.y + (this._integral ? -1 : 0);
		}
		this._size.sub(this._max, this._min);
		if (this._integral) {
			this._size.add(this._size, Vector2Readonly.One);
		}
	}
}
