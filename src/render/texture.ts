export class Texture {
	constructor(gl: WebGL2RenderingContext, source: string | TexImageSource | Uint8Array | Uint16Array | Uint32Array, width?: number, height?: number ) {
		// Save the WebGL context.
		this._gl = gl;

		this._handle = this._gl.createTexture();

		if (typeof source === 'string') {
			const image = new Image();
			image.onload = (): void => {
				const isJpeg: boolean = source.search(/\.jpe?g($|\?)/i) > 0;

				let format = this._gl.RGBA;
				if (isJpeg) {
					format = this._gl.RGB;
				}
				this._gl.bindTexture(this._gl.TEXTURE_2D, this._handle);
				this._gl.texImage2D(this._gl.TEXTURE_2D, 0, format, format, this._gl.UNSIGNED_BYTE, image);
			};
			image.src = source;
		}
		else if (source instanceof Uint8Array) {
			if (width === undefined || height === undefined) {
				throw new Error('A width and height must be specified when creating a texture with a Uint8Array');
			}
			this._gl.bindTexture(this._gl.TEXTURE_2D, this._handle);
			this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.R8UI, width, height, 0, this._gl.RED, this._gl.UNSIGNED_BYTE, source);
		}
		else if (source instanceof Uint16Array) {
			if (width === undefined || height === undefined) {
				throw new Error('A width and height must be specified when creating a texture with a Uint16Array');
			}
			this._gl.bindTexture(this._gl.TEXTURE_2D, this._handle);
			this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.R16UI, width, height, 0, this._gl.RED, this._gl.UNSIGNED_SHORT, source);
		}
		else if (source instanceof Uint32Array) {
			if (width === undefined || height === undefined) {
				throw new Error('A width and height must be specified when creating a texture with a Uint32Array');
			}
			this._gl.bindTexture(this._gl.TEXTURE_2D, this._handle);
			this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.R32UI, width, height, 0, this._gl.RED, this._gl.UNSIGNED_INT, source);
		}
		else { // canvas or image or video
			this._gl.bindTexture(this._gl.TEXTURE_2D, this._handle);
			this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, source);
		}
	}

	/**  The WebGL context. */
	private _gl: WebGL2RenderingContext;

	private _handle: WebGLTexture | null;
}
