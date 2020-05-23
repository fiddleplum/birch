/** A mesh. */
export class Mesh {
	/**  The WebGL context. */
	private _gl: WebGLRenderingContext;

	/** The WebGL vertex buffer that will be rendered. It uses interleaved vertices. */
	private _vertexBuffer: WebGLBuffer;

	/** The WebGL index buffer that will be rendered. */
	private _indexBuffer: WebGLBuffer;

	/** The type of primitive to render. It can be points, lines, or triangles. */
	private _mode: GLenum;

	/** The list of components that make up a vertex. */
	private _vertexComponents: Mesh.VertexComponent[];

	/** The number of bytes per vertex, calculated from the vertex components. */
	private _bytesPerVertex: number;

	/** The number of indices, used in rendering. */
	private _numIndices: number;

	/** The constructor. */
	constructor(gl: WebGLRenderingContext) {
		// Save the WebGL context.
		this._gl = gl;

		// Create the vertex buffer.
		const vertexBuffer = this._gl.createBuffer();
		if (vertexBuffer === null) {
			throw new Error('Could not create the vertex buffer.');
		}
		this._vertexBuffer = vertexBuffer;

		// Create the index buffer.
		const indexBuffer = this._gl.createBuffer();
		if (indexBuffer === null) {
			throw new Error('Could not create the index buffer.');
		}
		this._indexBuffer = indexBuffer;

		// Set the mode to triangles.
		this._mode = this._gl.TRIANGLES;

		// Initialize the vertex components to be empty.
		this._vertexComponents = [];

		// Since there are no components, set the bytes per vertex to zero.
		this._bytesPerVertex = 0;

		// Since there are no indices, set the number of indices to zero.
		this._numIndices = 0;
	}

	/** Destroys the mesh. */
	destroy(): void {
		this._gl.deleteBuffer(this._vertexBuffer);
		this._gl.deleteBuffer(this._indexBuffer);
	}

	/** Sets the number of vertices per primitive. 1 means points, 2 means lines, and 3 means triangles. Defaults to 3. */
	set numVerticesPerPrimitive(numVerticesPerPrimitive: number) {
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
	}

	/** Adds a component to definition of the vertex.
	 * @param location - The WebGL location of the component.
	 * @param offset - The offset in bytes of the component from the beginning of each vertex.
	 * @param dimensions - The number of dimensions of the component (1, 2, 3, or 4). */
	addVertexComponent(location: number, offset: number, dimensions: number): void {
		const vertexComponent = new Mesh.VertexComponent(location, offset, dimensions);
		this._vertexComponents.push(vertexComponent);
		if (this._bytesPerVertex < (offset + dimensions) * 4) {
			this._bytesPerVertex = (offset + dimensions) * 4;
		}
	}

	/** Sets the vertices. They must be in the same format as the vertex component definitions from `addVertexComponent()`. */
	set vertices(vertices: number[]) {
		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._vertexBuffer);
		this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(vertices), this._gl.STATIC_DRAW);
	}

	/** Sets the indices. */
	set indices(indices: number[]) {
		this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
		this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this._gl.STATIC_DRAW);
		this._numIndices = indices.length;
	}

	/** Renders the mesh. */
	render(): void {
		// Bind the vertex buffer.
		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._vertexBuffer);

		// Enable the vertex attribute arrays for each component.
		for (let componentIndex = 0; componentIndex < this._vertexComponents.length; componentIndex++) {
			const component = this._vertexComponents[componentIndex];
			this._gl.enableVertexAttribArray(component.location);
			this._gl.vertexAttribPointer(component.location, component.dimensions, this._gl.FLOAT, false, this._bytesPerVertex, component.offset * 4);
		}

		// Bind the index buffer.
		this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);

		// Draw the mesh.
		this._gl.drawElements(this._mode, this._numIndices, this._gl.UNSIGNED_SHORT, 0);
	}
}

export namespace Mesh {
	export class VertexComponent {
		/** The WebGL location of the component. */
		location: number;

		/** The offset in bytes from the beginning of a vertex. */
		offset: number;

		/** The number of dimensions of the component. */
		dimensions: number;

		/** The constructor. */
		constructor(location: number, offset: number, dimensions: number) {
			this.location = location;
			this.offset = offset;
			this.dimensions = dimensions;
		}
	}
}
