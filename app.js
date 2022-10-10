//ctx.fillRect(50, 50, 100, 200);

/*
ctx.rect(50, 50, 100, 100);
ctx.rect(150, 150, 100, 100);
ctx.fill();

ctx.beginPath();
ctx.rect(250, 250, 100, 100);
ctx.fillStyle = "red";
setTimeout(() => {ctx.fill();}, 5000);
*/

/*
ctx.moveTo(50, 50);
ctx.lineTo(150, 50);
ctx.lineTo(150,150);
ctx.lineTo(50,150);
ctx.lineTo(50,50);
ctx.stroke();
*/

/*
ctx.fillRect(200, 200, 50, 200);
ctx.fillRect(400, 200, 50, 200);
ctx.lineWidth = 2;
ctx.fillRect(300, 300, 50, 100);
ctx.fillRect(200, 200, 200, 20);
ctx.moveTo(200, 200);
ctx.lineTo(325, 100);
ctx.lineTo(450, 200);
ctx.fill();
*/

/*
ctx.fillRect(210 - 40, 200 - 20, 15, 100);
ctx.fillRect(350 - 40, 200 - 20, 15, 100);
ctx.fillRect(260 - 40, 200 - 20, 60, 200);

ctx.arc(250, 100, 50, 0, 2 * Math.PI);
ctx.fill();

ctx.beginPath();
ctx.fillStyle = "white";
ctx.arc(260 + 10, 80, 8, Math.PI, 2 * Math.PI);
ctx.arc(220 + 10, 80, 8, Math.PI, 2 * Math.PI);
ctx.fill();
*/

/*
ctx.lineWidth = 2;

const colors = [
  "#ff3838",
  "#ffb8b8",
  "#c56cf0",
  "#ff9f1a",
  "#fff200",
  "#32ff7e",
  "#7efff5",
  "#18dcff",
  "#7d5fff",
];

function onClick(event) {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  const color = colors[Math.floor(Math.random() * colors.length)];
  ctx.strokeStyle = color;
  ctx.lineTo(event.offsetX, event.offsetY);
  ctx.stroke();
}

canvas.addEventListener("mousemove", onClick);
*/

const modeBtn = document.getElementById("mode-btn");
const destroyBtn = document.getElementById("destroy-btn");
const eraseBtn = document.getElementById("erase-btn");

const fileInput = document.getElementById("file");
const saveBtn = document.getElementById("save");
const textInput = document.getElementById("text");

const colorOptions = Array.from(
  document.getElementsByClassName("color-option")
);
const color = document.getElementById("color");
const lineWidth = document.getElementById("line-width");
const fontSize = document.getElementById("font-size");

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
ctx.lineWidth = lineWidth.value;
ctx.font = `${fontSize.value}px san-serif`;
ctx.lineCap = "round";

let isPainting = false;
let isFilling = false;

function onMove(event) {
  if (isPainting) {
    //startPainting 다음으로 실행(마우스 누를 때(mouseDown) isPainting = true)
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    return;
  }
  ctx.moveTo(event.offsetX, event.offsetY);
}

function startPainting() {
  isPainting = true;
}
function cancelPainting() {
  isPainting = false;
  //ctx.fill();
  ctx.beginPath();
}

function onLineWidthChange(event) {
  ctx.lineWidth = event.target.value;
}

function onFontSizeChange(event) {
  fontSize.value = event.target.value;
  ctx.font = `${fontSize.value}px san-serif`;
}

function onColorChange(event) {
  ctx.strokeStyle = event.target.value;
  ctx.fillStyle = event.target.value;
}

function onColorClick(event) {
  const colorValue = event.target.dataset.color;
  ctx.strokeStyle = colorValue;
  ctx.fillStyle = colorValue;
  color.value = colorValue;
}

function onModeClick() {
  if (isFilling) {
    isFilling = false;
    modeBtn.innerText = "Fill";
  } else {
    isFilling = true;
    modeBtn.innerText = "Draw";
  }
}

function onCanvasClick() {
  if (isFilling) {
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}

function onDestroyClick() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function onEraserClick() {
  ctx.strokeStyle = "white";
  isFilling = false;
  modeBtn.innerText = "Fill";
}

function onFileChange(event) {
  const file = event.target.files[0]; //첫 번째 파일
  const url = URL.createObjectURL(file); //브라우저가 파일을 가리키는 URL
  const image = new Image();
  image.src = url; //<img src="">
  image.onload = function () {
    ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    fileInput.value = null;
  };
}

function onDoubleClick(event) {
  const text = textInput.value;
  if (text !== "") {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.font = "68px san-serif";
    ctx.fillText(text, event.offsetX, event.offsetY);
    ctx.restore();
  }
}

function onSaveClick() {
  const url = canvas.toDataURL();
  const a = document.createElement("a");
  a.href = url;
  a.download = "myDrawing.png";
  a.click();
}

canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);

canvas.addEventListener("click", onCanvasClick); //click = mousedown + mouseup
canvas.addEventListener("dblclick", onDoubleClick);

lineWidth.addEventListener("change", onLineWidthChange);
fontSize.addEventListener("change", onFontSizeChange);
color.addEventListener("change", onColorChange);

colorOptions.forEach((color) => color.addEventListener("click", onColorClick));

modeBtn.addEventListener("click", onModeClick);
destroyBtn.addEventListener("click", onDestroyClick);
eraseBtn.addEventListener("click", onEraserClick);

fileInput.addEventListener("change", onFileChange);
saveBtn.addEventListener("click", onSaveClick);
