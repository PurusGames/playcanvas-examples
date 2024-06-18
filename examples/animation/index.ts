import * as pc from "playcanvas";

// We will create a scene with a character that can run around using keyboard input and play animations

window.onload = () => {

  // setup application
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  
  const app = new pc.Application(canvas);
  app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
  app.setCanvasResolution(pc.RESOLUTION_AUTO);

  window.addEventListener("resize", () => app.resizeCanvas());

  app.start();


  // setup a third person camera
  const cameraEntity = new pc.Entity("MainCamera");
  app.root.addChild(cameraEntity);
  cameraEntity.addComponent("camera", {
    clearColor: new pc.Color(66 / 255, 135 / 255, 245 / 255)
  });
  const cameraOffset = new pc.Vec3(0, 1.5, -3);
  cameraEntity.setPosition(cameraOffset);
  cameraEntity.setEulerAngles(-20, 180, 0);

  // add light
  const light = new pc.Entity("DirectionalLight");
  app.root.addChild(light);
  light.addComponent("light", {
    type: pc.LIGHTTYPE_DIRECTIONAL, // set the light type to directional, can try other light types: point, spot
    color: new pc.Color(1, 1, 1),   // color of the light: white
    intensity: 1                    // how strong the light is
  });
  light.setEulerAngles(-90, 0, 0);


  // use AssetListLoader to load the character
  const assets = {
    charModelAsset: new pc.Asset("model_purus_girl", "model", { url: "../../assets/models/model_purus_girl.glb" }),
    charTextureAsset: new pc.Asset("tex_purus_girl", "texture", { url: "../../assets/textures/tex_purus_girl.jpg" }),
    charIdleAnimationAsset: new pc.Asset("anim_purus_girl_idle", "animation", { url: "../../assets/animations/anim_purus_girl_idle.glb" }),
    charRunAnimationAsset: new pc.Asset("anim_purus_girl_run", "animation", { url: "../../assets/animations/anim_purus_girl_run.glb"}),
  }
  const assetListLoader = new pc.AssetListLoader(Object.values(assets), app.assets);
  assetListLoader.load(() => {

    // create a plane
    const planeEntity = new pc.Entity("Plane");
    app.root.addChild(planeEntity);
    planeEntity.addComponent("model", { type: "plane" });
    planeEntity.setLocalScale(5, 1, 20)
    const matPlane = new pc.StandardMaterial();
    matPlane.emissive = new pc.Color(31 / 255, 43 / 255, 45 / 255);
    planeEntity.model!.meshInstances[0].material = matPlane;
    matPlane.update();

    // create character
    const characterEntity = new pc.Entity("Character");
    app.root.addChild(characterEntity);
    characterEntity.addComponent("model", {
      type: "asset",
      asset: assets.charModelAsset
    });
    const scale = 0.01;
    characterEntity.setLocalScale(scale, scale, scale);

    // add animation component
    characterEntity.addComponent("animation", {
      assets: [assets.charIdleAnimationAsset, assets.charRunAnimationAsset],
    });
    let currentAnim = assets.charIdleAnimationAsset.name;

    const material = characterEntity.model?.meshInstances[0].material as pc.StandardMaterial;
    material.diffuseMap = assets.charTextureAsset.resource;

    // setup character run by keyboard
    const charMovement = new pc.Vec3();
    const charSpeed = 3;
    const keyboard = new pc.Keyboard(document.body);
    app.on("update", (dt) => {
      if (keyboard.isPressed(pc.KEY_W)) {
        charMovement.z += charSpeed * dt;
      }
      if (keyboard.isPressed(pc.KEY_S)) {
        charMovement.z -= charSpeed * dt;
      }
      if (keyboard.isPressed(pc.KEY_A)) {
        charMovement.x += charSpeed * dt;
      }
      if (keyboard.isPressed(pc.KEY_D)) {
        charMovement.x -= charSpeed * dt;
      }
      characterEntity.translate(charMovement);
      // rotate the character to the direction of movement
      if (charMovement.length() > 0) {
        const angle = Math.atan2(charMovement.x, charMovement.z);
        characterEntity.setEulerAngles(0, angle * pc.math.RAD_TO_DEG, 0);
      }
      charMovement.set(0, 0, 0);

      // update the animation
      const moved = keyboard.isPressed(pc.KEY_W) || keyboard.isPressed(pc.KEY_S) || keyboard.isPressed(pc.KEY_A) || keyboard.isPressed(pc.KEY_D);
      if (moved && currentAnim === assets.charIdleAnimationAsset.name) {
        characterEntity.animation?.play(assets.charRunAnimationAsset.name, 0.1);
        currentAnim = assets.charRunAnimationAsset.name;
      }
      else if (!moved && currentAnim === assets.charRunAnimationAsset.name) {
        characterEntity.animation?.play(assets.charIdleAnimationAsset.name, 0.1);
        currentAnim = assets.charIdleAnimationAsset.name;
      }
    });
  });
}