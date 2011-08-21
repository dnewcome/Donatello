// polygon, clip, group
// bezier
// boundingBox/clickarea/toucharea

/**
 * Construct a toplevel drawing surface. This is no
 * different than any other Donatello node, but it has
 * no visible properties.
 */
function Donatello( id, x, y, w, h ) {
	// TODO fix hacky initialization
	Donatello.setTransform();

	if( typeof id == 'string' ) {
	var el = document.getElementById( id );
	el.style.position = 'relative';
	el.style.top = x + 'px';
	el.style.left = y + 'px';
	el.style.width = w + 'px';
	el.style.height = h + 'px';
	
	this.dom = el;
	}
	else {
		this.dom = id;
	}
}

/*
*  todo; thinking about renaming this to plane 
*/
Donatello.paper = function( id, x, y, z, w, h ) {
	return new Donatello( id, x, y, z, w, h );
}

/**
 * Detect css transform attribute
 * Must be called after DOM is loaded since we detect
 * features by looking at DOM properties.
 */
Donatello.setTransform = function() {
	if( Donatello.transform == undefined ) {
		var transform;
		// css spec, no browser supports this yet
		if( typeof document.body.style.transform != 'undefined' ) {
			transform = 'transform';
		} 
		else if( typeof document.body.style.webkitTransform != 'undefined' ) {
			transform = 'webkitTransform';
		} 
		else if( typeof document.body.style.MozTransform != 'undefined' ) {
			transform = 'MozTransform';
		} 
		else if( typeof document.body.style.msTransform != 'undefined' ) {
			transform = 'msTransform';
		} 
		else if( typeof document.body.style.OTransform != 'undefined' ) {
			transform = 'OTransform';
		} 
		// transforms not supported
		else { transform = null }
		console.log( 'css transform: ' + transform );
		Donatello.transform = transform;
	}
}

Donatello.prototype.rotate = function( deg ) {
	this.dom.style[ Donatello.transform ] = 'rotate(' + deg + 'deg)';
}

Donatello.prototype.clear = function() {
	while( this.dom.hasChildNodes() ) {
		this.dom.removeChild( this.dom.lastChild );
	}
}

/**
 * Draw a circle
 */
Donatello.prototype.circle = function( x, y, r ) {
	var el = Donatello.createElement( x-r, y-r, 2*r, 2*r, 'div');
	// border radius must be r+borderWidth
	// for now we fudge and set to high number. Too big isn't
	// a problem, but this seems like a hack.
	el.style.borderRadius = r + 1000 + 'px';
	el.style.border = '1px solid black';
	this.dom.appendChild( el );
	return new Donatello( el );
}

/**
 * Ellipse is similar to circle, should consolidate
 */
Donatello.prototype.ellipse = function( x, y, rx, ry ) {
	var el = Donatello.createElement( x, y, 2*rx, 2*ry, 'div');
	var sw = 20; // TODO: stroke width
	// TODO: ellipse doesn't look quite right with large borders
	// and large ration between rx/ry. Inner curve seems 'pinched'.
	el.style.borderRadius = ( rx + sw ) + 'px / ' + ( ry + sw ) + 'px';
	el.style.border = '1px solid black';
	
	this.dom.appendChild( el );
	return new Donatello( el );
}

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
Donatello.prototype.arc = function( x, y, r ) {
	// clipping region
	var clipEl = Donatello.createElement( x-r, y-r, 2*r, 2*r, 'div');
	clipEl.style.border = '1px solid black';
	clipEl.style.overflow = 'hidden';
	clipEl.style[ Donatello.transform ]= 'skew(30deg)rotate(15deg)';
	this.dom.appendChild( clipEl );

	// circular drawing region 
	var el = Donatello.createElement( -r, -r, 2*r, 2*r, 'div');
	el.style.borderRadius = r + 'px';
	el.style.border = '3px solid black';
	// need to compensate for transforms made by clipping region 
	el.style[ Donatello.transform ]= 'skew(-30deg)';
	
	// visible drawing region is a child of the clipping region 
	clipEl.appendChild( el );
	return new Donatello( el );
}

/* TODO: fill and stroke may not always be border/background color */
Donatello.prototype.setFill = function( fill ) {
	this.dom.style.backgroundColor = fill;
}
Donatello.prototype.setStroke = function( stroke ) {
	this.dom.style.borderColor = stroke;
}
Donatello.prototype.setStrokeWidth = function( width ) {
	this.dom.style.borderWidth = width + 'px';
}


Donatello.prototype.rect = function( x, y, w, h ) {
	return this.pgram( x, y, w, h, null );
}

/**
 * generalized parallelogram
 */
Donatello.prototype.pgram = function( x, y, dx, dy, a ) {
	var el = Donatello.createElement( x, y, dx, dy, 'div');
	el.style.border = '1px solid black';
	if( a != null ) {
		el.style[ Donatello.transform ]= 'skew(' + a + 'deg)';
	}
	this.dom.appendChild( el );
	return new Donatello( el );
}

/**
 */
Donatello.prototype.text = function( x, y, str ) {
	var el = Donatello.createElement( x, y, null, null, 'div');
	el.innerHTML = str;
	this.dom.appendChild( el );
	return new Donatello( el );
}

/**
 */
Donatello.prototype.image = function( x, y, w, h, img ) {
	var el = Donatello.createElement( x, y, w, h, 'img');
	el.src = img;
	this.dom.appendChild( el );
	return new Donatello( el );
}

// like raphael, get underlying dom node
Donatello.prototype.node = function() {
	return this.dom;
}

// like raphael, set attributes 
Donatello.prototype.attr = function( obj ) {
	for( attr in obj ) {
		this.dom.style[attr] = obj[attr];
	}
	return this.dom;
}

/**
* Convenience constructor for creating
* and initializing DOM elements.
* name is either tag name of a dom element
*/
Donatello.createElement = function( x, y, w, h, name ) {
	var el;
	if( typeof name == 'string' ) {
		el = document.createElement( name );
	}
	else {
		el = name;
	}
	el.style.position = 'absolute';
	el.style.top = y + 'px';
	el.style.left = x + 'px';
	el.style.width = w + 'px';
	el.style.height = h + 'px';
	return el;
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

/**
* Draw a straight line. Some browsers offset the 
* line a bit so there can be some quirks trying
* to line up lines precisely. Also vertical lines
* are blurry. Should be able to optimize by looking
* for x=0 and drawing the box in a different orientation
* to start with.
*
* dx/dy are offsets from start, w is stroke width
*
* TODO: add end caps - box-radius for rounded,
* borders for diagonal. also maybe linejoin
* 
* Need better compensation for wide strokes
*/
Donatello.prototype.line = function( x, y, dx, dy, w ) {
	var stroke = w || 1;
	var len = Math.sqrt(dx*dx + dy*dy );
	var el = document.createElement( 'div' );	
	el.style.position = 'absolute';
	el.style.top = y + 'px';
	el.style.left = x + 'px';

	// width is the line length	
	el.style.width = len + 'px';

	// height is the line width
	el.style.height = '0px';

	// setting both borders makes line too thick
	el.style.borderTop = stroke + 'px solid black';

	// find the angle
	var rot = Math.asin( Math.abs(dy) / len );
	// convert to degrees
	rot = rot * (180/Math.PI);

	// we handle other orientations by adjusting 
	// rotation according to quadrant 
	if( dx < 0 && dy >= 0 ) {
		rot = 180-rot;
	}
	else if( dx < 0 && dy <  0 ) {
		rot = 270-rot;
	}
	else if( dx >= 0 && dy < 0 ) {
		rot = 360-rot;
	}

	el.style[ Donatello.transform ] = 'rotate(' + rot + 'deg)';
	// note we offset origin to account for using only border top 
	el.style[ Donatello.transform + 'Origin' ] = '0px ' + stroke/2 + 'px';
	this.dom.appendChild( el );
	return new Donatello( el );
}
