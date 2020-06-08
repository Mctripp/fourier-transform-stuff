'use strict'

// Based off of:
// https://thecodingtrain.com/CodingChallenges/125-fourier-series.html
// https://youtu.be/Mm2eYfj0SgA

// Get coords from arr
function coordsToDrawing(coords, factor){
  let drawing = []
  for(let i = 0; i < coords.length; i+=2){
    const obj = {
      x: coords[i]/factor,
      y: coords[i+1]/factor
    }
    drawing.push(obj)
  }
  return drawing
}

// doggo outline
const drawing = coordsToDrawing([409,1019,443,1068,494,1060,505,1021,499,918,534,919,568,916,582,909,628,917,650,948,685,993,695,986,701,990,716,969,722,964,741,931,752,977,799,1004,818,975,791,908,761,882,838,901,845,875,880,877,897,761,939,747,931,742,946,731,940,707,939,699,922,704,906,696,904,683,899,679,914,647,916,627,916,613,801,595,795,629,789,654,781,662,735,657,733,617,729,608,735,515,758,488,763,440,763,412,761,400,762,391,776,379,785,379,799,375,799,367,826,353,861,316,839,312,815,321,789,326,764,325,744,324,721,311,694,298,667,292,642,295,615,303,594,308,579,298,567,292,555,280,544,271,529,258,511,252,507,277,520,326,532,366,528,386,522,394,508,398,487,407,451,427,428,438,428,431,315,454,320,555,303,558,306,545,203,528,178,602,103,598,87,615,51,620,52,643,11,636,0,656,0,674,13,672,2,687,1,720,16,722,0,729,1,810,10,818,80,817,167,830,206,827,176,849,149,864,131,900,192,873,220,921,236,937,258,949,396,843,430,877,411,934,385,933,386,943,378,943], 6)

// const notdrawing = [
//   //random stuff to test
//   {x: 205, y: 100},
//   {x: 185, y: 110},
//   {x: 190, y: 120},
//   {x: 160, y: 130},
//   {x: 170, y: 140},
//   {x: 155, y: 150},
//   {x: 143, y: 160},
//   {x: 170, y: 170},
//   {x: 126, y: 180},
//   {x: 150, y: 190},
//   {x: 102, y: 200},
//   {x: 97, y: 190},
//   {x: 65, y: 180},
//   {x: 73, y: 170},
//   {x: 40, y: 160},
//   {x: 56, y: 150},
//   {x: 34, y: 140},
//   {x: 21, y: 130},
//   {x: 18, y: 120},
//   {x: 9, y: 110},
//   {x: 2, y: 100},
//   {x: 11, y: 90},
//   {x: 27, y: 80},
//   {x: 39, y: 70},
//   {x: 43, y: 60},
//   {x: 56, y: 50},
//   {x: 73, y: 40},
//   {x: 79, y: 30},
//   {x: 63, y: 20},
//   {x: 99, y: 10},
//   {x: 117, y: 0},
//   {x: 104, y: 10},
//   {x: 123, y: 20},
//   {x: 136, y: 30},
//   {x: 144, y: 40},
//   {x: 163, y: 50},
//   {x: 157, y: 60},
//   {x: 173, y: 70},
//   {x: 189, y: 80},
//   {x: 192, y: 90}
// ]

let x = []
let y = []
let fourierX
let fourierY
let time = 0;
let path = []

// Discrete fourier, direct from eq
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

// Visual representation
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

// Creating drawing from epicycles
function draw() {
  if (time > TWO_PI) {
    return
  }
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
}
