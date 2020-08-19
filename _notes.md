# Issues I'm running into

## How to handle Model uniforms?

Right now I have Frame and Model components and a Model system. Whenever a Frame component changes its position or orientation, it sends an event to the Model system, which updates the uniforms on the Model component.

The trouble is, I will have any number of uniforms to set on the model component. What if I have a Team component which has a certain color uniform that it needs to set? Here's the options I see:

* The Model system would have to be updated to know about every component that would affect uniforms.
  * To do this, I would need the Model system to not check for a Frame component, but check for any component that has the "setUniforms" function. This function would directly set the uniforms on a shader.
  * The problem with the above is that a component may only need to set the uniforms on a specific model, and the event system would need to fire an event for any component that needs to update its uniforms.
  * The model will also have to have a list of all of its current uniforms.
  * Each shader has its own bound set of uniform values ([here](https://stackoverflow.com/questions/10857602/do-uniform-values-remain-in-glsl-shader-if-unbound)), so this means that the shader should keep track of what uniform values it has. Then it can apply them whenever it needs without resorting to outside functions.
  * I should figure out how to separate stage, scene, and model uniforms, if they need to be separated.
  * I need to implement uniform buffer objects before all of this, so that the architecture works with them.
* The Team component would have to know to send a Uniform event out, which would have data on which model, which uniform, and what value.

So, a given component that has state that affects uniforms. There should be a system that handles that specific scenario. 

So for instance, there should be a FrameModel system that just handles the Frame-related state and sets the appropriate uniforms.

Then there should be a Team system that handles teams and also sets each character's model to the correct color.

There is no way to make it generic enough to handle all possibilities.

# Other Notes

Use 16-bit or 32-bit indices for meshes automatically.
