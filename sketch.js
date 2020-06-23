var database;
var drawing = [];
var currentPath = [];
var isDrawing = false;
var clearButton;

function setup(){
  canvas = createCanvas(400,400);
  database = firebase.database();
  var ref = database.ref('drawings');
  ref.on('value', gotData, errData);
  canvas.mousePressed(startPath);
  canvas.mouseReleased(endPath);
  canvas.parent('canvascontainer');
  var saveButton = createButton('save');
  saveButton.mousePressed(saveDrawing);
  clearButton = createButton('clear');
  clearButton.mousePressed(clearDrawing);
}

function startPath(){
  isDrawing = true;
  currentPath = [];
  drawing.push(currentPath);
}

function endPath(){
  isDrawing = false;
}

function draw(){
  background(0);

  if(isDrawing){
    var point = {x:mouseX, y:mouseY}
    currentPath.push(point);
  }

  stroke(225);
  strokeWeight(4);
  noFill();
  for(var i=0; i<drawing.length; i++){
    var path = drawing[i];
    beginShape();
    for(var j=0; j<path.length; j++){
    vertex(path[j].x, path[j].y);
  }
    endShape();
}
}

function saveDrawing(){
 var ref = database.ref('drawings')
 var data = {
  drawing: drawing
 }
 var result = ref.push(data, dataSent)
 console.log(result.key);

 function dataSent(err, status){
   console.log(err, status);
 }
}

function gotData(data){
  var elts = selectAll('.listing');
  for(var l = 0; l < elts.length; l++){
    elts[l].remove();
  }
  var drawings = data.val();
  var keys = Object.keys(drawings);
  for (var k = 0; k < keys.length; k++){
    var key = keys[k];
    // console.log(key);
    var li = createElement('li', '');
    li.class('listing');
    var a = createA('#', key);
    a.mousePressed(showDrawing);
    a.parent(li);
    li.parent('drawinglist');
  }
}

function errData(err){
  console.log(err);
}

function showDrawing(){
  var key = this.html()
  var ref = database.ref('drawings/' + key);
  ref.on('value', oneDrawing, errData);
  
  function oneDrawing(data){
    var drawing1 = data.val();
    drawing = drawing1.drawing;
    //console.log(drawing); 
  }
}

function clearDrawing(){
  drawing = [];
}
