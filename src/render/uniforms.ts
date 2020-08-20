import { UniqueId } from '../utils/unique_id';
import { Texture } from './texture';
import { FastMap } from '../utils/fast_map';

/** A group of uniforms that can be used by a stage, scene, model, or model group. */
export class Uniforms extends UniqueId.Object {
	constructor(gl: WebGL2RenderingContext) {
		super();

		// Save the WebGL context.
		this._gl = gl;

		// Create the uniform buffer.
		const buffer = this._gl.createBuffer();
		if (buffer === null) {
			throw new Error('Could not create UBO buffer.');
		}
		this._buffer = buffer;
	}

	/** Destroys this. */
	destroy(): void {
		// Delete the buffer.
		this._gl.deleteBuffer(this._buffer);
		super.destroy();
	}

	/** Gets the textures of the uniforms. */
	get textures(): FastMap<string, Texture> {
		return this._textures;
	}

	/** Sets the uniforms. */
	setUniformTypes(uniforms: Uniforms.Uniform[]): void {
		// Clean up any previous uniforms.
		this._uniformBlockNames = [];
		this._samplerNames = [];
		this._uniformBlockInfos.clear();
		this._textures.clear();
		// Setup the uniform names and types.
		this._gl.bindBuffer(this._gl.UNIFORM_BUFFER, this._buffer);
		for (let i = 0; i < uniforms.length; i++) {
			const uniform = uniforms[i];
			if (uniform.type === Uniforms.Type.sampler2D) {
				this._samplerNames.push(uniform.name);
			}
			else {
				this._uniformBlockNames.push(uniform.name);
				this._uniformBlockInfos.set(uniform.name, {
					type: uniform.type,
					offset: 0,
					numComponents: Uniforms.NumComponents.get(uniform.type) as number
				});
			}
		}

		// Setup the offsets.
		if (this._uniformBlockNames.length > 0) {
			this._calcUniformBlockOffsets();
		}
	}

	/** Sets the uniform to a value. */
	setUniform(name: string, value: number | readonly number[] | Texture): void {
		if (value instanceof Texture) {
			if (!this._samplerNames.includes(name)) {
				throw new Error(`There is no sampler with the name ${name}.`);
			}
			this._textures.set(name, value);
		}
		else {
			// Get the info for the uniform.
			const uniformBlockInfo = this._uniformBlockInfos.get(name);
			if (uniformBlockInfo === undefined) {
				throw new Error(`The uniform ${name} does not exist.`);
			}
			const type = uniformBlockInfo.type;
			if (type === Uniforms.Type.float || type === Uniforms.Type.int) {
				// Make sure the type and the data match.
				if (typeof value !== 'number') {
					throw new Error(`The uniform ${name} has type ${Uniforms.Type[type]}, but the value is not a number.`);
				}
				// Set the data. Assuming hardware is little-endian.
				if (type === Uniforms.Type.float) {
					this._dataView.setFloat32(uniformBlockInfo.offset, value, true);
				}
				else {
					this._dataView.setInt32(uniformBlockInfo.offset, value, true);
				}
			}
			else { // A number array such as vec4 or mat4x4.
				// Make sure the type and the data match.
				if (!Array.isArray(value) || value.length !== uniformBlockInfo.numComponents) {
					throw new Error(`The uniform ${name} has type ${Uniforms.Type[type]}, but the value is not a array of length ${uniformBlockInfo.numComponents}.`);
				}
				// Set the data. Assuming hardware is little-endian.
				if (type === Uniforms.Type.vec2 || type === Uniforms.Type.vec3 || type === Uniforms.Type.vec4 || type === Uniforms.Type.mat4x4) {
					for(let i = 0, l = value.length; i < l; i++) {
						this._dataView.setFloat32(uniformBlockInfo.offset + i * 4, value[i], true);
					}
				}
				else {
					for(let i = 0, l = value.length; i < l; i++) {
						this._dataView.setInt32(uniformBlockInfo.offset + i * 4, value[i], true);
					}
				}
			}
			this._dataNeedsSend = true;
		}
	}

	/** Binds the uniform buffer to a binding point. Sends changed data to WebGL if needed. */
	bindUniformBuffer(bindingPoint: number): void {
		if (this._uniformBlockNames.length === 0) {
			return;
		}
		if (this._dataNeedsSend) {
			this._gl.bindBuffer(this._gl.UNIFORM_BUFFER, this._buffer);
			this._gl.bufferData(this._gl.UNIFORM_BUFFER, this._data, this._gl.DYNAMIC_READ);
			this._dataNeedsSend = false;
		}
		this._gl.bindBufferBase(this._gl.UNIFORM_BUFFER, bindingPoint, this._buffer);
	}

	/** Unbinds the uniform buffer from the binding point. */
	unbindUniformBuffer(bindingPoint: number): void {
		this._gl.bindBufferBase(this._gl.UNIFORM_BUFFER, bindingPoint, null);
	}

	/** Gets the GLSL that should be used. */
	getGLSL(): string {
		let glsl = '';
		// Add the uniform block.
		if (this._uniformBlockNames.length > 0) {
			glsl += `uniform Example {\n`;
			for (let i = 0; i < this._uniformBlockNames.length; i++) {
				const name = this._uniformBlockNames[i];
				const uniformBlockInfo = this._uniformBlockInfos.get(name) as UniformInfo;
				glsl += `\t${Uniforms.Type[uniformBlockInfo.type]} ${name};\n`;
			}
			glsl += `};\n`;
		}
		for (let i = 0; i < this._samplerNames.length; i++) {
			glsl += `uniform sampler2D ${this._samplerNames[i]};\n`;
		}
		return glsl;
	}

	/** Calculates the uniform block offsets by creating a temporary shader and then querying the uniform offsets of that shader. */
	private _calcUniformBlockOffsets(): void {
		// Create the vertex shader object.
		const vertexObject = this._gl.createShader(this._gl.VERTEX_SHADER);
		if (vertexObject === null) {
			throw new Error('Could not create a new shader object.');
		}
		this._gl.shaderSource(vertexObject, `#version 300 es\n${this.getGLSL()}void main() {}`);
		// Compile the vertex shader objects
		this._gl.compileShader(vertexObject);
		const success = this._gl.getShaderParameter(vertexObject, this._gl.COMPILE_STATUS) as GLboolean;
		if (!success) {
			const error = this._gl.getShaderInfoLog(vertexObject);
			this._gl.deleteShader(vertexObject);
			throw new Error('The uniform block\'s shader object did not compile correctly: ' + error);
		}
		// Create the fragment shader object.
		const fragmentObject = this._gl.createShader(this._gl.FRAGMENT_SHADER);
		if (fragmentObject === null) {
			this._gl.deleteShader(vertexObject);
			throw new Error('Could not create a new shader object.');
		}
		this._gl.shaderSource(fragmentObject, `#version 300 es\nvoid main() {}`);
		// Compile the fragment shader object.
		this._gl.compileShader(fragmentObject);
		// Create the program, attach the shader objects, and link.
		const program = this._gl.createProgram();
		if (program === null) {
			this._gl.deleteShader(vertexObject);
			this._gl.deleteShader(fragmentObject);
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
		const indicesOfUniformBlock = this._gl.getUniformIndices(program, this._uniformBlockNames) as number[];
		const offsetsOfUniformBlock = this._gl.getActiveUniforms(program, indicesOfUniformBlock, this._gl.UNIFORM_OFFSET) as number[];
		for (let i = 0, l = offsetsOfUniformBlock.length; i < l; i++) {
			const uniformBlockInfo = this._uniformBlockInfos.get(this._uniformBlockNames[i]) as UniformInfo;
			uniformBlockInfo.offset = offsetsOfUniformBlock[i];
		}
		this._dataNeedsSend = true;

		// Clean up the shader objects and program.
		this._gl.deleteProgram(program);
		this._gl.deleteShader(vertexObject);
		this._gl.deleteShader(fragmentObject);
	}

	/**  The WebGL context. */
	private _gl: WebGL2RenderingContext;

	/** The WebGL buffer. It will hold all non-opaque variables. */
	private _buffer: WebGLBuffer;

	/** The names of the uniforms in the uniform block in the order they appear. */
	private _uniformBlockNames: string[] = [];

	/** The names of the samplers. */
	private _samplerNames: string[] = [];

	/** The info for the uniforms. */
	private _uniformBlockInfos: Map<string, UniformInfo> = new Map();

	/** The data. */
	private _data: ArrayBuffer = new ArrayBuffer(0);

	/** A mapping from samplers to textures. */
	private _textures: FastMap<string, Texture> = new FastMap();

	/** A DataView of the data. */
	private _dataView: DataView = new DataView(this._data);

	/** If true, the data needs to be sent to the buffer. */
	private _dataNeedsSend: boolean = true;
}

class UniformInfo {
	type: Uniforms.Type = 0;
	offset: number = 0;
	numComponents: number = 0;
}

export namespace Uniforms {
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
		mat4x4,
		sampler2D
	}

	export const NumComponents: Map<Uniforms.Type, number> = new Map([
		[Uniforms.Type.int, 1],
		[Uniforms.Type.float, 1],
		[Uniforms.Type.ivec2, 2],
		[Uniforms.Type.ivec3, 3],
		[Uniforms.Type.ivec4, 4],
		[Uniforms.Type.vec2, 2],
		[Uniforms.Type.vec3, 3],
		[Uniforms.Type.vec4, 4],
		[Uniforms.Type.mat4x4, 16],
		[Uniforms.Type.sampler2D, 1]
	]);

	/** The basic interface for declaring a uniform. */
	export interface Uniform {
		name: string;
		type: Type;
	}
}
