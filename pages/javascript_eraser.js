var colors = []; 
var pages = new Array("./pages/coverpage.png", "./pages/page1.png", "./pages/page2.png", "./pages/page3.png", "./pages/page4.png", "./pages/page5.png", "./pages/page6.png");
var page_index = 0;
var currentpage = pages[page_index]; 

paintbrushes = new Array("./images/paintbrush_000000.png", "./images/paintbrush_7F7F7F.png", "./images/paintbrush_880015.png", "./images/paintbrush_DF013A.png", "./images/paintbrush_FF4000.png", "./images/paintbrush_FFFF00.png", "./images/paintbrush_04B431.png", "./images/paintbrush_0000FF.png", "./images/paintbrush_5F04B4.png", "./images/paintbrush_8904B1.png", "./images/paintbrush_FFFFFF.png", "./images/paintbrush_C3C3C3.png", "./images/paintbrush_B45F04.png", "./images/paintbrush_F781BE.png", "./images/paintbrush_FF8000.png", "./images/paintbrush_BFFF00.png", "./images/paintbrush_04B486.png", "./images/paintbrush_2ECCFA.png", "./images/paintbrush_DF01D7.png", "./images/paintbrush_FF00BF.png");  
function color_change(index){
	var colorEle = document.getElementById('dcolor');
	console.log(colorEle);
	colorEle.selectedIndex  = index;
	// update the way the icons look
	var color_brush = document.getElementById('colorbrush');
	color_brush.src = paintbrushes[index];
	var eraser = document.getElementById('eraser_img');
	eraser.src = "./images/eraser.png";		
	document.getElementById('brush').click();
	
		if (colors[this.value]) {
		  color = new colors[this.value]();
		}	
}

(function() {
	
	var canvas = document.querySelector('#paint');
	var ctx = canvas.getContext('2d');
	
	var imageObj = new Image();
	imageObj.onload = function() {
    ctx.drawImage(imageObj, 0, 0);
      };
    imageObj.src = currentpage;
	
	var sketch = document.querySelector('#sketch');
	var sketch_style = getComputedStyle(sketch);
	canvas.width = parseInt(sketch_style.getPropertyValue('width'));
	canvas.height = parseInt(sketch_style.getPropertyValue('height'));
	
	
	// draw image
	var img = new Image();
	img.src = './pages/coverpage.png';
	ctx.drawImage(imageObj, 0, 0);

	
	// Determine Tool
	var tool = 'pencil';
	document.querySelector('#brush').onclick = function() {
		tool = 'pencil';
		
		// Show Tmp Canvas
		tmp_canvas.style.display = 'block';
	};
	document.querySelector('#eraser').onclick = function() {
		tool = 'eraser';
		
		// Hide Tmp Canvas
		tmp_canvas.style.display = 'none';
	};
	
	
	// Creating a tmp canvas
	var tmp_canvas = document.createElement('canvas');
	var tmp_ctx = tmp_canvas.getContext('2d');
	tmp_canvas.id = 'tmp_canvas';
	tmp_canvas.width = canvas.width;
	tmp_canvas.height = canvas.height;
	
	sketch.appendChild(tmp_canvas);

	var mouse = {x: 0, y: 0};
	var last_mouse = {x: 0, y: 0};
	
	// Pencil Points
	var ppts = [];
	
	// attach event handlers to the prev and next buttons
	var prev_button = document.getElementById('prevbutton');
	var next_button = document.getElementById('nextbutton');
	prev_button.addEventListener('click', ev_prevpage, false); 
	next_button.addEventListener('click', ev_nextpage, false);	
	  
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
	//default size to 8
	tmp_ctx.lineWidth= 8;
	
	var reset = document.getElementById('reset');
    reset.addEventListener('click', ev_reset, false);	
	
	/* Mouse Capturing Work */
	tmp_canvas.addEventListener('mousemove', function(e) {
		mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
		mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
	}, false);
	
	canvas.addEventListener('mousemove', function(e) {
		mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
		mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
	}, false);
	
	
	/* Drawing on Paint App */
	tmp_ctx.lineWidth = 5;
	tmp_ctx.lineJoin = 'round';
	tmp_ctx.lineCap = 'round';
	tmp_ctx.strokeStyle = 'black';
	tmp_ctx.fillStyle = 'black';
	
	tmp_canvas.addEventListener('mousedown', function(e) {
		tmp_canvas.addEventListener('mousemove', onPaint, false);
		
		mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
		mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
		
		ppts.push({x: mouse.x, y: mouse.y});
		
		onPaint();
	}, false);
	
	tmp_canvas.addEventListener('mouseup', function() {
		tmp_canvas.removeEventListener('mousemove', onPaint, false);
		
		ctx.globalCompositeOperation = 'source-over';
		
		// Writing down to real canvas now
		ctx.drawImage(tmp_canvas, 0, 0);
		// Clearing tmp canvas
		tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
		
		// Emptying up Pencil Points
		ppts = [];
	}, false);
	
	var onPaint = function() {
		
		// Saving all the points in an array
		ppts.push({x: mouse.x, y: mouse.y});
		
		if (ppts.length < 3) {
			var b = ppts[0];
			tmp_ctx.beginPath();
			//ctx.moveTo(b.x, b.y);
			//ctx.lineTo(b.x+50, b.y+50);
			tmp_ctx.arc(b.x, b.y, tmp_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
			tmp_ctx.fill();
			tmp_ctx.closePath();
			
			return;
		}
		
		// Tmp canvas is always cleared up before drawing.
		tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
		
		tmp_ctx.beginPath();
		tmp_ctx.moveTo(ppts[0].x, ppts[0].y);
		
		for (var i = 1; i < ppts.length - 2; i++) {
			var c = (ppts[i].x + ppts[i + 1].x) / 2;
			var d = (ppts[i].y + ppts[i + 1].y) / 2;
			
			tmp_ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
		}
		
		// For the last 2 points
		tmp_ctx.quadraticCurveTo(
			ppts[i].x,
			ppts[i].y,
			ppts[i + 1].x,
			ppts[i + 1].y
		);
		tmp_ctx.stroke();
		
	};
	
	
	canvas.addEventListener('mousedown', function(e) {
		canvas.addEventListener('mousemove', onErase, false);
		
		mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
		mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
		
		ppts.push({x: mouse.x, y: mouse.y});
		
		onErase();
	}, false);
	
	canvas.addEventListener('mouseup', function() {
		canvas.removeEventListener('mousemove', onErase, false);
		
		// Emptying up Pencil Points
		ppts = [];
	}, false);	
	
	// The event handler for any changes made to the color palette
	function ev_color_change (ev) {
	  console.log("Color changed");
		if (colors[this.value]) {
		  color = new colors[this.value]();
		}
	}

  function load_current_page(){
	var imageObj = new Image();
	imageObj.onload = function() {
        context.drawImage(imageObj, 0, 0);
      };
      imageObj.src = currentpage;  
  }
  
  // The event handler for the nextpage button
  function ev_nextpage (ev) {
  console.log(pages.length);
  console.log(page_index);
	if (page_index < (pages.length - 1)){
		page_index = page_index + 1;
		currentpage = pages[page_index]; 
	}
	load_current_page();	
  }   
  
  // The event handler for the prevpage button
  function ev_prevpage (ev) {
	if (page_index > 0){
		page_index = page_index - 1;
		currentpage = pages[page_index]; 
	}
	load_current_page();	
  }     
  
  // The event handler for the size changer
  function ev_reset (ev) {
	load_current_page();
  }    
  
  // The event handler for the size changer
  function ev_size_change (ev) {
	context.lineWidth=this.value;
  } 	
 	
	
	var onErase = function() {
		
		// Saving all the points in an array
		ppts.push({x: mouse.x, y: mouse.y});
		
		ctx.globalCompositeOperation = 'destination-out';
		ctx.fillStyle = 'rgba(0,0,0,1)';
		ctx.strokeStyle = 'rgba(0,0,0,1)';
		ctx.lineWidth = 5;
		
		if (ppts.length < 3) {
			var b = ppts[0];
			ctx.beginPath();
			//ctx.moveTo(b.x, b.y);
			//ctx.lineTo(b.x+50, b.y+50);
			ctx.arc(b.x, b.y, ctx.lineWidth / 2, 0, Math.PI * 2, !0);
			ctx.fill();
			ctx.closePath();
			
			return;
		}
		
		// Tmp canvas is always cleared up before drawing.
		// ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		ctx.beginPath();
		ctx.moveTo(ppts[0].x, ppts[0].y);
		
		for (var i = 1; i < ppts.length - 2; i++) {
			var c = (ppts[i].x + ppts[i + 1].x) / 2;
			var d = (ppts[i].y + ppts[i + 1].y) / 2;
			
			ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
		}
		
		// For the last 2 points
		ctx.quadraticCurveTo(
			ppts[i].x,
			ppts[i].y,
			ppts[i + 1].x,
			ppts[i + 1].y
		);
		ctx.stroke();
		
	};	
	
  colors.color1 = function () {tmp_ctx.strokeStyle="#000000";}
  colors.color2 = function () {tmp_ctx.strokeStyle="#7F7F7F";}
  colors.color3 = function () {tmp_ctx.strokeStyle="#880015";}
  colors.color4 = function () {tmp_ctx.strokeStyle="#DF013A";}
  colors.color5 = function () {tmp_ctx.strokeStyle="#FF4000";}
  colors.color6 = function () {tmp_ctx.strokeStyle="#FFFF00";}
  colors.color7 = function () {tmp_ctx.strokeStyle="#04B431";}
  colors.color8 = function () {tmp_ctx.strokeStyle="#0000FF";}
  colors.color9 = function () {tmp_ctx.strokeStyle="#5F04B4";}
  colors.color10 = function () {tmp_ctx.strokeStyle="#8904B1";}
  colors.color11 = function () {tmp_ctx.strokeStyle="#FFFFFF";}
  colors.color12 = function () {tmp_ctx.strokeStyle="#C3C3C3";}
  colors.color13 = function () {tmp_ctx.strokeStyle="#B45F04";}
  colors.color14 = function () {tmp_ctx.strokeStyle="#F781BE";}
  colors.color15 = function () {tmp_ctx.strokeStyle="#FF8000";}  
  colors.color16 = function () {tmp_ctx.strokeStyle="#BFFF00";}  
  colors.color17 = function () {tmp_ctx.strokeStyle="#04B486";}
  colors.color18 = function () {tmp_ctx.strokeStyle="#2ECCFA";}  
  colors.color19 = function () {tmp_ctx.strokeStyle="#DF01D7";}  
  colors.color20 = function () {tmp_ctx.strokeStyle="#FF00BF";}

  function load_current_page(){
	var imageObj = new Image();
	imageObj.onload = function() {
        tmp_ctx.drawImage(imageObj, 0, 0);
      };
      imageObj.src = currentpage;  
  }
  
  // The event handler for the nextpage button
  function ev_nextpage (ev) {
  console.log(pages.length);
  console.log(page_index);
	if (page_index < (pages.length - 1)){
		page_index = page_index + 1;
		currentpage = pages[page_index]; 
	}
	load_current_page();	
  }   
  
  // The event handler for the prevpage button
  function ev_prevpage (ev) {
	if (page_index > 0){
		page_index = page_index - 1;
		currentpage = pages[page_index]; 
	}
	load_current_page();	
  }     
  
  // The event handler for the size changer
  function ev_reset (ev) {
	load_current_page();
  }    
  
  // The event handler for the size changer
  function ev_size_change (ev) {
	tmp_ctx.lineWidth=this.value;
  }  
  
}());