/**
 * Rotary Dial 1
 */
let knob1 = document.querySelector(".slider .knob");
let circle1 = document.getElementById("circle1");
let pointer1 = document.querySelector(".slider .pointer");
let text1 = document.querySelector(".slider .text");

/**
 * Rotary Dial 2
 */
let knob2 = document.querySelector(".slider2 .knob");
let circle2 = document.getElementById("circle2");
let pointer2 = document.querySelector(".slider2 .pointer");
let text2 = document.querySelector(".slider2 .text");

/**
 * Check for Dragging Movements 
*/
let isRotating1 = false;
let isRotating2 = false;

document.addEventListener("mousedown", (e) => {
  if (e.target.closest(".slider .knob")) {
    isRotating1 = true;
  } else if (e.target.closest(".slider2 .knob")) {
    isRotating2 = true;
  }
  //Log Elapsed Time When MouseDown on the dial


});

const rotateKnob1 = (e) => {
  if (isRotating1) {
    let knobX = knob1.getBoundingClientRect().left + knob1.clientWidth / 2;
    let knobY = knob1.getBoundingClientRect().top + knob1.clientHeight / 2;

    let deltaX = e.clientX - knobX;
    let deltaY = e.clientY - knobY;

    let angleRad = Math.atan2(deltaY, deltaX);
    let angleDeg = (angleRad * 180) / Math.PI;

    let rotationAngle = (angleDeg - 135 + 360) % 360;

    //Change Color based on rotation
    if (rotationAngle <= 270) {
      pointer1.style.transform = `rotate(${rotationAngle - 45}deg)`;
      let progressPercent = rotationAngle / 270;
      circle1.style.strokeDashoffset = `${880 - 660 * progressPercent}`;
      text1.innerHTML = `${Math.round(progressPercent * 100)}`;
    }
  }
};

const rotateKnob2 = (e) => {
  if (isRotating2) {
    let knobX = knob2.getBoundingClientRect().left + knob2.clientWidth / 2;
    let knobY = knob2.getBoundingClientRect().top + knob2.clientHeight / 2;

    let deltaX = e.clientX - knobX;
    let deltaY = e.clientY - knobY;

    let angleRad = Math.atan2(deltaY, deltaX);
    let angleDeg = (angleRad * 180) / Math.PI;

    let rotationAngle = (angleDeg - 135 + 360) % 360;

    //Change Color based on rotation
    if (rotationAngle <= 270) {
      pointer2.style.transform = `rotate(${rotationAngle - 45}deg)`;
      let progressPercent = rotationAngle / 270;
      circle2.style.strokeDashoffset = `${880 - 660 * progressPercent}`;
      text2.innerHTML = `${Math.round(progressPercent * 100)}`;
    }
  }
};

// Call rotateKnob if the mouse is moved
document.addEventListener("mousemove", rotateKnob1);
document.addEventListener("mousemove", rotateKnob2);

// Stop Dragging
document.addEventListener("mouseup", () => {
  isRotating1 = false;
  isRotating2 = false;

  //Run Tests on Drag Release
  if(text1.innerHTML == '50'){
      console.log("Task Passed")
  }
});

//Test Creation
let numTests = 8;
// let tests = {
//   dialTest,
//   buttonTest1,
//   buttonTest2,
//   slider
// }
let passedTests = [];

for(let i = 0; i < numTests; i++){
  passedTests[i] = false
}

//Hardcoded Tests
/**
 * Test 1
 */

/**
 * Test 2
 */

/**
 * Test 3
 */

/**
 * Test 4
 */

/**
 * Test 5
 */

//Dynamically Coded Tests

/**
 * Buttons
 */

/**
 * Slider
 */

/**
 * Toggle Switch
 */

// Time Loop Running For All the Tasks
// Run
let timer = 0;
let lastTime = Date.now();
let running = false;

let startButton = document.getElementById('start');
let resetButton = document.getElementById('reset');
let stopButton = document.getElementById('stop');
let timeOutput = document.getElementById('outputTime');

startButton.addEventListener('click', () => {
  running = true;
  console.log("start")
})

stopButton.addEventListener('click', () => {
  running = false;
  console.log("Stop")
})

resetButton.addEventListener('click', () => {
  timer = 0;
  timeOutput.textContent = (timer / 1000).toFixed(1) + 's';
  console.log("Reset")
})

let tick = () => {
  const now = Date.now();
  const deltaTime = now - lastTime;
  lastTime = now;

  if(running){
    timer += deltaTime;
    timeOutput.textContent = (timer / 1000).toFixed(1) + 's';
  }

  window.requestAnimationFrame(tick);
}
tick();