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

/**
 * Rotary Dials
 */

let knobPositionX;
let knobPositionY;
let mouseX;
let mouseY;
let knobCenterX;
let knobCenterY;
let adjacentSide;
let oppositeSide;
let currentRadiansAngle;
let getRadiansInDegrees;
let finalAngleInDegrees;
let volumeSetting;
let tickHighlightPosition;
let audio1 = new Audio("https://www.cineblueone.com/maskWall/audio/skylar.mp3"); 
let audio2 = new Audio("https://www.cineblueone.com/maskWall/audio/skylar.mp3"); 
let startingTickAngle = -135;
let tickContainer1 = document.getElementById("tickContainer");
let tickContainer2 = document.getElementById("tickContainer2");
let volumeKnob1 = document.getElementById("knob");
let volumeKnob2 = document.getElementById("knob2");
let boundingRectangle1 = volumeKnob1.getBoundingClientRect(); 
let boundingRectangle2 = volumeKnob2.getBoundingClientRect(); 

function main(){
    audio1.volume = 0; 
    audio2.volume = 0; 
    volumeKnob1.addEventListener(getMouseDown(), onMouseDown1); 
    volumeKnob2.addEventListener(getMouseDown(), onMouseDown2); 
    document.addEventListener(getMouseUp(), onMouseUp); 
    createTicks(27, 0, 1);
    createTicks(27, 0, 2);
}

//on mouse button down
function onMouseDown1(){
    //start audio if not already playing
    if(audio1.paused == true){
        //mobile users must tap anywhere to start audio
        //https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
        let promise = audio1.play();

        if(promise !== undefined) {
            promise.then(function(){
              audio1.play();
            }).catch(function(error){
            });
        }
    }
    document.addEventListener(getMouseMove(), onMouseMove1); 
}

function onMouseDown2(){
    //start audio if not already playing
    if(audio2.paused == true){
        //mobile users must tap anywhere to start audio
        //https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
        let promise = audio2.play();

        if(promise !== undefined) {
            promise.then(function(){
              audio2.play();
            }).catch(function(error){
            });
        }
    }
    document.addEventListener(getMouseMove(), onMouseMove2); 
}

//on mouse button release
function onMouseUp(){
    document.removeEventListener(getMouseMove(), onMouseMove1); 
    document.removeEventListener(getMouseMove(), onMouseMove2); 
}

//compute mouse angle relative to center of volume knob
//For clarification, see my basic trig explanation at:
//https://www.quora.com/What-is-the-significance-of-the-number-pi-to-the-universe/answer/Kevin-Lam-15
//compute mouse angle relative to center of volume knob
//For clarification, see my basic trig explanation at:
//https://www.quora.com/What-is-the-significance-of-the-number-pi-to-the-universe/answer/Kevin-Lam-15
function onMouseMove1(event){
    knobPositionX = boundingRectangle1.left; 
    knobPositionY = boundingRectangle1.top; 

    if(detectMobile() == "desktop"){
        mouseX = event.pageX; 
        mouseY = event.pageY; 
    } else {
        mouseX = event.touches[0].pageX; 
        mouseY = event.touches[0].pageY; 
    }

    knobCenterX = boundingRectangle1.width / 2 + knobPositionX; 
    knobCenterY = boundingRectangle1.height / 2 + knobPositionY; 

    // Check if mouse is within knob bounds
    if (mouseX >= knobPositionX && mouseX <= knobPositionX + boundingRectangle1.width &&
        mouseY >= knobPositionY && mouseY <= knobPositionY + boundingRectangle1.height) {

        adjacentSide = knobCenterX - mouseX; 
        oppositeSide = knobCenterY - mouseY; 

        //arc-tangent function returns circular angle in radians
        //use atan2() instead of atan() because atan() returns only 180 degree max (PI radians) but atan2() returns four quadrant's 360 degree max (2PI radians)
        currentRadiansAngle = Math.atan2(adjacentSide, oppositeSide);
        getRadiansInDegrees = currentRadiansAngle * 180 / Math.PI; //convert radians into degrees
        finalAngleInDegrees = -(getRadiansInDegrees - 135); 

        //only allow rotate if greater than zero degrees or lesser than 270 degrees
        if(finalAngleInDegrees >= 0 && finalAngleInDegrees <= 270){
            volumeKnob1.style.transform = "rotate(" + finalAngleInDegrees + "deg)"; 
            volumeSetting = Math.floor(finalAngleInDegrees / (270 / 100));
            tickHighlightPosition = Math.round((volumeSetting * 2.7) / 10);
            createTicks(27, tickHighlightPosition, 1); 
            //audio1.volume = volumeSetting / 100; 
            document.getElementById("volumeValue").innerHTML = volumeSetting + "%"; 
        }
    }
}

function onMouseMove2(event){
    knobPositionX = boundingRectangle2.left; 
    knobPositionY = boundingRectangle2.top; 

    if(detectMobile() == "desktop"){
        mouseX = event.pageX; 
        mouseY = event.pageY; 
    } else {
        mouseX = event.touches[0].pageX; 
        mouseY = event.touches[0].pageY; 
    }

    knobCenterX = boundingRectangle2.width / 2 + knobPositionX; 
    knobCenterY = boundingRectangle2.height / 2 + knobPositionY; 

    // Check if mouse is within knob bounds
    if (mouseX >= knobPositionX && mouseX <= knobPositionX + boundingRectangle2.width &&
        mouseY >= knobPositionY && mouseY <= knobPositionY + boundingRectangle2.height) {

        adjacentSide = knobCenterX - mouseX; 
        oppositeSide = knobCenterY - mouseY; 

        //arc-tangent function returns circular angle in radians
        //use atan2() instead of atan() because atan() returns only 180 degree max (PI radians) but atan2() returns four quadrant's 360 degree max (2PI radians)
        currentRadiansAngle = Math.atan2(adjacentSide, oppositeSide);
        getRadiansInDegrees = currentRadiansAngle * 180 / Math.PI; //convert radians into degrees
        finalAngleInDegrees = -(getRadiansInDegrees - 135); 

        if(finalAngleInDegrees >= 0 && finalAngleInDegrees <= 270){
            volumeKnob2.style.transform = "rotate(" + finalAngleInDegrees + "deg)"; 
            volumeSetting = Math.floor(finalAngleInDegrees / (270 / 100));
            tickHighlightPosition = Math.round((volumeSetting * 2.7) / 10); 
            createTicks(27, tickHighlightPosition, 2); 
            //audio2.volume = volumeSetting / 100; 
            document.getElementById("volumeValue2").innerHTML = volumeSetting + "%"; 
        }
    }
}

//dynamically create volume knob "ticks"
function createTicks(numTicks, highlightNumTicks, knobNumber){
    if(knobNumber == 1){
        while(tickContainer1.firstChild){
            tickContainer1.removeChild(tickContainer1.firstChild);
        }
    } else {
        while(tickContainer2.firstChild){
            tickContainer2.removeChild(tickContainer2.firstChild);
        }
    }

    //create ticks
    for(let i=0;i<numTicks;i++){
        let tick = document.createElement("div");

        if(i < highlightNumTicks){
            tick.className = "tick activetick";
        } else {
            tick.className = "tick";
        }

        if(knobNumber == 1){
            tickContainer1.appendChild(tick);
            tick.style.transform = "rotate(" + startingTickAngle + "deg)";
            startingTickAngle += 10;
        } else {
            tickContainer2.appendChild(tick);
            tick.style.transform = "rotate(" + startingTickAngle + "deg)";
            startingTickAngle += 10;
        }
    }
    startingTickAngle = -135; //reset
}

//detect for mobile devices from https://www.sitepoint.com/navigator-useragent-mobiles-including-ipad/
function detectMobile(){
    let result = (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)|(android)|(blackberry)|(windows phone)|(symbian)/i));

    if(result !== null){
        return "mobile";
    } else {
        return "desktop";
    }
}

function getMouseDown(){
    if(detectMobile() == "desktop"){
        return "mousedown";
    } else {
        return "touchstart";
    }
}

function getMouseUp(){
    if(detectMobile() == "desktop"){
        return "mouseup";
    } else {
        return "touchend";
    }
}

function getMouseMove(){
    if(detectMobile() == "desktop"){
        return "mousemove";
    } else {
        return "touchmove";
    }
}

main();

/**
 * Test Creation
 */
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