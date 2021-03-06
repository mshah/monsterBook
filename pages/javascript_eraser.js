var colors = []; 
var pages = new Array("url('./pages/coverpage.png')", "url('./pages/page1.png')", "url('./pages/page2.png')", "url('./pages/page3.png')", "url('./pages/page4.png')", "url('./pages/page5.png')", "url('./pages/page6.png')");
var page_index = 0;
var currentpage = pages[page_index]; 
paintbrushes = new Array("./images/paintbrush_000000.png", "./images/paintbrush_7F7F7F.png", "./images/paintbrush_880015.png", "./images/paintbrush_DF013A.png", "./images/paintbrush_FF4000.png", "./images/paintbrush_FFFF00.png", "./images/paintbrush_04B431.png", "./images/paintbrush_0000FF.png", "./images/paintbrush_5F04B4.png", "./images/paintbrush_8904B1.png", "./images/paintbrush_FFFFFF.png", "./images/paintbrush_C3C3C3.png", "./images/paintbrush_B45F04.png", "./images/paintbrush_F781BE.png", "./images/paintbrush_FF8000.png", "./images/paintbrush_BFFF00.png", "./images/paintbrush_04B486.png", "./images/paintbrush_2ECCFA.png", "./images/paintbrush_DF01D7.png", "./images/paintbrush_FF00BF.png");  
paintcolors = new Array("#000000", "#7F7F7F", "#880015", "#DF013A", "#FF4000", "#FFFF00", "#04B431", "#0000FF", "#5F04B4", "#8904B1", "#FFFFFF", "#C3C3C3", "#B45F04", "#F781BE", "#FF8000", "#BFFF00", "#04B486", "#2ECCFA", "#DF01D7", "#FF00BF"); 


// variable for context
var tmp_ctx;

function color_change(index){
	document.getElementById('color').selectedIndex = index; 
	
	// update the way the icons look
	var color_brush = document.getElementById('colorbrush');
	color_brush.src = paintbrushes[index];
	var eraser = document.getElementById('eraser_img');
	eraser.src = "./images/eraser.png";		
	document.getElementById('brush').click();
	tmp_ctx.strokeStyle= paintcolors[index];

}

(function() {
	
	//var canvas = document.querySelector('#paint');
	//var ctx = canvas.getContext('2d');
	var canvas = document.querySelector('#paint');
	var ctx = canvas.getContext('2d');  
	var sketch = document.querySelector('#sketch');
	var sketch_style = getComputedStyle(sketch);
	var tmp_canvas = document.createElement('canvas');
	tmp_ctx = tmp_canvas.getContext('2d');	
	load_current_page();
	
	
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
	var mouse = {x: 0, y: 0};
	var last_mouse = {x: 0, y: 0};
	
	// Pencil Points
	var ppts = [];
	
	// attach event handlers to the prev and next buttons
	var prev_button = document.getElementById('prevbutton');
	var next_button = document.getElementById('nextbutton');
	prev_button.addEventListener('click', ev_prevpage, false); 
	next_button.addEventListener('click', ev_nextpage, false);

	document.querySelector('#size').onclick = function() {
		console.log("event handler for size changer");
		ctx.lineWidth=this.value;
		tmp_ctx.lineWidth=this.value;
	};

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
	tmp_ctx.lineWidth = 4;
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

  function load_current_page(){
	canvas.width = parseInt(sketch_style.getPropertyValue('width'));
	canvas.height = parseInt(sketch_style.getPropertyValue('height'));
	// Creating a tmp canvas
	tmp_canvas.id = 'tmp_canvas';
	tmp_canvas.width = canvas.width;
	tmp_canvas.height = canvas.height;	
	sketch.appendChild(tmp_canvas);  
  
	var property = "url('" + currentpage + ")";
	sketch.style.background =  currentpage;
  }
  
  // The event handler for the nextpage button
  function ev_nextpage (ev) {
  console.log("event nextPage");
	if (page_index < (pages.length - 1)){
		page_index = page_index + 1;
		currentpage = pages[page_index]; 
	}
	load_current_page();	
  }   
  
  // The event handler for the prevpage button
  function ev_prevpage (ev) {
  console.log("event prevPage");
	if (page_index > 0){
		page_index = page_index - 1;
		currentpage = pages[page_index]; 
	}
	load_current_page();	
  }     
  
  // The event handler for the size changer
  function ev_reset (ev) {
  console.log("event handler for reset");
	load_current_page();
  }    
	
	var onErase = function() {
		
		// Saving all the points in an array
		ppts.push({x: mouse.x, y: mouse.y});
		
		ctx.globalCompositeOperation = 'destination-out';
		ctx.fillStyle = 'rgba(0,0,0,1)';
		ctx.strokeStyle = 'rgba(0,0,0,1)';
		//ctx.lineWidth = 16;
		
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
 
}());