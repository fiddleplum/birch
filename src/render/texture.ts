import { Vector2 } from '../utils/vector2';

export class Texture {
	constructor(gl: WebGL2RenderingContext, source: string | TexImageSource | Uint8Array | Uint16Array | Uint32Array, width?: number, height?: number ) {
		// Save the WebGL context.
		this._gl = gl;

		this._handle = this._gl.createTexture();

		if (typeof source === 'string') {
			const image = new Image();
			image.onload = (): void => {
				const isJpeg: boolean = source.search(/\.jpe?g($|\?)/i) > 0;

				this._format = Texture.Format.RGBA;
				let format = this._gl.RGBA;
				if (isJpeg) {
					this._format = Texture.Format.RGB;
					format = this._gl.RGB;
				}
				this._size.set(image.width, image.height);
				this._gl.bindTexture(this._gl.TEXTURE_2D, this._handle);
				this._gl.texImage2D(this._gl.TEXTURE_2D, 0, format, format, this._gl.UNSIGNED_BYTE, image);
			};
			image.src = source;
		}
		else if (source instanceof Uint8Array) {
			if (width === undefined || height === undefined) {
				throw new Error('A width and height must be specified when creating a texture with a Uint8Array');
			}
			this._format = Texture.Format.UINT8;
			this._size.set(width, height);
			this._gl.bindTexture(this._gl.TEXTURE_2D, this._handle);
			this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.R8UI, width, height, 0, this._gl.RED, this._gl.UNSIGNED_BYTE, source);
		}
		else if (source instanceof Uint16Array) {
			if (width === undefined || height === undefined) {
				throw new Error('A width and height must be specified when creating a texture with a Uint16Array');
			}
			this._format = Texture.Format.UINT16;
			this._size.set(width, height);
			this._gl.bindTexture(this._gl.TEXTURE_2D, this._handle);
			this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.R16UI, width, height, 0, this._gl.RED, this._gl.UNSIGNED_SHORT, source);
		}
		else if (source instanceof Uint32Array) {
			if (width === undefined || height === undefined) {
				throw new Error('A width and height must be specified when creating a texture with a Uint32Array');
			}
			this._format = Texture.Format.UINT32;
			this._size.set(width, height);
			this._gl.bindTexture(this._gl.TEXTURE_2D, this._handle);
			this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.R32UI, width, height, 0, this._gl.RED, this._gl.UNSIGNED_INT, source);
		}
		else { // canvas or image or video
			this._format = Texture.Format.RGBA;
			this._size.set(source.width, source.height);
			this._gl.bindTexture(this._gl.TEXTURE_2D, this._handle);
			this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, source);
		}
	}

	/** Destructs the texture. */
	destroy(): void {
		this._gl.deleteTexture(this._handle);
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

	/**  The WebGL context. */
	private _gl: WebGL2RenderingContext;

	private _handle: WebGLTexture | null;

	private _format: Texture.Format = Texture.Format.RGB;

	private _size: Vector2 = new Vector2();
}

export namespace Texture {
	export enum Format { RGB, RGBA, UINT8, UINT16, UINT32 }
}
