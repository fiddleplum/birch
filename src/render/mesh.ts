import { UniqueId } from '../utils/unique_id';

/** A mesh. */
export class Mesh extends UniqueId.Object {
	/** The constructor.
	 * @param numVerticesPerPrimitive - The number of vertices per primitive. 1 means points, 2 means lines, and 3 means triangles.
	 * @param vertexFormat - The vertex format. Each element refers to a separate array of vertices,
	 * and each sub-array refers to the list of components (in order) of each vertex.
	*/
	constructor(gl: WebGL2RenderingContext, numVerticesPerPrimitive: number, vertexFormat: Mesh.Component[][]) {
		super();

		// Save the WebGL context.
		this._gl = gl;

		try {
			// Create the vertex array object.
			const vertexArrayObject = this._gl.createVertexArray();
			if (vertexArrayObject === null) {
				throw new Error('Could not create the vertex array object.');
			}
			this._vertexArrayObject = vertexArrayObject;

			// Setup the vertex buffers array.
			this._vertexBuffers = [];

			// Create the index buffer.
			const indexBuffer = this._gl.createBuffer();
			if (indexBuffer === null) {
				throw new Error('Could not create the index buffer.');
			}
			this._indexBuffer = indexBuffer;

			// Since there are no indices, set the number of indices to zero.
			this._numIndices = 0;

			// Set the initial indices type to 16-bit.
			this._glIndicesType = this._gl.UNSIGNED_SHORT;

			// Set the initial number of instances to 1.
			this._numInstances = 1;

			// Set the mode.
			if (numVerticesPerPrimitive === 1) {
				this._mode = this._gl.POINTS;
			}
			else if (numVerticesPerPrimitive === 2) {
				this._mode = this._gl.LINES;
			}
			else if (numVerticesPerPrimitive === 3) {
				this._mode = this._gl.TRIANGLES;
			}
			else {
				throw new Error('Invalid number of vertices per primitive.');
			}

			// Set the vertex format.
			this._setVertexFormat(vertexFormat);
		}
		catch (e) {
			this.destroy();
			throw e;
		}

		// Add it to the set of all created meshes.
		if (Mesh._all.get(gl) === undefined) {
			Mesh._all.set(gl, new Set());
		}
		Mesh._all.get(gl)?.add(this);
	}

	/** Destroys the mesh. */
	destroy(): void {
		for (let i = 0; i < this._vertexBuffers.length; i++) {
			this._gl.deleteBuffer(this._vertexBuffers[i]);
		}
		this._gl.deleteBuffer(this._indexBuffer);
		this._gl.deleteVertexArray(this._vertexArrayObject);
		Mesh._all.get(this._gl)?.delete(this);
		super.destroy();
	}

	/** Sets the *vertices* for a particular buffer.
	 * @param index - The buffer index to use.
	 * @param vertices - The actual vertex data. It must be in the same format as specified in the constructor.
	 * @param dynamic - Specifies if the data will be changed often or not. If you are unsure, set it to false. */
	setVertices(index: number, vertices: number[], dynamic: boolean): void {
		if (index < 0 || this._vertexBuffers.length <= index) {
			throw new Error('Index out of bounds');
		}
		let glUsage = this._gl.STATIC_DRAW;
		if (dynamic) {
			glUsage = this._gl.DYNAMIC_DRAW;
		}
		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._vertexBuffers[index]);
		this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(vertices), glUsage);
	}

	/** Sets the *indices*. If *use32BitIndices* is true, each index will be 32 bits so that they
	 * can refer to more than 2^16 vertices. */
	setIndices(indices: number[], use32BitIndices: boolean): void {
		this._glIndicesType = use32BitIndices ? this._gl.UNSIGNED_INT : this._gl.UNSIGNED_SHORT;
		this._numIndices = indices.length;
		const array = use32BitIndices ? new Uint32Array(indices) : new Uint16Array(indices);

		// Bind the buffer and send the data.
		this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
		this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, array, this._gl.STATIC_DRAW);
	}

	/** Sets the number of instances. */
	setNumInstances(numInstances: number): void {
		this._numInstances = numInstances;
	}

	/** Renders the mesh. */
	render(): void {
		// Bind the vertex array object.
		this._gl.bindVertexArray(this._vertexArrayObject);

		// Bind the index buffer.
		this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);

		// Draw the mesh.
		this._gl.drawElementsInstanced(this._mode, this._numIndices, this._glIndicesType, 0, this._numInstances);
	}

	/** Sets the vertex format. Each element refers to a separate array of vertices,
	 * and each sub-array refers to the list of components (in order) of each vertex. */
	private _setVertexFormat(vertexFormat: Mesh.Component[][]): void {
		// Bind the vertex array.
		this._gl.bindVertexArray(this._vertexArrayObject);

		// Go through each vertex buffer.
		for (let i = 0; i < vertexFormat.length; i++) {
			const components = vertexFormat[i];

			// Create and bind the vertex buffer.
			const vertexBuffer = this._gl.createBuffer();
			if (vertexBuffer === null) {
				throw new Error('Could not create the vertex buffer.');
			}
			this._vertexBuffers.push(vertexBuffer);
			this._gl.bindBuffer(this._gl.ARRAY_BUFFER, vertexBuffer);

			// Calculate the bytes per vertex.
			let bytesPerVertex = 0;
			for (let j = 0; j < components.length; j++) {
				const component = components[j];
				bytesPerVertex += component.numBytes;
			}

			// Setup the vertex array objectt.
			let offset = 0;
			for (let j = 0; j < components.length; j++) {
				const component = components[j];

				// Enable the attribute location.
				this._gl.enableVertexAttribArray(component.location);

				// Get the WebGL type.
				let glType = this._gl.FLOAT;
				switch (component.type) {
					case 'float': glType = this._gl.FLOAT; break;
					case 'byte': glType = this._gl.BYTE; break;
					case 'ubyte': glType = this._gl.UNSIGNED_BYTE; break;
					case 'short': glType = this._gl.SHORT; break;
					case 'ushort': glType = this._gl.UNSIGNED_SHORT; break;
				}

				// Assign the currently bound vertex buffer to the attribute location with the given format.
				this._gl.vertexAttribPointer(component.location, component.dimensions, glType, false, bytesPerVertex, offset);

				// Set whether this component is instanced or not.
				if (component.instanced) {
					this._gl.vertexAttribDivisor(component.location, 1);
				}

				// Increase the offset.
				offset += component.numBytes;
			}
		}
	}

	/**  The WebGL context. */
	private _gl: WebGL2RenderingContext;

	/** The vertex array object. */
	private _vertexArrayObject: WebGLVertexArrayObject | null = null;

	/** The vertex buffers. */
	private _vertexBuffers: WebGLBuffer[] = [];

	/** The WebGL index buffer that will be rendered. */
	private _indexBuffer: WebGLBuffer | null = null;

	/** The type of primitive to render. It can be points, lines, or triangles. */
	private _mode: GLenum;

	/** The number of indices to render, calculated in `setIndices`. */
	private _numIndices: number;

	/** If true, the indices are 32-bits, which means they can refer to more than 2^16 vertices. */
	private _glIndicesType: GLenum;

	/** The number of instanes to render. */
	private _numInstances: number;

	/** A set of all created meshes, one for each WebGL context. */
	private static _all: Map<WebGL2RenderingContext, Set<Mesh>> = new Map();
}

export namespace Mesh {
	export class Component {
		/** The WebGL location of the component. */
		location: number;

		/** The type of component, either 'float', 'byte', 'ubyte' | 'short', 'ushort'. */
		type: 'float' | 'byte' | 'ubyte' | 'short' | 'ushort';

		/** The number of dimensions of the component. */
		dimensions: number;

		/** If true, the component is instanced and will be used on a per instance basis. */
		instanced: boolean;

		/** The number of bytes for the component. */
		numBytes: number;

		constructor(location: number, type: 'float' | 'byte' | 'ubyte' | 'short' | 'ushort', dimensions: number, instanced: boolean) {
			// Assign the members.
			this.location = location;
			this.type = type;
			this.dimensions = dimensions;
			this.instanced = instanced;

			// Calculate the number of bytes for the component.
			let bytesPerDimension = 1;
			if (this.type === 'float') {
				bytesPerDimension = 4;
			}
			switch (this.type) {
				case 'float': bytesPerDimension = 4; break;
				case 'byte': bytesPerDimension = 1; break;
				case 'ubyte': bytesPerDimension = 1; break;
				case 'short': bytesPerDimension = 2; break;
				case 'ushort': bytesPerDimension = 2; break;
			}
			this.numBytes = bytesPerDimension * this.dimensions;
		}
	}
}
