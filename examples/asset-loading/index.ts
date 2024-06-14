import * as pc from "playcanvas";

// We will create a simple PlayCanvas scene with a rotating box in the center of the screen

window.onload = () => {

  // setup application
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  
  const app = new pc.Application(canvas);
  app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
  app.setCanvasResolution(pc.RESOLUTION_AUTO);

  window.addEventListener("resize", () => app.resizeCanvas());

  app.start();

  // setup camera
  const cameraEntity = new pc.Entity("MainCamera");
  app.root.addChild(cameraEntity);
  cameraEntity.addComponent("camera", {
    clearColor: new pc.Color(66 / 255, 135 / 255, 245 / 255)
  });
  cameraEntity.setPosition(0, 0, 3);

  // add light
  const light = new pc.Entity("DirectionalLight");
  app.root.addChild(light);
  light.addComponent("light", {
    type: pc.LIGHTTYPE_DIRECTIONAL, // set the light type to directional, can try other light types: point, spot
    color: new pc.Color(1, 1, 1),   // color of the light: white
    intensity: 1                    // how strong the light is
  });
  light.setEulerAngles(45, 0, 0);
}