import * as pc from "playcanvas";

// We will create a character and rotate it using arrow keys and use the mouse to look around

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
  cameraEntity.setPosition(0, 0.2, 3);

  // add light
  const light = new pc.Entity("DirectionalLight");
  app.root.addChild(light);
  light.addComponent("light", {
    type: pc.LIGHTTYPE_DIRECTIONAL, // set the light type to directional, can try other light types: point, spot
    color: new pc.Color(1, 1, 1),   // color of the light: white
    intensity: 1                    // how strong the light is
  });
  light.setEulerAngles(90, 0, 0);


  // use AssetListLoader to load the character
  const assets = {
    characterModelAsset: new pc.Asset("model_purus_girl", "model", { url: "../../assets/models/model_purus_girl.glb" }),
    characterTextureAsset: new pc.Asset("tex_purus_girl", "texture", { url: "../../assets/textures/tex_purus_girl.jpg" })
  }
  const assetListLoader = new pc.AssetListLoader(Object.values(assets), app.assets);
  assetListLoader.load(() => {

    // create character
    const characterEntity = new pc.Entity("Character");
    app.root.addChild(characterEntity);
    characterEntity.addComponent("model", {
      type: "asset",
      asset: assets.characterModelAsset
    });
    const scale = 0.01;
    characterEntity.setLocalScale(scale, scale, scale);

    const material = characterEntity.model?.meshInstances[0].material as pc.StandardMaterial;
    material.diffuseMap = assets.characterTextureAsset.resource;

    // setup first person camera
    let x = 0;
    let y = 0;
    const rotationMultiplier = -0.1;
    const mouse = new pc.Mouse(document.body);
    mouse.on(pc.EVENT_MOUSEMOVE, (event) => {
      if (event.buttons[pc.MOUSEBUTTON_LEFT]) {
        x += event.dx;
        y += event.dy;
        cameraEntity.setEulerAngles(rotationMultiplier * y, rotationMultiplier * x, 0);
      }
    });

    // setup character rotation by keyboard
    const rotateSpeed = 100; // degrees per second
    const keyboard = new pc.Keyboard(document.body);
    app.on("update", (dt) => {
      if (keyboard.isPressed(pc.KEY_LEFT)) {
        characterEntity.rotate(0, -rotateSpeed * dt, 0);
      }
      if (keyboard.isPressed(pc.KEY_RIGHT)) {
        characterEntity.rotate(0, rotateSpeed * dt, 0);
      }
    });
  });
}