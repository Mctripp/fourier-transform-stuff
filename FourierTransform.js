'use strict'

// Fourier Series
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/125-fourier-series.html
// https://youtu.be/Mm2eYfj0SgA

let drawing = require('drawing')

let x = []
let y = []
let fourierX
let fourierY
let time = 0;
let path = []

let slider;

function dft(x){
  let bigX = []
  const bigN = x.length

  for(let k = 0; k < bigN; k++){
    let re = 0
    let im = 0
    for(let n = 0; n < bigN; n++){
      let phi = TWO_PI * k * n / bigN
      re += x[n] * cos(phi)
      im -= x[n] * sin(phi)
    }
    re = re / bigN
    im = im / bigN

    let freq = k
    let amp = sqrt(re * re + im * im)
    let phase = atan2(im, re)

    bigX[k] = {re, im, freq, amp, phase}
  }
  console.log(bigX)
  return bigX
}

function setup() {
  createCanvas(800, 600);
  for (let i = 0; i < drawing.length; i++){
    x.push(drawing[i].x)
    y.push(drawing[i].y)
  }
  fourierY = dft(y)
  fourierX = dft(x)
  fourierY.sort((a, b) => b.amp - a.amp)
  fourierX.sort((a, b) => b.amp - a.amp)
}

function epiCycles(x, y, rotation, fourier) {
  for (let i = 0; i < fourier.length; i++) {
    let prevx = x;
    let prevy = y;

    let freq = fourier[i].freq
    let radius = fourier[i].amp
    let phase = fourier[i].phase
    x += radius * cos(freq * time + phase + rotation);
    y += radius * sin(freq * time + phase + rotation);

    stroke(255, 100);
    noFill();
    ellipse(prevx, prevy, radius * 2);
    stroke(255);
    line(prevx, prevy, x, y);
  }
  return createVector(x, y)
}

function draw() {
  background(0);

  let vx = epiCycles(300, 100, 0, fourierX)
  let vy = epiCycles(100, 400, HALF_PI, fourierY)
  let v = createVector(vx.x, vy.y)
  path.unshift(v)

  line(vx.x, vx.y, v.x, v.y)
  line(vy.x, vy.y, v.x, v.y)
  beginShape();
  noFill();
  for (let i = 0; i < path.length; i++) {
    vertex(path[i].x, path[i].y);
  }
  endShape();

  const dt = TWO_PI / fourierY.length
  time += dt;

  if (time > TWO_PI) {
    time = 0
    path.pop();
  }
}
