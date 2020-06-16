import { Scene } from './scene';
import { Model } from './model';
import { Texture } from './texture';
import { Rectangle } from '../utils/rectangle';
import { Vector2 } from '../utils/vector2';
import { Vector2Readonly } from '../utils/vector2_readonly';
import { Vector3 } from '../utils/vector3';
import { Vector3Readonly } from '../utils/vector3_readonly';

/** A render stage. It either renders to the canvas or to textures. */
export class Stage {

	/** The bounds in pixel-space. It determines where in the canvas or textures the stage will be rendered. */
	bounds: Rectangle = new Rectangle(0, 0, 0, 0);

	/** The scene. */
	scene: Scene | null = null;

	/** The uniforms function. Stage-specific uniforms should be set here. */
	uniformsFunction: Model.UniformsFunction | null = null;

	/** The constructor. */
	constructor(gl: WebGL2RenderingContext) {
		// Save the WebGL context.
		this._gl = gl;
	}

	/** Destroys the stage. */
	destroy(): void {
		if (this._frameBuffer !== null) {
			this._gl.deleteFramebuffer(this._frameBuffer);
		}
	}

	/** Set whether it will render to textures or to the canvas. */
	set renderToTexture(renderToTexture: boolean) {
		// If it's changing to be render to texture.
		if (this._frameBuffer === null && renderToTexture) {
			// Create the frame buffer.
			const frameBuffer = this._gl.createFramebuffer();
			if (frameBuffer === null) {
				throw new Error('Could not create the frame buffer.');
			}
			this._frameBuffer = frameBuffer;
		}
		// If it's changing to be render to canvas.
		if (this._frameBuffer !== null && !renderToTexture) {
			// Destroy the frame buffer.
			this._gl.deleteFramebuffer(this._frameBuffer);
			this._frameBuffer = null;
		}
	}

	/** Sets the color output texture for the *index*. */
	setOutputColorTexture(index: number, texture: Texture) {
		if (this._frameBuffer === null) {
			throw new Error('You must first set the renderToTexture to true.');
		}
		if (texture !== null && texture.format !== Texture.Format.RGBA) {
			throw new Error('The texture must be in the RGBA format.');
		}
		this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._frameBuffer);
		this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, this._gl.COLOR_ATTACHMENT0 + index, this._gl.TEXTURE_2D, texture, 0);
		if (this._gl.checkFramebufferStatus(this._gl.FRAMEBUFFER) !== this._gl.FRAMEBUFFER_COMPLETE) {
			throw new Error('The color frame buffer at index ' + index + ' is not supported by your system.');
		}
	}

	/** Sets the depth & stencil texture. The depth part is 24 bits and the stencil part is 8 bits. */
	setOutputDepthStencilTexture(texture: Texture) {
		if (this._frameBuffer === null) {
			throw new Error('You must first set the renderToTexture to true.');
		}
		if (texture !== null && texture.format !== Texture.Format.DEPTH_STENCIL) {
			throw new Error('The texture must be in the DEPTH_STENCIL format.');
		}
		this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._frameBuffer);
		this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, this._gl.DEPTH_STENCIL_ATTACHMENT, this._gl.TEXTURE_2D, texture, 0);
		if (this._gl.checkFramebufferStatus(this._gl.FRAMEBUFFER) !== this._gl.FRAMEBUFFER_COMPLETE) {
			throw new Error('The depth & stencil frame buffer is not supported by your system.');
		}
	}

	/** Renders the stage. If it is the last, it renders to the screen and not to the frame buffer. */
	render(): void {
		if (this.scene === null) {
			return;
		}
		this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._frameBuffer);
		this._gl.viewport(this.bounds.min.x, this.bounds.size.y - this.bounds.min.y, this.bounds.size.x, this.bounds.size.y);
		this.scene.render(this.uniformsFunction);
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

	/** The frame buffer. */
	private _frameBuffer: WebGLFramebuffer | null = null;
}
