import { Scene } from './scene';

/** A render stage. It either renders a scene or does post processing. */
export class Stage {
	render(): void {
	}

	get outputs: Texture {
	}

	
}

export class SceneStage extends Stage {
	/** Gets the scene. */
	get scene(): Scene | null {
		return this._scene;
	}

	/** Sets the scene. */
	set scene(scene: Scene | null) {
		this._scene = scene;
	}

	/** The scene. */
	private _scene: Scene | null = null;
}

