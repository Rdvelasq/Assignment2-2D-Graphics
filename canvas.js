// Canvas element from HTML
let canvas = document.getElementById("canvas");
let btnRectangle = document.getElementById("rectangles");
let btnClear = document.getElementById("clear-canvas");
let btnDraw = document.getElementById("draw");
let runAnimation = false;
let isDrawing = false;
let animationIsRunning = false;

// Adjust Canvas Wdith and Height to fit full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Helps us draw in 2d
let context = canvas.getContext("2d");

let img = new Image();
img.src = "chalkboard.jpg";

// Rectangle Class
class Rectangle {
  constructor(xAxis, yAxis, dx, dy, width, height) {
    this.xAxis = xAxis; // x-axis position of rectangle
    this.yAxis = yAxis; // y-axis positino of rectnagle
    this.dx = dx; // velocity - speed and direction on x-axis
    this.dy = dy; // velocity - speed and directino on y-axis
    this.width = width; //width of rectangle
    this.height = height; // height of rectangle
  } // end Constructor

  // Method to draw a rectangle
  Draw() {
    context.beginPath();
    context.strokeStyle = "green";
    context.lineWidth = "6";
    context.rect(this.xAxis, this.yAxis, this.width, this.height);
    context.stroke();
  } // end Draw Method

  // Method to check collison on edges
  CheckCollision() {
    // xAxis gives the left most value of the square
    // check left boundary when x axis is less than zero
    // check right bounday - we have to add width to the x axis to get the right side
    if (this.xAxis < 0 || this.xAxis + this.width > window.innerWidth) {
      //when this reaches a boundary we want to the velocity to go the oppsite direction
      this.dx = -this.dx;
    } else if (
      this.yAxis < 0 ||
      this.yAxis + this.height > window.innerHeight
    ) {
      this.dy = -this.dy;
    }
    //cases check out then we just add the velocity to the x and y axis to make it move
    this.xAxis += this.dx;
    this.yAxis += this.dy;
    this.Draw();
  } //end CheckCollision
} // end Rectangle Class

// img.onload = () => {
//   context.drawImage(img, 0, 0);
// };

let rectangleArray = [];

// Generate Rectangles
for (let i = 0; i < 50; i++) {
  let rectangleWidth = 50;
  let rectangleHeight = 100;
  // subtract rectanglw width so it does not spawn in the it does not spwan in the boundary
  let rectangleX = Math.floor(
    Math.random() * (window.innerWidth - rectangleWidth)
  );
  let rectangleY = Math.floor(
    Math.random() * (window.innerHeight - rectangleHeight)
  );

  //Generate a random number that is either 2 or -2 to determine velocity
  let rectangleDx = (Math.random() - 0.5) * 4;
  let rectangleDy = (Math.random() - 0.5) * 4;

  let rectangle = new Rectangle(
    rectangleX,
    rectangleY,
    rectangleDx,
    rectangleDy,
    rectangleWidth,
    rectangleHeight
  );

  rectangleArray.push(rectangle);
} // end for loop

// Animation loop
function animate() {
  if (animationIsRunning) {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    // Loop through all the rectangles
    for (let rec = 0; rec < rectangleArray.length; rec++) {
      let currentRectangle = rectangleArray[rec];
      currentRectangle.CheckCollision();
    }
  }
}

// Run Drawing Animation left click to draw
function runDrawing() {
  canvas.addEventListener("mousedown", beginDrawing);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDrawing);
}

// Everytime user starts drawing start a new path so the path's do not connect
function beginDrawing() {
  //this helps us start a new path every time we start a new draw
  context.beginPath();
  isDrawing = true;
}

// Stop Drawing
function stopDrawing() {
  isDrawing = false;
}

function draw(event) {
  if (isDrawing) {
    // drawing width
    context.lineWidth = 5;
    // color to draw
    context.strokeStyle = "black";
    //client x and y get the position of the mouse in it's current positino
    context.lineTo(event.clientX, event.clientY);
    //draw's a line
    context.stroke();
  }
}

// Clears the entire canvas and removes animation
btnClear.addEventListener("click", () => {
  animationIsRunning = false;
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
});

// main application relies on user's button clicks
function run() {
  btnRectangle.addEventListener("click", () => {
    animationIsRunning = true;
    animate();
  });
  btnDraw.addEventListener("click", runDrawing);
}

run();
