/**
* Donatello - A pure CSS drawing library.
*/

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
 * center coordinates, radius, attributes 
 */
Donatello.prototype.circle = function( x, y, r, a ) {
	var s = a && a['stroke-width'] || 1;
	var c = a && a['stroke'] || 'black';
	var f = a && a['fill'] || 'transparent';
	var style = a && a['stroke-style'] || 'solid';
	var el = Donatello.createElement( x-r-s, y-r-s, 2*r, 2*r, 'div');
	el.style.borderRadius = r + s + 'px';
	el.style.borderStyle = style;
	el.style.borderColor = c;
	el.style.backgroundColor = f;
	el.style.borderWidth = s  + 'px';
	this.dom.appendChild( el );
	return new Donatello( el );
}

/**
 * Ellipse is similar to circle, should consolidate
 * xy position, xy radius, stroke width
 */
Donatello.prototype.ellipse = function( x, y, rx, ry, s ) {
	var el = Donatello.createElement( x-rx-s, y-ry-s, 2*rx, 2*ry, 'div');
	el.style.borderRadius = ( rx + s ) + 'px / ' + ( ry + s ) + 'px';
	// default border
	el.style.border = '1px solid black';
	el.style.borderWidth = s + 'px';
	
	this.dom.appendChild( el );
	return new Donatello( el );
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
