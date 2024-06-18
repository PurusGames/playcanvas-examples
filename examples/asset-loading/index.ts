import * as pc from "playcanvas";

// We will load a character model and texture and make it rotate

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



  // ==============================LOAD CHARACTER==============================
  // create character entity and add to the app
  const characterEntity = new pc.Entity("Character");
  app.root.addChild(characterEntity);

  // make the character rotate
  app.on("update", (dt) => characterEntity.rotate(0, 100 * dt, 0));

  // load the character model asset
  app.assets.loadFromUrl("../../assets/models/model_purus_girl.glb", "model", (err, asset: pc.Asset | undefined) => {
    if (err) {
      console.error(err);
      return;
    }

    characterEntity.addComponent("model", {
      type: "asset",
      asset: asset
    });

    // the character is too big, scale it down
    const scale = 0.01;
    characterEntity.setLocalScale(scale, scale, scale);

    // ==============================LOAD CHARACTER TEXTURE=============================
    // load the texture
    app.assets.loadFromUrl("../../assets/textures/tex_purus_girl.jpg", "texture", (err, asset: pc.Asset | undefined) => {
      if (err) {
        console.error(err);
        return;
      }

      // to assign the texture to model character, we need a material and assign the texture as diffuse map
      // and then assign the material to the mesh instance of the model

      // create a material for the character model
      const material = new pc.StandardMaterial();

      // set the texture to the material
      material.diffuseMap = asset?.resource;

      // update the material
      material.update();

      // get the mesh instance of the character model
      const meshInstance = characterEntity.model?.meshInstances[0];

      // set the material
      meshInstance!.material = material;
    // ==============================LOAD CHARACTER TEXTURE=============================
    });
  });
  // ==============================LOAD CHARACTER==============================
}