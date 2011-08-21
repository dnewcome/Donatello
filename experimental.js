/**
 * Arc works by drawing a circle and a rectangular clipping 
 * region. The arc length determines the skew and position of 
 * the clipping region.
 *
 * for arcs > 180deg I think we'll have to use 2 arc regions.
 * Not sure how we would get the proper clipping window for 
 * a single circle to work. Maybe border-clip would work
 * somehow.
 *
 * TODO: arc is broken for wide stroke widths. Need to compensate
 * for this in borderRadius. Also should be re-using circle
 * code for this instead of replicating it here. 
 */
Donatello.prototype.arc = function( x, y, r, s, deg ) {
	// clipping region
	if( deg < 90 ) {
		var clipEl = Donatello.createElement( x-r, y-r, 2*r+s, 2*r+s, 'div');
	}
	else {
		var clipEl = Donatello.createElement( x-r, y-r, 2*r+s, 2*r+s, 'div');
	}
	
	clipEl.style.border = '1px solid black';
	clipEl.style.overflow = 'hidden';
	// clipEl.style[ Donatello.transform ]= 'skew(30deg)rotate(15deg)';
	clipEl.style[ Donatello.transform ]= 'skew(' + (90-deg) +'deg)';
	clipEl.style[ Donatello.transform + 'Origin' ]= '0 0';
	this.dom.appendChild( clipEl );

	// circular drawing region 
	/*
	var el = Donatello.createElement( -r, -r, 2*r, 2*r, 'div');
	el.style.borderRadius = r + 'px';
	el.style.border = '3px solid black';
	*/
	var el = this.circle( 0, 0, r, s ).dom;
	var el2 = this.circle( 0, 0, r, s ).dom;
	var el3 = this.circle( 0, 0, r, s ).dom;
	var el4 = this.circle( 0, 0, r, s ).dom;
	// need to compensate for transforms made by clipping region 
	el.style[ Donatello.transform ]= 'skew(' + -(90-deg) + 'deg)';
	el2.style[ Donatello.transform ]= 'skew(' + -(90-deg) + 'deg)';
	el3.style[ Donatello.transform ]= 'skew(' + -(90-deg) + 'deg)';
	el4.style[ Donatello.transform ]= 'skew(' + -(90-deg) + 'deg)';
	
	// visible drawing region is a child of the clipping region 
	clipEl.appendChild( el );
	clipEl.appendChild( el2 );
	clipEl.appendChild( el3 );
	clipEl.appendChild( el4 );
	return new Donatello( el );
}

/**
* path creates an html canvas element
* and translates svg commands to canvas
* drawing commands.
*
* TODO: parameterize stroke width/style
* and save command array to redraw on changes
* currently path is drawn once and cannot be
* altered later.
*/
Donatello.prototype.path = function( x, y, w, h, path ) {
	var canvas = Donatello.createElement( x, y, w, h, 'canvas' );
	// set coordinate w/h in addition to element css
	canvas.width = w;
	canvas.height = h;

    var context = canvas.getContext("2d");
 
	var lastx = 0, lasty = 0;
    context.beginPath();
	for( var i=0; i < path.length; i++ ) {
		if( path[i][0] == "M" ) {
			context.moveTo( path[i][1], path[i][2] );
			lastx = path[i][1];
			lasty = path[i][2];
		}
		// note relative path commands haven't been tested
		else if( path[i][0] == "m" ) {
			context.moveTo( lastx + path[i][1], lasty + path[i][2] );
			lastx += path[i][1];
			lasty += path[i][2];
		}
		else if( path[i][0] == "L" ) {
			context.lineTo( path[i][1], path[i][2] );
			lastx = path[i][1];
			lasty = path[i][2];
		}
		// note relative path commands haven't been tested
		else if( path[i][0] == "l" ) {
			context.lineTo( lastx + path[i][1], lasty + path[i][2] );
			lastx += path[i][1];
			lasty += path[i][2];
		}
		else if( path[i][0] == "Q" ) {
			context.quadraticCurveTo( 
				path[i][1], path[i][2],path[i][3], path[i][4]  
			);
			lastx = path[i][3];
			lasty = path[i][4];
		}
		else if( path[i][0] == "C" ) {
			context.bezierCurveTo( 
				path[i][1], path[i][2],path[i][3], path[i][4], path[i][5], path[i][6] 
			);
			lastx = path[i][5];
			lasty = path[i][6];
		}
	}
	
    context.lineWidth = 5;
    context.strokeStyle = "#0000ff";
    context.stroke();

	this.dom.appendChild( canvas );
	return new Donatello( canvas );
}

