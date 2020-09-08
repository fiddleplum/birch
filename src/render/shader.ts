import { UniqueId } from '../utils/unique_id';

/** A shader. */
export class Shader extends UniqueId.Object {
	/** The constructor. */
	constructor(gl: WebGL2RenderingContext) {
		super();

		// Save the WebGL context.
		this._gl = gl;

		// Create the program.
		const program = this._gl.createProgram();
		if (program === null) {
			throw new Error('Could not create a new shader program.');
		}
		this._program = program;
	}

	/** Destructs the shader. */
	destroy(): void {
		// Delete the program.
		this._gl.deleteProgram(this._program);
		super.destroy();
	}

	/** Sets the shader from an options configuration. */
	setFromOptions(options: Shader.Options): void {
		let vertexCode = '';
		if (Array.isArray(options.vertex)) {
			vertexCode = options.vertex.join('\n');
		}
		else {
			vertexCode = options.vertex;
		}

		let fragmentCode = '';
		if (Array.isArray(options.fragment)) {
			fragmentCode = options.fragment.join('\n');
		}
		else {
			fragmentCode = options.fragment;
		}
		this.setCodeAndAttributes(vertexCode, fragmentCode, options.attributeLocations);
	}

	/** Sets the vertex and fragment code for the shader and bind the attribute locations. */
	setCodeAndAttributes(vertexCode: string, fragmentCode: string, attributeLocations: { [key: string]: number }): void {
		let vertexObject: WebGLShader | undefined = undefined;
		let fragmentObject: WebGLShader | undefined = undefined;
		try {
			// Compile the shader stages.
			vertexObject = this._compile(vertexCode, this._gl.VERTEX_SHADER);
			fragmentObject = this._compile(fragmentCode, this._gl.FRAGMENT_SHADER);
			// Link the shader program.
			this._link(vertexObject, fragmentObject, attributeLocations);
		}
		finally {
			if (vertexObject !== undefined) {
				this._gl.deleteShader(vertexObject);
			}
			if (fragmentObject !== undefined) {
				this._gl.deleteShader(fragmentObject);
			}
		}
		this._initializeUniformBlocks();
		this._initializeUniforms();
		this._initializeAttributes();
		this._programIsValid = true;
	}

	/** Returns true if the shader has been loaded. */
	get isLoaded(): boolean {
		return this._programIsValid;
	}

	/** Activates the shader for use in rendering. */
	activate(): void {
		if (this._programIsValid) {
			this._gl.useProgram(this._program);
		}
	}

	/** Gets the uniform location from its name. Throws an error if the name is not found. */
	getUniformLocation(name: string): WebGLUniformLocation {
		const location = this._uniformNamesToLocations.get(name);
		if (location === undefined) {
			throw new Error('Could not get location for uniform ' + name + '.');
		}
		return location;
	}

	/** Gets the attribute location from its name. Throws an error if the name is not found. */
	getAttributeLocation(name: string): number {
		const location = this._attributeNamesToLocations.get(name);
		if (location === undefined) {
			throw new Error('Could not get location for attribute ' + name + '.');
		}
		return location;
	}

	/** Gets the binding index for the uniform block name. */
	getUniformBlockBindingPoint(uniformBlockName: string): number | undefined {
		const uniformBlockBindingPoint = this._uniformBlockNamesToBindingPoints.get(uniformBlockName);
		return uniformBlockBindingPoint;
	}

	/** Gets the binding index for the sampler name. */
	getSamplerTextureUnit(samplerName: string): number | undefined {
		const samplerTextureUnit = this._samplerNamesToTextureUnits.get(samplerName);
		return samplerTextureUnit;
	}

	// /** Binds a uniform block name to a binding slot. */
	// bindUniformBlock(uniformBlockName: string, bindingSlot: number): void {
	// 	const uniformBlockIndex = this._uniformBlockNamesToIndices.get(uniformBlockName);
	// 	if (uniformBlockIndex === undefined) {
	// 		throw new Error('Uniform block with name ' + uniformBlockName + ' does not exist in the shader.');
	// 	}
	// 	this._gl.uniformBlockBinding(this._program, uniformBlockIndex, bindingSlot);
	// }

	// /** Sets the uniform location to an integer value. */
	// setUniformInt(location: WebGLUniformLocation, value: number): void {
	// 	const existingValue = this._uniformLocationsToValues.get(location);
	// 	if (existingValue !== value) {
	// 		this._uniformLocationsToValues.set(location, value);
	// 		this._gl.uniform1i(location, value);
	// 	}
	// }

	// /** Sets the uniform location to a Vector2 value. */
	// setUniformInt2(location: WebGLUniformLocation, value: number[]): void {
	// 	const existingValue = this._uniformLocationsToValues.get(location);
	// 	if (existingValue instanceof Array && !Shader._arrayEquals(existingValue, value, 2)) {
	// 		Shader._arrayCopy(existingValue, value, 2);
	// 		this._gl.uniform2iv(location, value);
	// 	}
	// }

	// /** Sets the uniform location to a Vector3 value. */
	// setUniformInt3(location: WebGLUniformLocation, value: number[]): void {
	// 	const existingValue = this._uniformLocationsToValues.get(location);
	// 	if (existingValue instanceof Array && !Shader._arrayEquals(existingValue, value, 3)) {
	// 		Shader._arrayCopy(existingValue, value, 3);
	// 		this._gl.uniform3iv(location, value);
	// 	}
	// }

	// /** Sets the uniform location to a Vector4 value. */
	// setUniformInt4(location: WebGLUniformLocation, value: number[]): void {
	// 	const existingValue = this._uniformLocationsToValues.get(location);
	// 	if (existingValue instanceof Array && !Shader._arrayEquals(existingValue, value, 4)) {
	// 		Shader._arrayCopy(existingValue, value, 4);
	// 		this._gl.uniform4iv(location, value);
	// 	}
	// }

	// /** Sets the uniform location to a floating-point value. */
	// setUniformFloat(location: WebGLUniformLocation, value: number): void {
	// 	const existingValue = this._uniformLocationsToValues.get(location);
	// 	if (typeof existingValue === 'number' && existingValue !== value) {
	// 		this._uniformLocationsToValues.set(location, value);
	// 		this._gl.uniform1f(location, value);
	// 	}
	// }

	// /** Sets the uniform location to a Vector2 value. */
	// setUniformFloat2(location: WebGLUniformLocation, value: number[]): void {
	// 	const existingValue = this._uniformLocationsToValues.get(location);
	// 	if (existingValue instanceof Array && !Shader._arrayEquals(existingValue, value, 2)) {
	// 		Shader._arrayCopy(existingValue, value, 2);
	// 		this._gl.uniform2fv(location, value);
	// 	}
	// }

	// /** Sets the uniform location to a Vector3 value. */
	// setUniformFloat3(location: WebGLUniformLocation, value: number[]): void {
	// 	const existingValue = this._uniformLocationsToValues.get(location);
	// 	if (existingValue instanceof Array && !Shader._arrayEquals(existingValue, value, 3)) {
	// 		Shader._arrayCopy(existingValue, value, 3);
	// 		this._gl.uniform3fv(location, value);
	// 	}
	// }

	// /** Sets the uniform location to a Vector4 value. */
	// setUniformFloat4(location: WebGLUniformLocation, value: number[]): void {
	// 	const existingValue = this._uniformLocationsToValues.get(location);
	// 	if (existingValue instanceof Array && !Shader._arrayEquals(existingValue, value, 4)) {
	// 		Shader._arrayCopy(existingValue, value, 4);
	// 		this._gl.uniform4fv(location, value);
	// 	}
	// }

	// /** Sets the uniform location to a Matrix44 value. */
	// setUniformMatrix44(location: WebGLUniformLocation, value: number[]): void {
	// 	const existingValue = this._uniformLocationsToValues.get(location);
	// 	if (existingValue instanceof Array && !Shader._arrayEquals(existingValue, value, 16)) {
	// 		Shader._arrayCopy(existingValue, value, 16);
	// 		this._gl.uniformMatrix4fv(location, false, value);
	// 	}
	// }

	// /** Sets the uniform location to the texture slot. */
	// setTexture(nameOrLocation: string | WebGLUniformLocation, textureSlot: number): void {
	// 	if (typeof nameOrLocation === 'string') {
	// 		nameOrLocation = this.getUniformLocation('colorTexture');
	// 	}
	// 	const existingValue = this._uniformLocationsToValues.get(nameOrLocation);
	// 	if (existingValue !== textureSlot) {
	// 		this._uniformLocationsToValues.set(nameOrLocation, textureSlot);
	// 		this._gl.uniform1i(nameOrLocation, textureSlot);
	// 	}
	// }

	/** Compiles some shader code to create a shader object. */
	private _compile(shaderCode: string, shaderType: number): WebGLShader {
		// Create the shader object.
		const shaderObject = this._gl.createShader(shaderType);
		if (shaderObject === null) {
			throw new Error('Could not create a new shader object.');
		}

		// Supply the source.
		this._gl.shaderSource(shaderObject, shaderCode);

		// Compile the shader object.
		this._gl.compileShader(shaderObject);

		// Check for success.
		const success = this._gl.getShaderParameter(shaderObject, this._gl.COMPILE_STATUS) as GLboolean;
		if (!success) {
			const error = this._gl.getShaderInfoLog(shaderObject);
			this._gl.deleteShader(shaderObject);
			throw new Error('The shader object did not compile correctly: ' + error);
		}
		return shaderObject;
	}

	/** Links shader objects to create a shader program. */
	private _link(vertexObject: WebGLShader, fragmentObject: WebGLShader, attributeLocations: { [key: string]: number }): void {
		// Attach the shader objects.
		this._gl.attachShader(this._program, vertexObject);
		this._gl.attachShader(this._program, fragmentObject);

		// Bind the given attrbute locations.
		for (const [key, value] of Object.entries(attributeLocations)) {
			this._gl.bindAttribLocation(this._program, value, key);
		}

		// Link the shaders to the program.
		this._gl.linkProgram(this._program);

		// Detach the shader objects.
		this._gl.detachShader(this._program, vertexObject);
		this._gl.detachShader(this._program, fragmentObject);

		// Check for success.
		const success = this._gl.getProgramParameter(this._program, this._gl.LINK_STATUS) as GLboolean;
		if (!success) {
			const error = this._gl.getProgramInfoLog(this._program);
			throw new Error('The shader program did not link correctly: ' + error);
		}
	}

	/** Gets the mapping from uniform blocks to indices. */
	private _initializeUniformBlocks(): void {
		let nextOpenBindingPoint = 3;
		const numUniformBlocks = this._gl.getProgramParameter(this._program, this._gl.ACTIVE_UNIFORM_BLOCKS);
		for (let uniformBlockIndex = 0; uniformBlockIndex < numUniformBlocks; uniformBlockIndex++) {
			const uniformBlockName = this._gl.getActiveUniformBlockName(this._program, uniformBlockIndex);
			if (uniformBlockName === null) {
				continue;
			}
			// The uniform blocks stage, scene, and model always have constant binding indices.
			if (uniformBlockName === 'stage') {
				this._gl.uniformBlockBinding(this._program, uniformBlockIndex, 0);
			}
			else if (uniformBlockName === 'scene') {
				this._gl.uniformBlockBinding(this._program, uniformBlockIndex, 1);
			}
			else if (uniformBlockName === 'model') {
				this._gl.uniformBlockBinding(this._program, uniformBlockIndex, 2);
			}
			else {
				this._gl.uniformBlockBinding(this._program, uniformBlockIndex, nextOpenBindingPoint);
				this._uniformBlockNamesToBindingPoints.set(uniformBlockName, nextOpenBindingPoint);
				nextOpenBindingPoint += 1;
			}
		}
	}

	/** Gets the mapping from uniform names to locations. */
	private _initializeUniforms(): void {
		this._gl.useProgram(this._program);
		const numUniforms = this._gl.getProgramParameter(this._program, this._gl.ACTIVE_UNIFORMS);
		const maxTextureUnits = this._gl.getParameter(this._gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
		let nextTextureUnit = 0;
		for (let i = 0; i < numUniforms; i++) {
			const uniformInfo = this._gl.getActiveUniform(this._program, i);
			if (uniformInfo === null) {
				throw new Error('Error getting the uniform info ' + i + ' for the shader.');
			}
			const location = this._gl.getUniformLocation(this._program, uniformInfo.name);
			if (location === null) {
				continue;
			}
			this._uniformNamesToLocations.set(uniformInfo.name, location);
			let initialValue: number | number[] = 0;
			if (![this._gl.BOOL, this._gl.INT, this._gl.FLOAT, this._gl.SAMPLER_2D, this._gl.SAMPLER_CUBE].includes(uniformInfo.type)) {
				initialValue = [];
			}
			if (uniformInfo.type === this._gl.SAMPLER_2D) {
				if (nextTextureUnit >= maxTextureUnits) {
					throw new Error('At least ' + nextTextureUnit + ' textures, but the maximum supported is ' + maxTextureUnits + '.');
				}
				this._gl.uniform1i(location, nextTextureUnit);
				this._samplerNamesToTextureUnits.set(uniformInfo.name, nextTextureUnit);
				nextTextureUnit += 1;
			}
			this._uniformLocationsToValues.set(location, initialValue);
		}
	}

	/** Gets the mapping from attribute names to locations. */
	private _initializeAttributes(): void {
		const numAttributes = this._gl.getProgramParameter(this._program, this._gl.ACTIVE_ATTRIBUTES);
		for (let i = 0; i < numAttributes; i++) {
			const activeAttrib = this._gl.getActiveAttrib(this._program, i);
			if (activeAttrib === null) {
				throw new Error('Error getting the attribute ' + i + ' on the shader.');
			}
			const location = this._gl.getAttribLocation(this._program, activeAttrib.name);
			if (location === -1) {
				return;
			}
			this._attributeNamesToLocations.set(activeAttrib.name, location);
		}
	}

	/** Returns true if every element in a and b are equal. It assumes that a and b have the same length l. */
	private static _arrayEquals(a: number[], b: number[], l: number): boolean {
		for (let i = 0; i < l; i++) {
			if (a[i] !== b[i]) {
				return false;
			}
		}
		return true;
	}

	/** Copies every element in b to a. It assumes that b has length l. */
	private static _arrayCopy(a: number[], b: number[], l: number): void {
		for (let i = 0; i < l; i++) {
			a[i] = b[i];
		}
	}

	/**  The WebGL context. */
	private _gl: WebGL2RenderingContext;

	/** A mapping from uniform block names to binding indices. */
	private _uniformBlockNamesToBindingPoints: Map<string, number> = new Map();

	/** A mapping from sampler names to binding indices. */
	private _samplerNamesToTextureUnits: Map<string, number> = new Map();

	/** A mapping from uniform names to locations. */
	private _uniformNamesToLocations: Map<string, WebGLUniformLocation> = new Map();

	/** A mapping from uniform locations to values. */
	private _uniformLocationsToValues: Map<WebGLUniformLocation, number|number[]> = new Map();

	/** A mapping from attribute names to locations. */
	private _attributeNamesToLocations: Map<string, number> = new Map();

	/** The Gl shader program. */
	private _program: WebGLProgram;

	/** The flag that returns true if the program is valid. */
	private _programIsValid: boolean = false;
}

export namespace Shader {
	export class Options {
		/** The vertex shader code. */
		vertex: string | string[] = '';

		/** The fragment shader code. */
		fragment: string | string[] = '';

		/** Attribute locations. */
		attributeLocations: { [key: string]: number } = {};
	}
}
