import { Vector2 } from '../utils/vector2';
import { UniqueId } from '../utils/unique_id';

export class Texture extends UniqueId.Object {
	constructor(gl: WebGL2RenderingContext, source: null | string | TexImageSource | Uint8Array | Uint16Array | Uint32Array, width?: number, height?: number, format?: Texture.Format ) {
		super();

		// Save the WebGL context.
		this._gl = gl;

		// Create the texture.
		this._handle = this._gl.createTexture();

		// Depending on the type of source, set the formats, size, and apply the source.
		if (typeof source === 'string') {
			// Set the texture to hot pink until the image loads.
			this._size.set(1, 1);
			this._format = Texture.Format.RGB;
			this._setGLTexture(new Uint8Array([255, 105, 180]));
			// Load the image and then set the texture.
			const image = new Image();
			image.onload = (): void => {
				const isJpeg: boolean = source.search(/\.jpe?g($|\?)/i) > 0;
				this._format = Texture.Format.RGBA;
				if (isJpeg) {
					this._format = Texture.Format.RGB;
				}
				this._size.set(image.width, image.height);
				this._setGLTexture(image);
			};
			image.src = source;
		}
		else if (source instanceof Uint8Array) {
			if (width === undefined || height === undefined) {
				throw new Error('A width and height must be specified when creating a texture with a Uint8Array.');
			}
			this._format = Texture.Format.UINT8;
			this._size.set(width, height);
			this._setGLTexture(source);
		}
		else if (source instanceof Uint16Array) {
			if (width === undefined || height === undefined) {
				throw new Error('A width and height must be specified when creating a texture with a Uint16Array.');
			}
			this._format = Texture.Format.UINT16;
			this._size.set(width, height);
			this._setGLTexture(source);
		}
		else if (source instanceof Uint32Array) {
			if (width === undefined || height === undefined) {
				throw new Error('A width and height must be specified when creating a texture with a Uint32Array.');
			}
			this._format = Texture.Format.UINT32;
			this._size.set(width, height);
			this._setGLTexture(source);
		}
		else if (source === null) { // no source
			if (width === undefined || height === undefined || format === undefined) {
				throw new Error('A width, height, and format must be specified when creating a blank texture.');
			}
			this._format = format;
			this._size.set(width, height);
			this._setGLTexture(source);
		}
		else { // canvas or image or video
			this._format = Texture.Format.RGBA;
			this._size.set(source.width, source.height);
			this._setGLTexture(source);
		}
	}

	/** Destructs the texture. */
	destroy(): void {
		this._gl.deleteTexture(this._handle);
		super.destroy();
	}

	/** Gets the format. */
	get format(): Texture.Format {
		return this._format;
	}

	/** Gets the size in pixels. */
	get size(): Vector2 {
		return this._size;
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

	/** Attaches the texture as the destination for the frame buffer. */
	attachToFrameBuffer(attachment: number): void {
		this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, attachment, this._gl.TEXTURE_2D, this._handle, 0);
	}

	private _setGLTexture(source: TexImageSource | Uint8Array | Uint16Array | Uint32Array | null): void {
		const glInternalFormat = this._formatToGLInternalFormat(this._format);
		const glFormat = this._formatToGLFormat(this._format);
		const glType = this._formatToGLType(this._format);
		this._gl.bindTexture(this._gl.TEXTURE_2D, this._handle);
		if (source instanceof Uint8Array || source instanceof Uint16Array || source instanceof Uint32Array || source === null) {
			this._gl.texImage2D(this._gl.TEXTURE_2D, 0, glInternalFormat, this._size.x, this._size.y, 0, glFormat, glType, source);
		}
		else {
			this._gl.texImage2D(this._gl.TEXTURE_2D, 0, glInternalFormat, this._size.x, this._size.y, 0, glFormat, glType, source);
		}
	}

	private _formatToGLInternalFormat(format: Texture.Format) {
		switch(format) {
			case Texture.Format.RGB: return this._gl.RGB;
			case Texture.Format.RGBA: return this._gl.RGBA;
			case Texture.Format.UINT8: return this._gl.R8UI;
			case Texture.Format.UINT16: return this._gl.R16UI;
			case Texture.Format.UINT32: return this._gl.R32UI;
		}
	}

	private _formatToGLFormat(format: Texture.Format) {
		switch(format) {
			case Texture.Format.RGB:
				return this._gl.RGB;
			case Texture.Format.RGBA:
				return this._gl.RGBA;
			case Texture.Format.UINT8:
			case Texture.Format.UINT16:
			case Texture.Format.UINT32:
				return this._gl.RED;
		}
	}

	private _formatToGLType(format: Texture.Format) {
		switch(format) {
			case Texture.Format.RGB:
			case Texture.Format.RGBA:
			case Texture.Format.UINT8:
				return this._gl.UNSIGNED_BYTE;
			case Texture.Format.UINT16:
				return this._gl.UNSIGNED_SHORT;
			case Texture.Format.UINT32:
				return this._gl.UNSIGNED_INT;
		}
	}

	/**  The WebGL context. */
	private _gl: WebGL2RenderingContext;

	private _handle: WebGLTexture | null;

	private _format: Texture.Format = Texture.Format.RGB;

	private _size: Vector2 = new Vector2();
}

export namespace Texture {
	export enum Format { RGB, RGBA, UINT8, UINT16, UINT32 }
}
