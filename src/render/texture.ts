import { Vector2 } from '../utils/vector2';
import { UniqueId } from '../utils/unique_id';

export class Texture extends UniqueId.Object {
	constructor(gl: WebGL2RenderingContext) {
		super();

		// Save the WebGL context.
		this._gl = gl;

		// Create the texture.
		const handle = this._gl.createTexture();
		if (handle === null) {
			throw new Error('Could not create texture handle.');
		}
		this._handle = handle;
	}

	/** Destructs the texture. */
	destroy(): void {
		// Delete the texture.
		this._gl.deleteTexture(this._handle);
		super.destroy();
	}

	/** Sets the source of the texture. */
	setSource(source: undefined | string | TexImageSource | Uint8Array | Uint16Array | Uint32Array, width?: number, height?: number, format?: Texture.Format): void {
		// Depending on the type of source, set the formats, size, and apply the source.
		if (typeof source === 'string') {
			// Set the texture to hot pink 1x1 RGB until the image loads.
			this._size.set(1, 1);
			this._format = Texture.Format.RGB;
			this._source = source;
			this._setGLTexture(new Uint8Array([255, 105, 180]));
			// Load the image and then set the texture.
			const image = new Image();
			this._loadedPromise = new Promise<void>((resolve, reject) => {
				image.onload = (): void => {
					const isJpeg: boolean = source.search(/\.jpe?g($|\?)/i) > 0;
					this._format = Texture.Format.RGBA;
					if (isJpeg) {
						this._format = Texture.Format.RGB;
					}
					this._size.set(image.width, image.height);
					this._setGLTexture(image);
					resolve();
				};
				image.onerror = (): void => {
					reject('The image "' + source + '" failed to load.');
				};
				image.src = source;
			});
		}
		else if (source instanceof Uint8Array) {
			if (width === undefined || height === undefined) {
				throw new Error('A width and height must be specified when creating a texture with a Uint8Array.');
			}
			this._size.set(width, height);
			if (format === Texture.Format.RGB || format === Texture.Format.RGBA) {
				this._format = format;
			}
			else if (format === undefined) {
				this._format = Texture.Format.UINT8;
			}
			else {
				throw new Error('An invalid format was specified.');
			}
			this._source = 'Uint8Array';
			this._setGLTexture(source);
		}
		else if (source instanceof Uint16Array) {
			if (width === undefined || height === undefined) {
				throw new Error('A width and height must be specified when creating a texture with a Uint16Array.');
			}
			this._size.set(width, height);
			this._format = Texture.Format.UINT16;
			this._source = 'Uint16Array';
			this._setGLTexture(source);
		}
		else if (source instanceof Uint32Array) {
			if (width === undefined || height === undefined) {
				throw new Error('A width and height must be specified when creating a texture with a Uint32Array.');
			}
			this._size.set(width, height);
			this._format = Texture.Format.UINT32;
			this._source = 'Uint32Array';
			this._setGLTexture(source);
		}
		else if (source === undefined) { // no source
			if (width === undefined || height === undefined || format === undefined) {
				throw new Error('A width, height, and format must be specified when creating a blank texture.');
			}
			this._size.set(width, height);
			this._format = format;
			this._source = '';
			this._setGLTexture(source);
		}
		else { // canvas or image or video
			this._size.set(source.width, source.height);
			this._format = Texture.Format.RGBA;
			this._source = source.toString();
			this._setGLTexture(source);
		}
	}

	/** Gets the format. */
	get format(): Texture.Format {
		return this._format;
	}

	/** Gets the size in pixels. */
	get size(): Vector2 {
		return this._size;
	}

	/** Gets the source. */
	get source(): string {
		return this._source;
	}

	/** Activates the texture at the given slot. */
	activate(slot: number): void {
		this._gl.activeTexture(this._gl.TEXTURE0 + slot);
		this._gl.bindTexture(this._gl.TEXTURE_2D, this._handle);
	}

	/** Deactivates any texture at the given slot. */
	deactivate(slot: number): void {
		this._gl.activeTexture(this._gl.TEXTURE0 + slot);
		this._gl.bindTexture(this._gl.TEXTURE_2D, null);
	}

	/** Gets the promise that resolves when the texture is loaded. */
	getLoadedPromise(): Promise<void> {
		return this._loadedPromise;
	}

	private _setGLTexture(source: TexImageSource | Uint8Array | Uint16Array | Uint32Array | undefined): void {
		const glInternalFormat = this._formatToGLInternalFormat(this._format);
		const glFormat = this._formatToGLFormat(this._format);
		const glType = this._formatToGLType(this._format);
		this._gl.bindTexture(this._gl.TEXTURE_2D, this._handle);
		if (source instanceof Uint8Array || source instanceof Uint16Array || source instanceof Uint32Array || source === undefined) {
			this._gl.texImage2D(this._gl.TEXTURE_2D, 0, glInternalFormat, this._size.x, this._size.y, 0, glFormat, glType, source !== undefined ? source : null);
		}
		else {
			this._gl.texImage2D(this._gl.TEXTURE_2D, 0, glInternalFormat, this._size.x, this._size.y, 0, glFormat, glType, source);
		}
		this._gl.generateMipmap(this._gl.TEXTURE_2D);
	}

	private _formatToGLInternalFormat(format: Texture.Format): number {
		switch(format) {
			case Texture.Format.RGB: return this._gl.RGB;
			case Texture.Format.RGBA: return this._gl.RGBA;
			case Texture.Format.UINT8: return this._gl.R8UI;
			case Texture.Format.UINT16: return this._gl.R16UI;
			case Texture.Format.UINT32: return this._gl.R32UI;
			case Texture.Format.DEPTH_STENCIL: return this._gl.DEPTH24_STENCIL8;
		}
	}

	private _formatToGLFormat(format: Texture.Format): number {
		switch(format) {
			case Texture.Format.RGB:
				return this._gl.RGB;
			case Texture.Format.RGBA:
				return this._gl.RGBA;
			case Texture.Format.UINT8:
			case Texture.Format.UINT16:
			case Texture.Format.UINT32:
				return this._gl.RED;
			case Texture.Format.DEPTH_STENCIL:
				return this._gl.DEPTH_STENCIL;
		}
	}

	private _formatToGLType(format: Texture.Format): number {
		switch(format) {
			case Texture.Format.RGB:
			case Texture.Format.RGBA:
			case Texture.Format.UINT8:
				return this._gl.UNSIGNED_BYTE;
			case Texture.Format.UINT16:
				return this._gl.UNSIGNED_SHORT;
			case Texture.Format.UINT32:
			case Texture.Format.DEPTH_STENCIL:
				return this._gl.UNSIGNED_INT;
		}
	}

	/**  The WebGL context. */
	private _gl: WebGL2RenderingContext;

	/** The WebGL handle. */
	private _handle: WebGLTexture;

	/** The format. */
	private _format: Texture.Format = Texture.Format.RGB;

	/** The size in pixels. */
	private _size: Vector2 = new Vector2();

	/** The string source if there was one. */
	private _source: string = '';

	/** The promise that resolves when the texture is loaded. */
	private _loadedPromise: Promise<void> = Promise.resolve();
}

export namespace Texture {
	export enum Format { RGB, RGBA, UINT8, UINT16, UINT32, DEPTH_STENCIL }
}
