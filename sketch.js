function setup() {
    createCanvas(800, 800);
    background(56,56,56)
    // noStroke()
  }
  
  function draw() {
    text(frameRate(),10, 10)
    if (mouseIsPressed) {
      fill(0);
    } else {
      console.log(windowWidth,windowHeight)
      let r = map(mouseX, 0,width,0,255)
      let g = map(mouseY, 0,height,0,255)
      fill(r,g,255);
    }
    ellipse(mouseX, mouseY, 40, 40);
  }