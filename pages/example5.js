// Keep everything in anonymous function, called on window load.
 var colors = []; 
if(window.addEventListener) {
window.addEventListener('load', function () {
  var canvas, context, canvaso, contexto;

  // The active tool instance.
  var tool;

  function init () {
    // Find the canvas element.
    canvaso = document.getElementById('imageView');
    if (!canvaso) {
      alert('Error: I cannot find the canvas element!');
      return;
    }

    if (!canvaso.getContext) {
      alert('Error: no canvas.getContext!');
      return;
    }

    // Get the 2D canvas context.
    contexto = canvaso.getContext('2d');
    if (!contexto) {
      alert('Error: failed to getContext!');
      return;
    }

    // Add the temporary canvas.
    var container = canvaso.parentNode;
    canvas = document.createElement('canvas');
    if (!canvas) {
      alert('Error: I cannot create a new canvas element!');
      return;
    }

    canvas.id     = 'imageTemp';
    canvas.width  = canvaso.width;
    canvas.height = canvaso.height;
    container.appendChild(canvas);

    context = canvas.getContext('2d');
	
	var imageObj = new Image();
	imageObj.onload = function() {
        context.drawImage(imageObj, 69, 50);
      };
      imageObj.src = 'http://www.html5canvastutorials.com/demos/assets/darth-vader.jpg';
	// Get the color
    var color_select = document.getElementById('dcolor');
    if (!color_select) {
      alert('Error: failed to get the dcolor element!');
      return;
    }
    color_select.addEventListener('change', ev_color_change, false);

	// attach event handler to size
    var size_select = document.getElementById('size');
    if (!size_select) {
      alert('Error: failed to get the size element!');
      return;
    }
    size_select.addEventListener('change', ev_size_change, false);	
	
	// attach event handlers to eraser and brush button
	var eraser = document.getElementById('eraser');
    eraser.addEventListener('click', ev_eraser, false);
	
	var brush = document.getElementById('brush');
    brush.addEventListener('click', ev_brush, false);	

    // Activate the default tool.
    tool = new tools['pencil']();
	
    // Attach the mousedown, mousemove and mouseup event listeners.
    canvas.addEventListener('mousedown', ev_canvas, false);
    canvas.addEventListener('mousemove', ev_canvas, false);
    canvas.addEventListener('mouseup',   ev_canvas, false);
  }

  // The general-purpose event handler. This function just determines the mouse 
  // position relative to the canvas element.
  function ev_canvas (ev) {
    if (ev.layerX || ev.layerX == 0) { // Firefox
      ev._x = ev.layerX;
      ev._y = ev.layerY;
    } else if (ev.offsetX || ev.offsetX == 0) { // Opera
      ev._x = ev.offsetX;
      ev._y = ev.offsetY;
    }

    // Call the event handler of the tool.
    var func = tool[ev.type];
    if (func) {
      func(ev);
    }
	
  }

  // The event handler for the size changer
  function ev_size_change (ev) {
	context.lineWidth=this.value;
  }   
  
  // The event handler for the eraser
  function ev_eraser (ev) {
	colors.color11();
  } 

  // The event handler for the brush
  function ev_brush(ev) {
	var sel_color = document.getElementById('dcolor').value;
	console.log(sel_color);
	color = new colors[sel_color]();
  }     
  
  // The event handler for any changes made to the color palette
  function ev_color_change (ev) {
  console.log("Color changed");
    if (colors[this.value]) {
      color = new colors[this.value]();
    }
  }  

  // This function draws the #imageTemp canvas on top of #imageView, after which 
  // #imageTemp is cleared. This function is called each time when the user 
  // completes a drawing operation.
  function img_update () {
		contexto.drawImage(canvas, 0, 0);
		context.clearRect(0, 0, canvas.width, canvas.height);
  }

  colors.color1 = function () {context.strokeStyle="#000000";}
  colors.color2 = function () {context.strokeStyle="#7F7F7F";}
  colors.color3 = function () {context.strokeStyle="#880015";}
  colors.color4 = function () {context.strokeStyle="#ED1C24";}
  colors.color5 = function () {context.strokeStyle="#FF7F27";}
  colors.color6 = function () {context.strokeStyle="#FFF200";}
  colors.color7 = function () {context.strokeStyle="#22B14C";}
  colors.color8 = function () {context.strokeStyle="#00A2E8";}
  colors.color9 = function () {context.strokeStyle="#9D48CC";}
  colors.color10 = function () {context.strokeStyle="#A349A4";}
  colors.color11 = function () {context.strokeStyle="#FFFFFF";}
  colors.color12 = function () {context.strokeStyle="#C3C3C3";}
  colors.color13 = function () {context.strokeStyle="#B97A57";}
  colors.color14 = function () {context.strokeStyle="#FFAEC9";}
  colors.color15 = function () {context.strokeStyle="#FFC90E";}  
  colors.color16 = function () {context.strokeStyle="#EFE4B0";}  
  colors.color17 = function () {context.strokeStyle="#B5E61D";}  
  colors.color18 = function () {context.strokeStyle="#99D9EA";}  
  colors.color19 = function () {context.strokeStyle="#7092BE";}  
  colors.color20 = function () {context.strokeStyle="#C8BFE7";}     
  
  // This object holds the implementation of each drawing tool.
  var tools = {};
  
  // The drawing pencil.
  tools.pencil = function () {
    var tool = this;
    this.started = false;

    // This is called when you start holding down the mouse button.
    // This starts the pencil drawing.
    this.mousedown = function (ev) {
        context.beginPath();
        context.moveTo(ev._x, ev._y);
        tool.started = true;
    };

    // This function is called every time you move the mouse. Obviously, it only 
    // draws if the tool.started state is set to true (when you are holding down 
    // the mouse button).
    this.mousemove = function (ev) {
      if (tool.started) {
        context.lineTo(ev._x, ev._y);
        context.stroke();
      }
    };

    // This is called when you release the mouse button.
    this.mouseup = function (ev) {
      if (tool.started) {
        tool.mousemove(ev);
        tool.started = false;
        img_update();
      }
    };
  };

  init();

}, false); }

//var colorHex[] = new Array["#000000","#7F7F7F","#880015","#ED1C24","#FF7F27","#FFF200","#22B14C","#00A2E8","#9D48CC","#A349A4","#FFFFFF","#C3C3C3","#B97A57","#FFAEC9","#FFC90E","#EFE4B0","#B5E61D","#99D9EA","#7092BE","#C8BFE7"];  
  
function color_change(index){
	var colorEle = document.getElementById('dcolor');
	console.log(colorEle);
	colorEle.selectedIndex  = index;
	document.getElementById('brush').click();
}


