import { UniqueId } from '../utils/unique_id';

/*

Which layout:
Use the shared layout which guarantees it can be used by any shader.
All of the queries of offsets and sizes for uniforms within a block require the shader.
But since this needs to work independent of the shader, I can't use the queries,
	which means I'll need to use the std140 layout.
Or I can have the uniform block create a super basic shader program, do the queries,
	and delete the shader program. Then I can still have shared layout.

***
I've written the code to get offsets for the uniform block.
Now I have to figure out how to actually write data to do the UBO.
***

Textures can't be in uniform blocks.

In the shader:
* Have a number of blocks and static max blocks variable.
* Have a static total number of blocks and check that against the COMBINED max blocks.
* Use GetUniformBlockIndex in the shader to get the *index* of the uniform block of a given *name*.
* Bind the uniform block to a binding point via ????
* Use UniformBlockBinding to assign a *binding point* given the *index*.

*/

export class UniformBlock extends UniqueId.Object {
	constructor(gl: WebGL2RenderingContext, uniforms: UniformBlock.Uniform[]) {
		super();

		// Save the WebGL context.
		this._gl = gl;

		// Create the buffer.
		const buffer = this._gl.createBuffer();
		if (buffer === null) {
			throw new Error('Could not create UBO buffer.');
		}
		this._buffer = buffer;

		// Setup the uniform names and types.
		this._gl.bindBuffer(gl.UNIFORM_BUFFER, this._buffer);
		for (let i = 0; i < uniforms.length; i++) {
			const uniform = uniforms[i];
			this._uniformNames.push(uniform.name);
			this._uniformInfos.set(uniform.name, {
				type: uniform.type,
				offset: 0,
				size: 0
			});
		}

		// Setup the offsets.
		this._calcShaderOffsets();
	}

	/** Sets the uniform to a value. */
	setUniform(name: string, value: number | number[]): void {
		// Get the type and offset info given the name.
		const uniformInfo = this._uniformInfos.get(name);
		if (uniformInfo === undefined) {
			throw new Error(`The uniform ${name} does not exist in this block.`);
		}
		const type = uniformInfo.type;

		if (type === UniformBlock.Type.float || type === UniformBlock.Type.int) {
			// Make sure the type and the data match.
			if (typeof value !== 'number') {
				throw new Error(`The uniform ${name} has type ${UniformBlock.Type[type]}, but the value is not a number.`);
			}
			// Set the data. Assuming hardware is little-endian.
			if (type === UniformBlock.Type.float) {
				this._dataView.setFloat32(uniformInfo.offset, value, true);
			}
			else {
				this._dataView.setInt32(uniformInfo.offset, value, true);
			}
		}
		else {
			// Make sure the type and the data match.
			if (!Array.isArray(value) || value.length !== uniformInfo.size) {
				throw new Error(`The uniform ${name} has type ${UniformBlock.Type[type]}, but the value is not a array of length ${uniformInfo.size}.`);
			}
			// Set the data. Assuming hardware is little-endian.
			if (type === UniformBlock.Type.vec2 || type === UniformBlock.Type.vec3 || type === UniformBlock.Type.vec4 || type === UniformBlock.Type.mat4x4) {
				for(let i = 0, l = value.length; i < l; i++) {
					this._dataView.setFloat32(uniformInfo.offset + i * 4, value[i], true);
				}
			}
			else {
				for(let i = 0, l = value.length; i < l; i++) {
					this._dataView.setInt32(uniformInfo.offset + i * 4, value[i], true);
				}
			}
		}
		this._dataNeedsSend = true;
	}

	/** Activate the uniform block. Sends data to WebGL if needed. */
	activate(): void {
		if (this._dataNeedsSend) {
			this._gl.bindBuffer(this._gl.UNIFORM_BUFFER, this._buffer);
			this._gl.bufferData(this._gl.UNIFORM_BUFFER, this._data, this._gl.DYNAMIC_READ);
			this._dataNeedsSend = false;
		}
	}

	/** Gets the GLSL that should be used. */
	getGLSL(): string {
		let glsl = `uniform Example {\n`;
		for (let i = 0; i < this._uniformNames.length; i++) {
			const name = this._uniformNames[i];
			const uniformInfo = this._uniformInfos.get(name) as UniformInfo;
			glsl += `\t${uniformInfo.type} ${name};\n`;
		}
		glsl += `}\n`;
		return glsl;
	}

	/** Calculates the uniform block offsets by creating a temporary shader and then querying the uniform offsets of that shader. */
	_calcShaderOffsets(): void {
		// Create the shader objects.
		const vertexObject = this._gl.createShader(this._gl.VERTEX_SHADER);
		if (vertexObject === null) {
			throw new Error('Could not create a new shader object.');
		}
		const fragmentObject = this._gl.createShader(this._gl.FRAGMENT_SHADER);
		if (fragmentObject === null) {
			throw new Error('Could not create a new shader object.');
		}
		// Compile the shader objects.
		this._gl.shaderSource(vertexObject, `#version 300 es\n${this.getGLSL()}void main() {}`);
		this._gl.compileShader(vertexObject);
		this._gl.shaderSource(fragmentObject, `#version 300 es\nvoid main() {}`);
		this._gl.compileShader(fragmentObject);
		// Create the program, attach the shader objects, and link.
		const program = this._gl.createProgram();
		if (program === null) {
			throw new Error('Could not create a new shader program.');
		}
		this._gl.attachShader(program, vertexObject);
		this._gl.attachShader(program, fragmentObject);
		this._gl.linkProgram(program);

		// Get the index of the uniform block.
		const uniformBlockIndex = this._gl.getUniformBlockIndex(program, 'Example');
		// Get the size in bytes of the uniform block, and create the data array.
		const dataSizeInBytes = this._gl.getActiveUniformBlockParameter(program, uniformBlockIndex, this._gl.UNIFORM_BLOCK_DATA_SIZE);
		this._data = new ArrayBuffer(dataSizeInBytes);
		this._dataView = new DataView(this._data);
		// Get the indices for each of the uniforms in the uniform block.
		const indicesOfUniformBlock = this._gl.getUniformIndices(program, this._uniformNames) as number[];
		// const indicesOfUniformBlock = this._gl.getActiveUniformBlockParameter(program, uniformBlockIndex, this._gl.UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES) as Uint32Array;
		const offsetsOfUniformBlock = this._gl.getActiveUniforms(program, indicesOfUniformBlock, this._gl.UNIFORM_OFFSET) as number[];
		for (let i = 0, l = offsetsOfUniformBlock.length; i < l; i++) {
			const uniformInfo = this._uniformInfos.get(this._uniformNames[i]) as UniformInfo;
			uniformInfo.offset = offsetsOfUniformBlock[i];
		}

		// Clean up the shader objects and program.
		this._gl.deleteShader(vertexObject);
		this._gl.deleteShader(fragmentObject);
		this._gl.deleteProgram(program);
	}

	/**  The WebGL context. */
	private _gl: WebGL2RenderingContext;

	/** The WebGL buffer. */
	private _buffer: WebGLBuffer;

	/** The names of the uniforms in the order they appear. */
	private _uniformNames: string[] = [];

	/** The info for the uniforms. */
	private _uniformInfos: Map<string, UniformInfo> = new Map();

	/** The data. */
	private _data: ArrayBuffer = new ArrayBuffer(0);

	/** A DataView of the data. */
	private _dataView: DataView = new DataView(this._data);

	/** If true, the data needs to be sent to the buffer. */
	private _dataNeedsSend: boolean = true;

}

class UniformInfo {
	type: UniformBlock.Type = 0;
	offset: number = 0;
	size: number = 0;
}

export namespace UniformBlock {
	/** The types of supported shader uniforms. */
	export enum Type {
		int,
		float,
		ivec2,
		ivec3,
		ivec4,
		vec2,
		vec3,
		vec4,
		mat4x4
	}

	export const sizes: Map<UniformBlock.Type, number> = new Map([
		[UniformBlock.Type.int, 1],
		[UniformBlock.Type.float, 1],
		[UniformBlock.Type.ivec2, 2],
		[UniformBlock.Type.ivec3, 3],
		[UniformBlock.Type.ivec4, 4],
		[UniformBlock.Type.vec2, 2],
		[UniformBlock.Type.vec3, 3],
		[UniformBlock.Type.vec4, 4],
		[UniformBlock.Type.mat4x4, 16],
	]);

	/** The basic interface for declaring a uniform. */
	export interface Uniform {
		name: string;
		type: Type;
	}
}
