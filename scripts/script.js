const Scene = require("Scene");
const Time = require("Time");
const TouchGestures = require("TouchGestures");
const Diagnostics = require("Diagnostics");

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
})();
