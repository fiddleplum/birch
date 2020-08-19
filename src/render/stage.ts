import { Scene } from './scene';
import { Texture } from './texture';
import { Rectangle } from '../utils/rectangle';
import { Vector2 } from '../utils/vector2';
import { Vector2Readonly } from '../utils/vector2_readonly';
import { Vector3 } from '../utils/vector3';
import { Vector3Readonly } from '../utils/vector3_readonly';
import { UniqueId } from '../utils/unique_id';
import { Color } from '../utils/color';
import { ColorReadonly } from '../utils/color_readonly';
import { Uniforms } from './uniforms';

/** A render stage. It either renders to the canvas or to textures. */
export class Stage extends UniqueId.Object {
	/** The bounds in pixel-space. It determines where in the canvas or textures the stage will be rendered. */
	bounds: Rectangle = new Rectangle(0, 0, 0, 0);

	/** The scene. */
	scene: Scene | undefined = undefined;

	/** The constructor. */
	constructor(gl: WebGL2RenderingContext) {
		super();

		// Save the WebGL context.
		this._gl = gl;

		// Create the uniform block.
		this._uniforms = new Uniforms(this._gl);
	}

	/** Destroys the stage. */
	destroy(): void {
		if (this._frameBuffer !== undefined) {
			this._gl.deleteFramebuffer(this._frameBuffer);
		}
		this._uniforms.destroy();
		super.destroy();
	}

	/** Gets the uniforms associated with this stage. */
	get uniforms(): Uniforms {
		return this._uniforms;
	}

	/** Set whether it will render to textures or to the canvas. Defaults to false. */
	setRenderToTexture(renderToTexture: boolean): void {
		// If it's changing to be render to texture.
		if (this._frameBuffer === undefined && renderToTexture) {
			// Create the frame buffer.
			const frameBuffer = this._gl.createFramebuffer();
			if (frameBuffer === null) {
				throw new Error('Could not create the frame buffer.');
			}
			this._frameBuffer = frameBuffer;
		}
		// If it's changing to be render to canvas.
		if (this._frameBuffer !== undefined && !renderToTexture) {
			// Destroy the frame buffer.
			this._gl.deleteFramebuffer(this._frameBuffer);
			this._frameBuffer = undefined;
		}
	}

	/** Sets the color output texture for the *index*. */
	setOutputColorTexture(index: number, texture: Texture): void {
		if (this._frameBuffer === undefined) {
			throw new Error('You must first set the renderToTexture to true.');
		}
		if (texture !== undefined && texture.format !== Texture.Format.RGBA) {
			throw new Error('The texture must be in the RGBA format.');
		}
		this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._frameBuffer);
		this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, this._gl.COLOR_ATTACHMENT0 + index, this._gl.TEXTURE_2D, texture, 0);
		if (this._gl.checkFramebufferStatus(this._gl.FRAMEBUFFER) !== this._gl.FRAMEBUFFER_COMPLETE) {
			throw new Error('The color frame buffer at index ' + index + ' is not supported by your system.');
		}
	}

	/** Sets the depth & stencil texture. The depth part is 24 bits and the stencil part is 8 bits. */
	setOutputDepthStencilTexture(texture: Texture): void {
		if (this._frameBuffer === undefined) {
			throw new Error('You must first set the renderToTexture to true.');
		}
		if (texture !== undefined && texture.format !== Texture.Format.DEPTH_STENCIL) {
			throw new Error('The texture must be in the DEPTH_STENCIL format.');
		}
		this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._frameBuffer);
		this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, this._gl.DEPTH_STENCIL_ATTACHMENT, this._gl.TEXTURE_2D, texture, 0);
		if (this._gl.checkFramebufferStatus(this._gl.FRAMEBUFFER) !== this._gl.FRAMEBUFFER_COMPLETE) {
			throw new Error('The depth & stencil frame buffer is not supported by your system.');
		}
	}

	/** Sets the clear color. It does not clear if it is undefined. */
	setClearColor(color: ColorReadonly | undefined): void {
		if (color !== undefined) {
			if (this._clearColor === undefined) {
				this._clearColor = new Color();
			}
			this._clearColor.copy(color);
		}
		else {
			this._clearColor = undefined;
		}
	}

	/** Sets the clear depth. It does not clear if it is undefined. */
	setClearDepth(depth: number | undefined): void {
		this._clearDepth = depth;
	}

	/** Sets the clear stencil. It does not clear if it is undefined. */
	setClearStencil(stencil: number | undefined): void {
		this._clearStencil = stencil;
	}

	/** Renders the stage. */
	render(renderHeight: number): void {
		// Setup the frame buffer if necessary.
		if (this._frameBuffer !== undefined) {
			this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._frameBuffer);
		}

		// Setup the viewport.
		this._gl.viewport(this.bounds.min.x, renderHeight - (this.bounds.min.y + this.bounds.size.y), this.bounds.size.x, this.bounds.size.y);

		// Clear the buffer, if needed.
		let clearBitMask = 0;
		if (this._clearColor !== undefined) {
			this._gl.clearColor(this._clearColor.r, this._clearColor.g, this._clearColor.b, this._clearColor.a);
			clearBitMask |= this._gl.COLOR_BUFFER_BIT;
		}
		if (this._clearDepth !== undefined) {
			this._gl.clearDepth(this._clearDepth);
			clearBitMask |= this._gl.DEPTH_BUFFER_BIT;
		}
		if (this._clearStencil !== undefined) {
			this._gl.clearStencil(this._clearStencil);
			clearBitMask |= this._gl.STENCIL_BUFFER_BIT;
		}
		if (clearBitMask !== 0) {
			this._gl.clear(clearBitMask);
		}

		// Render the scene.
		if (this.scene !== undefined) {
			this.scene.render(this._uniforms);
		}
	}

	/** Converts a normal-space position to a pixel-space position. It ignores the z component. */
	convertNormalSpaceToPixelSpacePosition(pixelPosition: Vector2, normalPosition: Vector3Readonly): void {
		pixelPosition.x = this.bounds.min.x + this.bounds.size.x * (normalPosition.x + 1) / 2;
		pixelPosition.y = this.bounds.min.y + this.bounds.size.y * (1 - normalPosition.y) / 2;
	}

	/** Converts a pixel-space position to a normal-space position. The z component is set to -1. */
	convertPixelSpaceToNormalSpacePosition(normalPosition: Vector3, pixelPosition: Vector2Readonly): void {
		normalPosition.x = 2 * (pixelPosition.x - this.bounds.min.x) / this.bounds.size.x - 1;
		normalPosition.y = 1 - 2 * (pixelPosition.y - this.bounds.min.y) / this.bounds.size.y;
		normalPosition.z = -1;
	}

	/**  The WebGL context. */
	private _gl: WebGL2RenderingContext;

	/** The stage-specific uniform block. */
	private _uniforms: Uniforms;

	/** The frame buffer. */
	private _frameBuffer: WebGLFramebuffer | undefined = undefined;

	/** The clear color. */
	private _clearColor: Color | undefined = undefined;

	/** The clear depth. */
	private _clearDepth: number | undefined = undefined;

	/** The clear stencil. */
	private _clearStencil: number | undefined = undefined;
}
