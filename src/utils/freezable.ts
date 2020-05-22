/** A base class that allows for an object to be frozen and thawed to ease issues with passing by reference 'value' objects. */
class Freezable {
	/**
	 * Constructor.
	 */
	constructor() {
		/**
		 * The frozen flag.
		 * @type {boolean}
		 * @private
		 */
		this._frozen = false;
	}

	/**
	 * Freezes the object. Any modifications fo the object should throw the TypeError.
	 */
	freeze() {
		this._frozen = true;
	}

	/**
	 * Thaws the object. Modifications are now allowed.
	 */
	thaw() {
		this._frozen = false;
	}

	/**
	 * Throws a TypeError if the object is frozen. Called by sub-classes at the beginning of all non-const methods.
	 */
	throwIfFrozen() {
		if (this._frozen) {
			throw new TypeError('Attempt to modify a frozen object.');
		}
	}
}

export default Freezable;
