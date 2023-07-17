let particles = [];
let strokeColor; 
let video;

const num = 600;
const noiseScale = 0.01;
const gridSize = 200;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noCursor();
  

   let constraints = {
    video: true,
    audio: false
  };

  video = createCapture(constraints,function(stream){console.log("got stream");});
  video.size(windowWidth, windowHeight); 
  video.hide();
 
  for(let i = 0; i < num; i++) {
    let particle = {
      position: createVector(random(0, video.width), random(0, video.height)),
      group: i < num / 2 ? 'A' : 'B' // Half particles in group A, half in group B
    };
    particles.push(particle);
  }
  

  stroke(255, 223, 0);

  
}

function draw() {
  
  colorMode(RGB);
  fill(0, 0, 0, 18);
  rect(0, 0, width, height);
  colorMode(HSL);

  video.loadPixels();

  let brightestX = 0;
  let brightestY = 0;
  let maxBrightness = 0;
  let brightnessAngle;
  
  
  
// Find brightest spot
for(let y = 0; y < video.height; y += gridSize){
  for(let x = 0; x < video.width; x += gridSize){
    let index = (y * video.width + x) * 4;
    let r = video.pixels[index];
    let brightness = r;  // Modify this if you have a different definition of brightness
    if (brightness > maxBrightness) {
      maxBrightness = brightness;
      brightestX = x;
      brightestY = y;
    }
  }
}

  for(let i = 0; i < num; i++) {
    let p = particles[i];
  
  // Calculate noise-based angle
  let n = noise(p.position.x * noiseScale, p.position.y * noiseScale);
  let noiseAngle = TAU*n/2 ;
  
 
  brightnessAngle = atan2(brightestY, brightestX);




    let mappedR = map(brightnessAngle*2, TAU,0, 1, 8); // Map the value from 0-255 to 1-8
    mod = Math.round(mappedR * 10) / 10; // Round to nearest tenth

    let angle = noiseAngle + mod;

   
    let normBrightnessAngle = brightnessAngle < 0 ? brightnessAngle + TAU : brightnessAngle;

   

    // Move the particle
    p.position.x += sin(angle);
    p.position.y += cos(angle);

    
      let hue = map(normBrightnessAngle, 0, TAU, 0, 360); // Map brightness angle to hue value

      if (p.group === "A") {
        
        stroke(hue, 100, 50);
      } else {
        
        stroke((hue + 180) % 360, 100, 50);
      }
  
    
    ellipse(p.position.x, p.position.y, 3, 3);
    
    if (!onScreen(p.position)) {
      p.position.x = random(0, video.width);
      p.position.y = random(0, video.height);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  video.size(windowWidth, windowHeight);
 
}

function onScreen(v) {
  return v.x >= 0 && v.x <= video.width-1 && v.y >= 0 && v.y <= video.height-1;
}

function mouseReleased() {
  noiseSeed(millis());
}

function getBrightness(x, y) {
  // Scale the coordinates down to the video resolution
  let videoX = Math.floor(x * (video.width / width));
  let videoY = Math.floor(y * (video.height / height));

  // Calculate the index into the pixels array
  let index = (videoY * video.width + videoX) * 4;

  // Get the red channel value
  let r = video.pixels[index];

  // Return the brightness value
  return r;
}

