import UniqueId from './unique_id';

/**
 * An item within a collection. Any class in a collection should subclass this. The subclass's constructor should take an id, then any arguments required by the collection itself, and then any extra arguments.
 */
class CollectionItem {
	/**
	 * Constructs a collection item.
	 * @param {number} id - the unique id created by the collection
	 */
	constructor(id) {
		this._id = id;
	}

	/**
	 * Destructs the item.
	 * @abstract
	 */
	destruct() {
	}

	/**
	 * Gets the unique id of the item.
	 * @returns {number}
	 */
	get id() {
		return this._id;
	}
}

/**
 * A generic collection of objects. Objects must be collection items.
 * @template Item
 */
class Collection {
	/**
	 * Constructs the collection.
	 * @param {function(new Item):Item} type - the class of the items to be constructed
	 * @param {any[]} constructorArgs - the arguments applied to every item immediately after the id argument
	 * @param {function(Item)} addCallback - a callback called just after an item is added
	 * @param {function(Item)} removeCallback - a callback called just before an item is removed
	 */
	constructor(type, constructorArgs = [], addCallback = undefined, removeCallback = undefined) {
		/**
		 * The constructor/class of the items.
		 * @type {function(new Item):Item}
		 * @private
		 */
		this._type = type;

		/**
		 * The arguments supplied to each item constructor after the id argument.
		 * @type {any[]}
		 * @private
		 */
		this._constructorArgs = constructorArgs;

		/**
		 * The callback called just after an item is added.
		 * @type {function(Item)}
		 * @private
		 */
		this._addCallback = addCallback;

		/**
		 * The callback called just before an item is removed.
		 * @type {function(Item)}
		 * @private
		 */
		this._removeCallback = removeCallback;

		/**
		 * The array of items.
		 * @type {Item[]}
		 * @private
		 */
		this._items = [];
	}

	/**
	 * Gets the item at index i. Returns undefined if the index is out of bounds.
	 * @param {number} i - the index of the item
	 * @returns {Item}
	 */
	get(index) {
		return this._items[index];
	}

	/**
	 * Gets the index of the item. Returns undefined if no item is found.
	 * @param {number} id - the id of the item
	 * @returns {number}
	 */
	find(id) {
		for (let i = 0, l = this._items.length; i < l; i++) {
			if (id === this._items[i].id) {
				return i;
			}
		}
	}

	/**
	 * Gets the number of items.
	 * @returns {number}
	 */
	get size() {
		return this._items.length;
	}

	/**
	 * Creates a new item with the params, adds it to the collection, and returns it. Calls the addCallback function just after the item's creation and addition.
	 * @param {any[]} constructorArgs - arguments that will be applied to the constructor after the id and the collection's constructor arguments
	 * @returns {Item}
	 */
	add(...constructorArgs) {
		let id = UniqueId.get();
		let item = new this._type(id, ...this._constructorArgs, ...constructorArgs);
		this._items.push(item);
		if (this._addCallback) {
			this._addCallback(item);
		}
		return item;
	}

	/**
	 * Removes an item from the collection. Calls the removeCallback function just before the item's destruction and removal.
	 * @param {number} index - the index of the item to remove
	 */
	remove(index) {
		if (0 <= index && index < this._items.length) {
			if (this._removeCallback) {
				this._removeCallback(this._items[index]);
			}
			this._items[index].destruct();
			this._items.splice(index, 1);
		}
	}
}

export {
	Collection,
	CollectionItem
};