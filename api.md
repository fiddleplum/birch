# The API

engine - the base engine
* graphics
  * viewports
  * scenes
    * entities
      * components
      * controllers
* input - mouse, keyboard, touch, controllers
* audio - music, sounds
* resources
  * textures
  * models - each has one mesh and one material
  * audio
  * shaders
  * materials - each has one shader and its own set of uniform values
  * meshes - vbo, ibo

## util classes

* mesh
* texture
* model
* material
* shader
* audio
* vector2
* vector3
* vector4
* color
* quaternion
* matrix44

# Notes

## Math Types

I have run this [test](https://jsperf.com/vector3-vs-array-vs-typedarray) on Firefox (OSX and Windows), Chrome (OSX, Windows, and Android), and Safari (OSX). It seems the Vec3Add, ArrayAdd, AddInVec3, and Vec3Array tests on average performed the best, although browsers varied widely in their performance results.

Very slow on at least one desktop browser: Type32Add, ObjAdd, Type64Add
Very slow on at least one mobile browser: Vec3Add, Type32Add, ObjAdd, AddInVec

Combining these results, the faster methods are ArrayAdd and Vec3Array.

I am going to use standard arrays for math types then.

WebGL likes a Float32Array, but it is signifcantly slower on all browsers, because JS is inherently 64-bit. The WebGL uniform functions functions can also take plain arrays, and their internal conversion to Float32Arrays may be faster inside the browser engine. In any case I will add checks to make sure WebGL uniform calls aren't done more than once.

I still need Freezable functionality, though, so I will use Vec3Array for my type. A Vector3 class with an array for its internal data. I now need to decide if I use external static functions or functions within the Vector3 class itself.

## Shaders

I am going to support all WebGL 1.0 features.

## Uniforms

I'm trying to figure out how to handle uniforms and materials. Shdaer has explicit functions to call set a value from a uniform location. I have two options:

1. Have a map within material, string -> value, and it gets applied each time. I would also have a map within the model, scene, and viewports for adding uniforms in each shader at those stages. Model-specific uniforms include the model-view matrix. Scene-specific uniforms include the ambient lighting. Viewport/camera-specific uniforms include the projection matrix.
  1. With material uniforms, they would be applied every time the material changes, regardless of whether the shader changed.
  1. With model uniforms, they would be applied before every model render.
  1. With scene uniforms, they would be applied before every scene render.
  1. With camera uniforms, they would be applied before every camera render.
  1. Every time the shader changes, all of the material, model, scene, and camera uniforms would be applied (possibly). Only material could have a location for every shader uniform, since the locations of higher level uniforms would be different per shader. This means something like scene's ambient lighting uniform would need to be applied by name and not by location. And the same goes for models, since they don't have the uniform locations stored. Since this could be expensive, there should be checks to see if it is necessary.
1. Have uniform application functions for each of the uniform application levels. For camera, scene, and model, they would still need to use the names of the uniforms, but the material (and subclasses) could use the location.

I can't apply any uniform as event-based, because even projection matrix may change within a frame for a given shader if two cameras are rendering the same scene.

I've concluded that I will use names for uniforms that don't have access to the shader uniform locations (model, scene, camera). For materials, I could subclass Material and they manually keep track of locations and set values based on location, or I could not subclass Material and have a map of uniform names to values.

For viewport, camera, and scene I will use names. For model and material I will use locations. I will not subclass, but will pass viewport and camera uniform setting functions into the scene.render which will perform the render, since it is where the models will be sorted. The scenes, models, and materials will have functions as members, which the scene will call.