const Scene = require("Scene");
const Time = require("Time");
const TouchGestures = require("TouchGestures");
const Diagnostics = require("Diagnostics");
const Animation = require("Animation");
const Reactive = require("Reactive");
const Materials = require("Materials");

let planes = [];
let currentPlaneIndex = 0;

(async function () {
  const instructions0 = await Scene.root.findFirst("instruction0");
  const instructions1 = await Scene.root.findFirst("instruction1");

  instructions0.text = "Tap to switch.";
  instructions1.text = "Hold to animate.";

  instructions0.hidden = false;
  instructions1.hidden = true;

  Time.setTimeout(() => {
    instructions0.hidden = true;
    instructions1.hidden = false;
  }, 2500);

  Time.setTimeout(() => {
    instructions1.hidden = true;
  }, 5000);

  planes = await Promise.all([
    Scene.root.findFirst("plane0"),
    Scene.root.findFirst("plane1"),
    Scene.root.findFirst("plane2"),
  ]);

  for (let i = 0; i < planes.length; i++) {
    planes[i].hidden = i !== currentPlaneIndex;
  }

  TouchGestures.onTap().subscribe(function (gesture) {
    currentPlaneIndex = (currentPlaneIndex + 1) % planes.length;

    for (let i = 0; i < planes.length; i++) {
      planes[i].hidden = true;
    }

    planes[currentPlaneIndex].hidden = false;

    Diagnostics.log("Current visible plane: " + currentPlaneIndex);
  });

  const [emitter, material] = await Promise.all([
    Scene.root.findFirst("emitter0"),
    Materials.findFirst("material4"),
  ]);

  emitter.material = material;

  emitter.lifetimeSeconds = 2;

  emitter.birthrate = 3;
  emitter.birthrateDelta = 0.5;

  emitter.scale = 0.001;
  emitter.scaleDelta = 0.5;

  const sizeSampler = Animation.samplers.linear(0.001, 0.01);
  emitter.sizeModifier = sizeSampler;

  const samplerX = Animation.samplers.polybezier({
    keyframes: [0, 0.1, 0, -0.1, 0],
    knots: [0, 1, 2, 3, 4],
  });
  const samplerY = Animation.samplers.polybezier({
    keyframes: [0.1, 0, -0.1, 0, 0.1],
    knots: [0, 1, 2, 3, 4],
  });
  const samplerZ = Animation.samplers.polybezier({
    keyframes: [-0.05, 0.05, -0.05, 0.05, -0.05],
    knots: [0, 1, 2, 3, 4],
  });

  emitter.positionModifier = [samplerX, samplerY, samplerZ];
  emitter.velocityModifier = [samplerX, samplerY, samplerZ];
})();
