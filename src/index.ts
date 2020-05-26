export * from './internal';

import * as Birch from './internal';

function render(renderer: Birch.Renderer, mesh: Birch.Mesh): void {
	renderer.clear(Birch.Color.Black);
	mesh.render();
	requestAnimationFrame(render.bind(undefined, renderer, mesh));
}

window.addEventListener('load', () => {
	const renderer = new Birch.Renderer(document.querySelector('canvas') as HTMLCanvasElement, true);

	const shader = new Birch.Shader(renderer.gl, vertexShader, fragmentShader);
	shader.activate();
	const mesh = new Birch.Mesh(renderer.gl);
	mesh.addVertexComponent(shader.getAttributeLocation('a_position'), 0, 2);
	mesh.vertices = [
		0, 0,
		1, 0,
		0, 0.5,
	];
	mesh.indices = [0, 1, 0, 2, 1, 2];
	mesh.numVerticesPerPrimitive = 2;

	render(renderer, mesh);
});

const vertexShader = `#version 300 es
 
// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;
 
// all shaders have a main function
void main() {
 
  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  gl_Position = a_position;
}`;

const fragmentShader = `#version 300 es

// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;
 
// we need to declare an output for the fragment shader
out vec4 outColor;
 
void main() {
  // Just set the output to a constant reddish-purple
  outColor = vec4(1, 1, 1, 1);
}`;
