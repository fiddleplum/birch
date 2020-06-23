// export * from './mesh';
// export * from './model';
// export * from './renderer';
// export * from './scene';
// export * from './shader';
// export * from './stage';
// export * from './texture';


import { Mesh as MeshI } from './mesh';
import { Model as ModelI } from './model';
import { Renderer as RendererI } from './renderer';
import { Scene as SceneI } from './scene';
import { Shader as ShaderI } from './shader';
import { Stage as StageI } from './stage';
import { Texture as TextureI } from './texture';

// import { Mesh } from './mesh';
// import { Model } from './model';
// import { Renderer } from './renderer';
// import { Scene } from './scene';
// import { Shader } from './shader';
// import { Stage } from './stage';
// import { Texture } from './texture';

// export const Render = {
// 	Mesh,
// 	Model,
// 	Renderer,
// 	Scene,
// 	Shader,
// 	Stage,
// 	Texture
// }

export namespace Render {
	export import Mesh = MeshI;
	export import Model = ModelI;
	export type Renderer = RendererI;
	export type Scene = SceneI;
	export type Shader = ShaderI;
	export type Stage = StageI;
	export import Texture = TextureI;
}
