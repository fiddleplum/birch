import { OrderedMap } from '../utils/ordered_map';
import { UniqueId } from '../utils/unique_id';

export class Shader extends UniqueId.Object {
	/** The constructor. */
	constructor(gl: WebGL2RenderingContext, vertexCode: string, fragmentCode: string, attributeLocations: OrderedMap<string, number>) {
		super();

		// Save the WebGL context.
		this._gl = gl;

		try {
			// Create the shader program.
			let vertexObject = null;
			let fragmentObject = null;
			try {
				vertexObject = this._compile(vertexCode, this._gl.VERTEX_SHADER);
				fragmentObject = this._compile(fragmentCode, this._gl.FRAGMENT_SHADER);
				this._program = this._link(vertexObject, fragmentObject, attributeLocations);
			}
			finally {
				if (vertexObject !== null) {
					this._gl.deleteShader(vertexObject);
				}
				if (fragmentObject !== null) {
					this._gl.deleteShader(fragmentObject);
				}
			}
			this._initializeUniforms();
			this._initializeAttributes();
		}
		catch (e) {
			this.destroy();
			throw e;
		}

		// Add it to the set of all created shaders.
		if (Shader._all.get(gl) === undefined) {
			Shader._all.set(gl, new Set());
		}
		Shader._all.get(gl)?.add(this);
	}

	/** Destructs the shader. */
	destroy(): void {
		this._gl.deleteProgram(this._program);
		Shader._all.get(this._gl)?.delete(this);
		super.destroy();
	}

	/** Activates the shader for use in rendering. */
	activate(): void {
		this._gl.useProgram(this._program);
	}

	/** Gets the uniform location from its name. Returns undefined if the name is not found. */
	getUniformLocation(name: string): WebGLUniformLocation {
		const location = this._uniformNamesToLocations.get(name);
		if (location === undefined) {
			throw new Error('Could not get location for uniform ' + name + '.');
		}
		return location;
	}

	/** Gets the attribute location from its name. Returns undefined if the name is not found. */
	getAttributeLocation(name: string): number {
		const location = this._attributeNamesToLocations.get(name);
		if (location === undefined) {
			throw new Error('Could not get location for attribute ' + name + '.');
		}
		return location;
	}

	/** Sets the uniform location to an integer value. */
	setUniformInt(location: WebGLUniformLocation, value: number): void {
		const existingValue = this._uniformLocationsToValues.get(location);
		if (existingValue !== value) {
			this._uniformLocationsToValues.set(location, value);
			this._gl.uniform1i(location, value);
		}
	}

	/** Sets the uniform location to a Vector2 value. */
	setUniformInt2(location: WebGLUniformLocation, value: number[]): void {
		const existingValue = this._uniformLocationsToValues.get(location);
		if (existingValue instanceof Array && !Shader._arrayEquals(existingValue, value, 2)) {
			Shader._arrayCopy(existingValue, value, 2);
			this._gl.uniform2iv(location, value);
		}
	}

	/** Sets the uniform location to a Vector3 value. */
	setUniformInt3(location: WebGLUniformLocation, value: number[]): void {
		const existingValue = this._uniformLocationsToValues.get(location);
		if (existingValue instanceof Array && !Shader._arrayEquals(existingValue, value, 3)) {
			Shader._arrayCopy(existingValue, value, 3);
			this._gl.uniform3iv(location, value);
		}
	}

	/** Sets the uniform location to a Vector4 value. */
	setUniformInt4(location: WebGLUniformLocation, value: number[]): void {
		const existingValue = this._uniformLocationsToValues.get(location);
		if (existingValue instanceof Array && !Shader._arrayEquals(existingValue, value, 4)) {
			Shader._arrayCopy(existingValue, value, 4);
			this._gl.uniform4iv(location, value);
		}
	}

	/** Sets the uniform location to a floating-point value. */
	setUniformFloat(location: WebGLUniformLocation, value: number): void {
		const existingValue = this._uniformLocationsToValues.get(location);
		if (typeof existingValue === 'number' && existingValue !== value) {
			this._uniformLocationsToValues.set(location, value);
			this._gl.uniform1f(location, value);
		}
	}

	/** Sets the uniform location to a Vector2 value. */
	setUniformFloat2(location: WebGLUniformLocation, value: number[]): void {
		const existingValue = this._uniformLocationsToValues.get(location);
		if (existingValue instanceof Array && !Shader._arrayEquals(existingValue, value, 2)) {
			Shader._arrayCopy(existingValue, value, 2);
			this._gl.uniform2fv(location, value);
		}
	}

	/** Sets the uniform location to a Vector3 value. */
	setUniformFloat3(location: WebGLUniformLocation, value: number[]): void {
		const existingValue = this._uniformLocationsToValues.get(location);
		if (existingValue instanceof Array && !Shader._arrayEquals(existingValue, value, 3)) {
			Shader._arrayCopy(existingValue, value, 3);
			this._gl.uniform3fv(location, value);
		}
	}

	/** Sets the uniform location to a Vector4 value. */
	setUniformFloat4(location: WebGLUniformLocation, value: number[]): void {
		const existingValue = this._uniformLocationsToValues.get(location);
		if (existingValue instanceof Array && !Shader._arrayEquals(existingValue, value, 4)) {
			Shader._arrayCopy(existingValue, value, 4);
			this._gl.uniform4fv(location, value);
		}
	}

	/** Sets the uniform location to a Matrix44 value. */
	setUniformMatrix44(location: WebGLUniformLocation, value: number[]): void {
		const existingValue = this._uniformLocationsToValues.get(location);
		if (existingValue instanceof Array && !Shader._arrayEquals(existingValue, value, 16)) {
			Shader._arrayCopy(existingValue, value, 16);
			this._gl.uniformMatrix4fv(location, false, value);
		}
	}

	/** Sets the uniform location to the texture slot. */
	setTexture(location: WebGLUniformLocation, textureSlot: number): void {
		const existingValue = this._uniformLocationsToValues.get(location);
		if (existingValue !== textureSlot) {
			this._uniformLocationsToValues.set(location, textureSlot);
			this._gl.uniform1i(location, textureSlot);
		}
	}

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
	private _link(vertexObject: WebGLShader, fragmentObject: WebGLShader, attributeLocations: OrderedMap<string, number>): WebGLProgram {
		// Create the program.
		const program = this._gl.createProgram();
		if (program === null) {
			throw new Error('Could not create a new shader program.');
		}

		// Attach the shader objects.
		this._gl.attachShader(program, vertexObject);
		this._gl.attachShader(program, fragmentObject);

		// Bind the given attrbute locations.
		for (let i = 0; i < attributeLocations.size; i++) {
			const entry = attributeLocations.getAt(i);
			if (entry !== undefined) {
				this._gl.bindAttribLocation(program, entry.value, entry.key);
			}
		}

		// Link the shaders to the program.
		this._gl.linkProgram(program);

		// Detach the shader objects.
		this._gl.detachShader(program, vertexObject);
		this._gl.detachShader(program, fragmentObject);

		// Check for success.
		const success = this._gl.getProgramParameter(program, this._gl.LINK_STATUS) as GLboolean;
		if (!success) {
			const error = this._gl.getProgramInfoLog(program);
			this._gl.deleteProgram(program);
			throw new Error('The shader program did not link correctly: ' + error);
		}

		// Return the program.
		return program;
	}

	/** Gets the mapping from uniform names to locations. */
	private _initializeUniforms(): void {
		if (this._program === null) {
			return;
		}
		const numUniforms = this._gl.getProgramParameter(this._program, this._gl.ACTIVE_UNIFORMS);
		for (let i = 0; i < numUniforms; i++) {
			const uniformInfo = this._gl.getActiveUniform(this._program, i);
			if (uniformInfo === null) {
				throw new Error('Error getting the uniform info ' + i + ' for the shader.');
			}
			const location = this._gl.getUniformLocation(this._program, uniformInfo.name);
			if (location === null) {
				throw new Error('Error getting the location for uniform ' + uniformInfo.name + '.');
			}
			this._uniformNamesToLocations.set(uniformInfo.name, location);
			let initialValue: number | number[] = 0;
			if (![this._gl.BOOL, this._gl.INT, this._gl.FLOAT, this._gl.SAMPLER_2D, this._gl.SAMPLER_CUBE].includes(uniformInfo.type)) {
				initialValue = [];
			}
			this._uniformLocationsToValues.set(location, initialValue);
		}
	}

	/** Gets the mapping from attribute names to locations. */
	private _initializeAttributes(): void {
		if (this._program === null) {
			return;
		}
		const numAttributes = this._gl.getProgramParameter(this._program, this._gl.ACTIVE_ATTRIBUTES);
		for (let i = 0; i < numAttributes; i++) {
			const activeAttrib = this._gl.getActiveAttrib(this._program, i);
			if (activeAttrib === null) {
				throw new Error('Error getting the attribute ' + i + ' on the shader.');
			}
			this._attributeNamesToLocations.set(activeAttrib.name, this._gl.getAttribLocation(this._program, activeAttrib.name));
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

	/** A mapping from uniform names to locations. */
	private _uniformNamesToLocations: Map<string, WebGLUniformLocation> = new Map();

	/** A mapping from uniform locations to values. */
	private _uniformLocationsToValues: Map<WebGLUniformLocation, number|number[]> = new Map();

	/** A mapping from attribute names to locations. */
	private _attributeNamesToLocations: Map<string, number> = new Map();

	/** The Gl shader program. */
	private _program: WebGLProgram | null = null;

	/** A set of all created shaders, one for each WebGL context. */
	private static _all: Map<WebGL2RenderingContext, Set<Shader>> = new Map();
}
