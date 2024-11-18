// Time Loop Running For All the Tasks
// Run
let toggleIndex = 0;
let timer = 0;
let lastTime = Date.now();
let running = false;

/**
 * Test Creation
 */
let numTests = 10;
let passedTests = [];
let passedTestIndex = -1;
// Set all to false to start
for(let i = 0; i < numTests; i++){
    passedTests[i] = false;
}

// Initial Values(Will Change After Each Test)
// Only For knobs and slider
randomTestValues = {
    knobValue1: 0,
    knobValue2: 0,
    sliderValue: 0,
    // Test Index For 6 controls
    randomTestIndex: 0
}

// Randomly Shown Tests
let testPrompts = [
    `Turn Left Knob To ${randomTestValues.knobValue1}`,
    `Turn Right Knob To ${randomTestValues.knobValue2}`,
    `Slide Slider To ${randomTestValues.sliderValue}`,
    `Click Button 1`,
    `Click Button 2`,
    `Flip The Lever`
]

// Constantly Check Tests Within Tick Function - Knobs and Slider
// Also keep track of errors and time
let totalErrors = 0;

// Event Listeners For the Button Controls
let button1 = document.getElementById("firstButton");
let button2 = document.getElementById("secondButton");
let switchControl = document.querySelector('.switchButton');
let promptTaskText = document.querySelector('.testText');
let volumeValue1 = document.getElementById("volumeValue");
let volumeValue2 = document.getElementById("volumeValue");

let startButton = document.getElementById('start');
let resetButton = document.getElementById('reset');
let stopButton = document.getElementById('stop');
let timeOutput = document.getElementById('outputTime');
let horizontalSliderOutput = document.getElementById('sliderValue');
let horizontalSlider = document.querySelector('.horizontalSlider');
let downloadCSVButton = document.querySelector('.downloadCSV');
let downloadTXTButton = document.querySelector('.downloadRawData');

startButton.style.display = "block"
stopButton.style.display = "none"
resetButton.style.display = "none"
downloadCSVButton.style.display = "none"
downloadTXTButton.style.display = "none"

startButton.addEventListener('click', () => {
    toggleIndex++;
    switch(toggleIndex){
        case 0:
            startButton.style.display = "block"
            stopButton.style.display = "none"
            resetButton.style.display = "none"
            break;
        case 1:
            running = true;
            stopButton.style.display = "block"
            startButton.style.display = "none"
            resetButton.style.display = "none"
            break;
    }
});

stopButton.addEventListener('click', () => {
    running = false;
    toggleIndex++;
    if(toggleIndex == 2){
        resetButton.style.display = "block"
        startButton.style.display = "none"
        stopButton.style.display = "none"
    }
});

resetButton.addEventListener('click', () => {
    timer = 0;
    timeOutput.textContent = (timer / 1000).toFixed(1) + 's';
    toggleIndex = 0;
    startButton.style.display = "block"
    stopButton.style.display = "none"
    resetButton.style.display = "none"
});

/**
 * Rotary Knobs
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
    if(testPrompts[randomTestValues.randomTestIndex] != `Turn Left Knob To ${randomTestValues.knobValue1}`){
        totalErrors++;
        console.log(`Errors: ${totalErrors}`);
    }
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
    if(testPrompts[randomTestValues.randomTestIndex] != `Turn Right Knob To ${randomTestValues.knobValue2}`){
        totalErrors++;
        console.log(`Errors: ${totalErrors}`);
    }
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
            document.getElementById("volumeValue").innerHTML = volumeSetting; 
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
            document.getElementById("volumeValue2").innerHTML = volumeSetting; 
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
 * Actual Testing For The Button Controls and Slider
 * lever, button1, and button2, horizontal slider
 * 
 * Knob tests above in knobs section
 * 
 */
function outputTest() {
    // Generate random values (you already have this)
    randomTestValues.knobValue1 = Math.floor(Math.random() * 100);
    randomTestValues.knobValue2 = Math.floor(Math.random() * 100);
    randomTestValues.sliderValue = Math.floor(Math.random() * 100);
    randomTestValues.randomTestIndex = Math.floor(Math.random() * 6);

    testPrompts[0] = `Turn Left Knob To ${randomTestValues.knobValue1}`
    testPrompts[1] = `Turn Right Knob To ${randomTestValues.knobValue2}`
    testPrompts[2] = `Slide Slider To ${randomTestValues.sliderValue}`

    if(passedTests[passedTests.length - 1] == true){
        showDataDownload();
    }
  
    // Update the test prompt
    promptTaskText.innerHTML = testPrompts[randomTestValues.randomTestIndex];

    passedTestIndex++;
    console.log(passedTests);
};

function showDataDownload(){
    console.log("Download the CSV File By Clicking the Button");
    downloadCSVButton.style.display = "block"
    downloadTXTButton.style.display = "block"
}

// ... (rest of your code)

// Button 1 Event Listener
button1.addEventListener('click', () => {
    // Check if the clicked button matches the current test
    if (testPrompts[randomTestValues.randomTestIndex] == `Click Button 1`) {
        console.log("Passed Test Button 1");
        passedTests[passedTestIndex] = true;
        // Update the prompt only if the test is passed
        outputTest(); 
    } else {
        totalErrors++;
        console.log(`Errors: ${totalErrors}`);
    }
  });
  
  // Button 2 Event Listener
  button2.addEventListener('click', () => {
    if (testPrompts[randomTestValues.randomTestIndex] == `Click Button 2`) {
      console.log("Passed Test Button 2");
      passedTests[passedTestIndex] = true;
      outputTest(); 
    } else {
        totalErrors++;
        console.log(`Errors: ${totalErrors}`);
    }
  });
  
  // Switch Event Listener
  switchControl.addEventListener('click', () => {
    if (testPrompts[randomTestValues.randomTestIndex] == `Flip The Lever`) {
      console.log("Passed Test Switch");
      passedTests[passedTestIndex] = true;
      outputTest(); 
    } else {
        totalErrors++;
        console.log(`Errors: ${totalErrors}`);
    }
  });
  
  // Horizontal Slider Event Listener
  horizontalSlider.addEventListener('click', () => {
    if (testPrompts[randomTestValues.randomTestIndex] == `Slide Slider To ${randomTestValues.sliderValue}`) {
    } else {
        totalErrors++;
        console.log(`Errors: ${totalErrors}`);
    }
  });

outputTest();

let tick = () => {
    const now = Date.now();
    const deltaTime = now - lastTime;
    lastTime = now;

    horizontalSliderOutput.innerHTML = horizontalSlider.value;

    // Constant checks for the tests depending on the randomly chosen test
    if (testPrompts[randomTestValues.randomTestIndex] == `Turn Right Knob To ${randomTestValues.knobValue2}` && volumeSetting == randomTestValues.knobValue2) {
        console.log("Passed Test right");
        passedTests[passedTestIndex] = true;
        outputTest();
    }
    if (testPrompts[randomTestValues.randomTestIndex] == `Turn Left Knob To ${randomTestValues.knobValue1}` && volumeSetting == randomTestValues.knobValue1) {
        console.log("Passed Test left");
        passedTests[passedTestIndex] = true;
        outputTest();
    }
    if (testPrompts[randomTestValues.randomTestIndex] == `Slide Slider To ${randomTestValues.sliderValue}` && horizontalSliderOutput.innerHTML == randomTestValues.sliderValue) {
        console.log("Passed Test left");
        passedTests[passedTestIndex] = true;
        outputTest();
    }

    if(running){
        timer += deltaTime;
        timeOutput.textContent = (timer / 1000).toFixed(1) + 's';
    }

    window.requestAnimationFrame(tick);
}
tick();