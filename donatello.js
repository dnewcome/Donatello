// arc, polygon, clip, group
// path (canvas?), clear, bezier

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
*  todo; plane, canvas, paper
*  The idea is to construct a container that
*  has no visible properties by default.
*/
Donatello.paper = function() {
	// return a new Donatello instance
	// with no visible properties
}

/**
 * Detect css transform attribute
 */
Donatello.setTransform = function() {
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

Donatello.prototype.rotate = function( deg ) {
	this.dom.style[ Donatello.transform ] = 'rotate(' + deg + 'deg)';
}

/**
 */
Donatello.prototype.circle = function( x, y, r ) {
	var el = document.createElement( 'div' );	
	el.style.position = 'absolute';
	el.style.top = y - r + 'px';
	el.style.left = x - r + 'px';
	el.style.width = 2*r + 'px';
	el.style.height = 2*r + 'px';
	el.style.borderRadius = r + 'px';
	el.style.border = '1px solid black';
	
	this.dom.appendChild( el );
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

/**
 * Ellipse is similar to circle, should consolidate
 */
Donatello.prototype.ellipse = function( x, y, r1, r2 ) {
	var el = document.createElement( 'div' );	
	el.style.position = 'absolute';
	el.style.top = y + 'px';
	el.style.left = x + 'px';
	el.style.width = r1 + 'px';
	el.style.height = r2 + 'px';
	el.style.borderRadius = r1 / 2  + 'px / ' + r2 / 2  + 'px';
	el.style.border = '1px solid black';
	
	this.dom.appendChild( el );
	return new Donatello( el );
}

Donatello.prototype.rect = function( x, y, dx, dy ) {
	var el = document.createElement( 'div' );	
	el.style.position = 'absolute';
	el.style.top = y + 'px';
	el.style.left = x + 'px';
	el.style.width = dx + 'px';
	el.style.height = dy + 'px';
	el.style.border = '1px solid black';
	
	this.dom.appendChild( el );
	return new Donatello( el );
}

/**
 * Parallelogram - same as rect except for skew angle
 * should consolidate the methods.
 */
Donatello.prototype.pgram = function( x, y, dx, dy, a ) {
	var el = document.createElement( 'div' );	
	el.style.position = 'absolute';
	el.style.top = y + 'px';
	el.style.left = x + 'px';
	el.style.width = dx + 'px';
	el.style.height = dy + 'px';
	el.style.border = '1px solid black';
	el.style[ Donatello.transform ]= 'skew(' + a + 'deg)';
	this.dom.appendChild( el );
	return new Donatello( el );
}

/**
 */
Donatello.prototype.text = function( x, y, str ) {
	var el = document.createElement( 'div' );	
	el.innerHTML = str;
	el.style.position = 'absolute';
	el.style.top = y + 'px';
	el.style.left = x + 'px';
	this.dom.appendChild( el );
	return new Donatello( el );
}

/**
 */
Donatello.prototype.image = function( x, y, w, h, img ) {
	var el = document.createElement( 'img' );	
	el.src = img;
	el.style.position = 'absolute';
	el.style.top = y + 'px';
	el.style.left = x + 'px';
	el.style.width = w + 'px';
	el.style.height = h + 'px';
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
* Draw a straight line. Some browsers offset the 
* line a bit so there can be some quirks trying
* to line up lines precisely. Also vertical lines
* are blurry. Should be able to optimize by looking
* for x=0 and drawing the box in a different orientation
* to start with.
*
* dx/dy are offsets from start, w is stroke width
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
