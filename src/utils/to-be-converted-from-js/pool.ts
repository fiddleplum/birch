/**
 * Pool for keeping garbage production down.
 * @template {Type}
 */
class Pool {
	/**
	 * Constructor.
	 * @param {Type} type - The type of object that will be returned.
	 */
	constructor(type) {
		/**
		 * The type of object that will be constructed.
		 * @type {Type}
		 * @private
		 */
		this._type = type;

		/**
		 * The list of objects, free and used.
		 * @type {Array<Type>}
		 * @private
		 */
		this._objects = [];

		/**
		 * The list of indices in _objects that are free.
		 * @type {number[]}
		 * @private
		 */
		this._freeIndices = [];

		/**
		 * The number of free indices in the _freeIndices array.
		 * @type {number}
		 * @private
		 */
		this._numFreeIndices = 0;
	}

	/**
	 * Get an object from the pool.
	 * @returns {Type}
	 */
	get() {
		if (this._numFreeIndices > 0) {
			let object = this._objects[this._freeIndices[this._numFreeIndices - 1]];
			this._numFreeIndices -= 1;
			return object;
		}
		else {
			let object = new this._type();
			object._poolIndex = this._objects.length;
			this._objects.push(object);
			return object;
		}
	}

	/**
	 * Release an object back to the pool.
	 * @param {Type} object - An object previously acquired with the get() method.
	 */
	release(object) {
		if (this._numFreeIndices === this._freeIndices.length) {
			this._freeIndices.push(object._poolIndex);
		}
		else {
			this._freeIndices[this._numFreeIndices] = object._poolIndex;
		}
		this._numFreeIndices += 1;
	}
}

export default Pool;