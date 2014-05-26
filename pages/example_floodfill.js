var colors = []; 
var pages = new Array("url('./pages/coverpage.png')", "url('./pages/page1.png')", "url('./pages/page2.png')", "url('./pages/page3.png')", "url('./pages/page4.png')", "url('./pages/page5.png')", "url('./pages/page6.png')");
var pageSources = new Array("./pages/coverpage.png", "pages/page1.png", "./pages/page2.png", "./pages/page3.png", "./pages/page4.png", "./pages/page5.png", "./pages/page6.png");
var page_index = 0;
var canvas_width = 1110;
var canvas_height = 600;
var currentpage = pages[page_index]; 
var currentpageSource = pageSources[page_index]; 
paintbrushes = new Array("./images/paintbrush_000000.png", "./images/paintbrush_7F7F7F.png", "./images/paintbrush_880015.png", "./images/paintbrush_DF013A.png", "./images/paintbrush_FF4000.png", "./images/paintbrush_FFFF00.png", "./images/paintbrush_04B431.png", "./images/paintbrush_0000FF.png", "./images/paintbrush_5F04B4.png", "./images/paintbrush_8904B1.png", "./images/paintbrush_FFFFFF.png", "./images/paintbrush_C3C3C3.png", "./images/paintbrush_B45F04.png", "./images/paintbrush_F781BE.png", "./images/paintbrush_FF8000.png", "./images/paintbrush_BFFF00.png", "./images/paintbrush_04B486.png", "./images/paintbrush_2ECCFA.png", "./images/paintbrush_DF01D7.png", "./images/paintbrush_FF00BF.png");  
paintbuckets = new Array("./images/paintbucket_000000.png", "./images/paintbucket_7F7F7F.png", "./images/paintbucket_880015.png", "./images/paintbucket_DF013A.png", "./images/paintbucket_FF4000.png", "./images/paintbucket_FFFF00.png", "./images/paintbucket_04B431.png", "./images/paintbucket_0000FF.png", "./images/paintbucket_5F04B4.png", "./images/paintbucket_8904B1.png", "./images/paintbucket_FFFFFF.png", "./images/paintbucket_C3C3C3.png", "./images/paintbucket_B45F04.png", "./images/paintbucket_F781BE.png", "./images/paintbucket_FF8000.png", "./images/paintbucket_BFFF00.png", "./images/paintbucket_04B486.png", "./images/paintbucket_2ECCFA.png", "./images/paintbucket_DF01D7.png", "./images/paintbucket_FF00BF.png");  
paintcolors = new Array("#000000", "#7F7F7F", "#880015", "#DF013A", "#FF4000", "#FFFF00", "#04B431", "#0000FF", "#5F04B4", "#8904B1", "#FFFFFF", "#C3C3C3", "#B45F04", "#F781BE", "#FF8000", "#BFFF00", "#04B486", "#2ECCFA", "#DF01D7", "#FF00BF"); 

var version = "1.0.0.0.1";
// variable for context
var tmp_ctx;

function color_change(index){
	document.getElementById('color').selectedIndex = index; 	
	// update the way the icons look
	var color_brush = document.getElementById('colorbrush');
	color_brush.src = paintbrushes[index];
	var color_bucket = document.getElementById('colorbucket');
	color_bucket.src = paintbuckets[index];	
	var eraser = document.getElementById('eraser_img');
	eraser.src = "./images/eraser.png";		
	// update the color
	tmp_ctx.strokeStyle= paintcolors[index];
	tmp_ctx.fillStyle= paintcolors[index];
}

(function() {
	console.log("Current version: " + version);
	//var canvas = document.querySelector('#paint');
	//var ctx = canvas.getContext('2d');
	var canvas = document.querySelector('#paint');
	var ctx = canvas.getContext('2d');  
	var sketch = document.querySelector('#sketch');
	var sketch_style = getComputedStyle(sketch);
	var tmp_canvas = document.createElement('canvas');
	tmp_ctx = tmp_canvas.getContext('2d');
	var outlineCanvas = document.createElement('canvas');
	var outline = outlineCanvas.getContext('2d');
	// for the flood tool
	var outlineLayerData, outlineData, outlineImage;
	load_current_page();
	
	// Determine Tool
	var tool = 'pencil';
	document.querySelector('#brush').onclick = function() {
		tool = 'pencil';
		
		// Show Tmp Canvas
		tmp_canvas.style.display = 'block';
	};
	document.querySelector('#bucket').onclick = function() {
		tool = 'bucket';
		
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
	tmp_ctx.lineWidth = 8;
	ctx.lineWidth = 8;
	tmp_ctx.lineJoin = 'round';
	tmp_ctx.lineCap = 'round';
	tmp_ctx.strokeStyle = 'black';
	tmp_ctx.fillStyle = 'black';
	document.getElementById('size').selectedIndex = 2; 
	
	tmp_canvas.addEventListener('mousedown', function(e) {
		tmp_canvas.addEventListener('mousemove', onPaint, false);
		
		mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
		mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
		
		ppts.push({x: mouse.x, y: mouse.y});
		
		onPaint(mouse.x, mouse.y);
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
	
	var floodfill = function(curX, curY){
	  outlineImage = new Image(currentpage);
	  outlineImage.src = currentpageSource;  
	  console.log(outlineImage);	

    outline.drawImage(outlineImage, 0, 0);
		console.log("loading outlineImage.onLoad in floodfill" + outlineImage);
		
		outlineData = outlineLayerData.data;
		var n = outlineData.length;
		console.log(n);
		// 2664000 is the length
		// iterate over all pixels
		/*
		for(var i = 1610; i < 2000; i += 4) {
		  var red = outlineData[i];
		  var green = outlineData[i + 1];
		  var blue = outlineData[i + 2];
		  var alpha = outlineData[i + 3];
		 	console.log("red " + red + " blue " + blue + " green " + green + " alpha " + alpha);
		}	*/

		console.log("outlineImage: ");
		console.log(outlineImage);
		console.log("outline Context: ");
		console.log(outline);		
		var imageWidth = outlineImage.width;
		var imageHeight = outlineImage.height;
		var pixelPos = (curY * imageWidth + curX) * 4;
		console.log("pixel pos is: " + pixelPos);
		var r = outlineData[pixelPos],
							g = outlineData[pixelPos + 1],
							b = outlineData[pixelPos + 2],
							a = outlineData[pixelPos + 3];     	
    console.log("outline eval X: " + curX + " Y: " + curY + 
      		" is r: " + r + " g: " + g + " b: " + b);	

		// create an image swatch
		var swatch = tmp_ctx.createImageData(1, 1);
		var swatchData = swatch.data;
		swatchData[0] = tmp_ctx.fillStyle.r;
		swatchData[1] = tmp_ctx.fillStyle.g;
		swatchData[2] = tmp_ctx.fillStyle.b;
		swatchData[3] = tmp_ctx.fillStyle.a;
		tmp_ctx.putImageData(swatch, curX, curY);

		var tmp_imageData = tmp_ctx.getImageData(0, 0, imageWidth, outlineImage.height);	
		var endX = curX + 20;
		var endY = curY + 10;
    // iterate over all pixels based on x and y coordinates
    /*
    for(var y = curY; y < endY; y++) {
      for(var x = curX; x < endX; x++) {
			 	var pixelPos = (y * imageWidth + x) * 4,
							r = outlineLayerData.data[pixelPos],
							g = outlineLayerData.data[pixelPos + 1],
							b = outlineLayerData.data[pixelPos + 2],
							a = outlineLayerData.data[pixelPos + 3];     	

      	console.log("beginning of outline eval X: " + x + " Y: " + y + 
      		" is r: " + r + " g: " + g + " b: " + b);				
				if (r < 20){
					tmp_ctx.fillRect( x, y, 1, 1 );
				} else{
					// break this loop, we're at the end
					if (x == curX){
		    		//console.log("y: " + y + " setting y to max");
						// done, found the outline
						return;
					}else{
						// found outline on right, go to the next line
						//console.log("x: " + x + " setting x to start");
						x = imageWidth;
						break;					
					}					
				} 

      }	// for x
    } // for y
*/
	};
	
	var onPaint = function(startX, startY)  {
		if (tool == 'bucket'){
			// Saving all the points in an array
			ppts.push({x: mouse.x, y: mouse.y});
			var b = ppts[0];
			tmp_ctx.beginPath();


			floodfill(b.x, b.y);
			//tmp_ctx.fillRect(b.x, b.y, 20, 20);	
			tmp_ctx.closePath();
		}else{
			// Saving all the points in an array
			ppts.push({x: mouse.x, y: mouse.y});
			
			if (ppts.length < 3) {
				var b = ppts[0];
				tmp_ctx.beginPath();
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
		}
		
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

  function draw_outline(){
  outlineImage = new Image(currentpage);
  outlineImage.src = currentpageSource;  
  console.log(outlineImage);	

	outlineImage.onload = function() {
    outline.drawImage(outlineImage, 0, 0);
		console.log("loading image2" + outlineImage);
		
		var imageWidth = outlineImage.width;
		outlineLayerData = outline.getImageData(0, 0, imageWidth, outlineImage.height);
		outlineData = outlineLayerData.data;
		 		//var n = outlineData.length;
				var n = 40;
		 		console.log(n);
		 	
		        // iterate over all pixels
		         /*for(var i = 0; i < n; i += 4) {
		           var red = outlineData[i];
		           var green = outlineData[i + 1];
		           var blue = outlineData[i + 2];
		          var alpha = outlineData[i + 3];
		 		  console.log("red " + red + " blue " + blue + " green " + green + " alpha " + alpha);
		         }*/

    };

  }
	
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

		draw_outline();
  }
  
  // The event handler for the nextpage button
  function ev_nextpage (ev) {
	  console.log("event nextPage");
		if (page_index < (pages.length - 1)){
			page_index = page_index + 1;
			currentpage = pages[page_index]; 
			currentpageSource = pageSources[page_index];
		}
		load_current_page();	
  }   
  
  // The event handler for the prevpage button
  function ev_prevpage (ev) {
	  console.log("event prevPage");
		if (page_index > 0){
			page_index = page_index - 1;
			currentpage = pages[page_index]; 
			currentpageSource = pageSources[page_index];
		}
		load_current_page();	
  }     
  
  // The event handler for the size changer
  function ev_reset (ev) {
	  console.log("event handler for reset");
		load_current_page();
  }    
	
	var onErase = function() {
		var eraser = document.getElementById('eraser_img');
		eraser.src = "./images/eraser_on.png";		
		// Saving all the points in an array
		ppts.push({x: mouse.x, y: mouse.y});
		
		ctx.globalCompositeOperation = 'destination-out';
		ctx.fillStyle = 'rgba(0,0,0,1)';
		ctx.strokeStyle = 'rgba(0,0,0,1)';
		
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