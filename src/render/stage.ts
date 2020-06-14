import { Scene } from './scene';
import { Model } from './model';

/** A render stage. It either renders a scene or does post processing. */
export class Stage {
	render(): void {
	}

	setColorTexture(index: number, texture: Texture) {
	}

	setDepthTexture(texture: Texture) {
	}

	setStencilTexture(texture: Texture) {
	}
}

export class SceneStage extends Stage {
	/** The scene. */
	scene: Scene | null = null;

	/** The uniforms function for this stage. */
	uniformsFunction: Model.UniformsFunction | null = null;

	/** Render the scene stage. */
	render(): void {
		if (this.scene === null) {
			return;
		}
		this.scene.render(this.uniformsFunction);
	}
}

