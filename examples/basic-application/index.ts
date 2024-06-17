import * as pc from "playcanvas";

// We will create a simple PlayCanvas scene with a rotating box in the center of the screen

window.onload = () => {
  // ==============================CREATE APPLICATION==============================

  // create a 800x600 canvas element and add it to the DOM
  // PlayCanvas will render to this canvas
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 300;
  document.body.appendChild(canvas);
  
  // create a PlayCanvas application with the canvas
  const app = new pc.Application(canvas);

  // start the app
  app.start();

  // now we have a black canvas rendered top left of the window
  // ==============================CREATE APPLICATION==============================


  // ==================================ADD CAMERA=================================
  // create camera entity
  const cameraEntity = new pc.Entity("MainCamera");

  // add camera to the app
  app.root.addChild(cameraEntity);

  // add camera component to the camera entity
  cameraEntity.addComponent("camera", {
    clearColor: new pc.Color(66 / 255, 135 / 255, 245 / 255) // set the clear color to a light blue RGB(66, 135, 245)
  });

  // set the camera's position to make it look at (0, 0, 0)
  cameraEntity.setPosition(0, 0, 3);

  // now the canvas' color match the camera's clear color
  // ==================================ADD CAMERA=================================



  // ==================================ADD A BOX==================================
  // create a box entity
  const box = new pc.Entity();

  // add the box to the app
  app.root.addChild(box);

  // add a model component to the box
  box.addComponent("model", {
    type: "box", // set the model type to box, can try other model types: sphere, capsule, cylinder, etc
  });

  // make the box rotate
  app.on("update", (dt) => box.rotate(20 * dt, 20 * dt, 20 * dt));

  // now we have a box rotated in the center of the screen
  // but it's all black because we don't have any light in the scene
  // ==================================ADD A BOX==================================
  


  // ==================================ADD LIGHT==================================
  const light = new pc.Entity("DirectionalLight");
  app.root.addChild(light);
  light.addComponent("light", {
    type: pc.LIGHTTYPE_DIRECTIONAL, // set the light type to directional, can try other light types: point, spot
    color: new pc.Color(1, 1, 1),   // color of the light: white
    intensity: 1                    // how strong the light is
  });

  // set the light's direction
  light.setEulerAngles(45, 0, 0);

  // now the box have white color because the white light is shining on it
  // try changing the light's color to see the box's color changes
  // ==================================ADD LIGHT==================================



  // =============================FULL SCREEN CANVAS==============================
  // fill the canvas to match the size of the window
  app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);

  // the canvas is now full screen but blurry and stretched
  // because the default resolution is fixed, which make the canvas.width and canvas.height different from canvas.clientWidth and canvas.clientHeight
  // set the canvas resolution to pc.RESOLUTION_AUTO to match canvas client size
  app.setCanvasResolution(pc.RESOLUTION_AUTO);

  // resize canvas on window resize
  window.addEventListener("resize", () => app.resizeCanvas());
  
  // now our application is rendered full screen
  // try using dev tools to resize the window and see the canvas resize
  // =============================FULL SCREEN CANVAS==============================
}