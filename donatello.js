/**
* Donatello - A pure CSS drawing library.
*
* Provided under the MIT license.
* See LICENSE file for full text of the license.
* Copyright 2011 Dan Newcome.
*/


/**
* Donatello objects are used to represent shapes drawn
* in the scene. The scene consists of a tree of these.
*
* id - id string of an existing DOM element or a reference
* to the DOM element itself.
* x/y, w/h - position and size
*/
function Donatello( id, x, y, w, h ) {
	// TODO fix hacky initialization
	Donatello.setTransform();

	/** 
	* Translation between drawing terminology and CSS property 
	* names.
	*/
	this.attrMap = {
		fill: 'backgroundColor',
		stroke: 'borderColor',
		'stroke-style': 'borderStyle',
		// todo: we ignore stroke width becuase it requires
		// the object to be recalculated
		'stroke-width': null,
		'x': null,
		'y': null,
		'w': null,
		'h': null,
		'r': 'borderRadius',
		'type': null,
		'children': null,
		'transform': Donatello.transform
	}

	if( typeof id == 'string' ) {
		var el = document.getElementById( id );
		Donatello.createElement( x, y, w, h, el );
		this.dom = el;
	}
	else {
		this.dom = id;
	}
}

/*
* Paper is a Donatello object that serves as a container 
* and has no visible attributes. Essentially a factory
* method wrapping Donatello constructor for now.
*  todo; thinking about renaming this to plane 
*/
Donatello.paper = function( id, x, y, z, w, h ) {
	return new Donatello( id, x, y, z, w, h );
}

/** 
* create drawing graph declaratively
* par - parent Donatello object
* a - attribute object 
* Only works for rect at this stage.
*/
Donatello.decl = function( par, a ) {
	var don;
	if( a.type == 'rect' ) {
		don = par.rect( a.x, a.y, a.w, a.h, a );
	}
	for( var i=0; i < a.children.length; i++ ) {
		Donatello.decl( don, a.children[i] );	
	}
}

/**
 * Detect css transform attribute for browser compatibility.
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
	// also return transform - used in attr mapping
	// part of hacky init that should be fixed somehow
	return transform;
}


/**
* Internal function for creating the appropriate 
* linear gradient function
*
* TODO: need to map between moz style gradient spec (deg) 
* and webkit (endpoints)
*/
Donatello.createLinearGradient = function( deg, color1, color2 ) {
	var retval;
	switch( Donatello.transform ) {
		case 'MozTransform':
			retval = '-moz-linear-gradient(' + deg + 'deg,' + color1 + ', ' + color2 + ')';
			//retval = '-moz-linear-gradient(top,' + color1 + ', ' + color2 + ')';
			break;
		case 'webkitTransform':
			// retval = '-webkit-gradient(linear, left top, left bottom, from(' + color1 + '), to(' + color2 + '))'; 
			retval = '-webkit-gradient(linear, left top, left bottom, from(' + color1 + '), to(' + color2 + '))'; 
			break;
		case 'msTransform':
			// note that filter: attribute must be set rather than background:
			retval = 'progid:DXImageTransform.Microsoft.gradient(startColorstr="' + color1 + '", endColorstr="' + color2 + '")'; 
			break;
		case 'OTransform':
			retval = '-o-linear-gradient(0deg,' + color1 + ',' + color2 + ')';
			break;
	}
	console.log( 'gradient: ' + retval );
	return retval;
}


/**
* Internal function for creating the appropriate 
* radial gradient function
*/
Donatello.createRadialGradient = function() {
	throw 'Radial gradients not implemented';
}

/**
 * Transformation methods that apply to all shapes
 */

Donatello.prototype.rotate = function( deg ) {
	// note that we add the rotation to the existing transform. 
	// not sure if this will cause problems at any point - we may 
	// need some more sophisticated managment of the list of applied
	// transforms later on down the road.
	this.dom.style[ Donatello.transform ] += 'rotate(' + deg + 'deg)';
}

Donatello.prototype.clear = function() {
	while( this.dom.hasChildNodes() ) {
		this.dom.removeChild( this.dom.lastChild );
	}
}

Donatello.prototype.delete = function() {
	this.dom.parentNode.removeChild( this.dom );
}

Donatello.prototype.node = function() {
	return this.dom;
}


/**
* Setting attributes looks for mapped attributes first, then
* passes attribute through as a CSS attribute.
*/
Donatello.prototype.attr = function( obj ) {
	var mapping = this.attrMap;
	for( attr in obj ) {
		if( mapping[attr] != null ){
			if( attr == 'r' ) {
				// special case to add 'px' to radius specification
				// TODO: see about simplifying this stuff
				this.dom.style[mapping[attr]] = obj[attr] + 'px';
			}
			else {
				this.dom.style[mapping[attr]] = obj[attr];
			}
		} 
		else if( 
			attr != 'stroke-width' && 
			attr != 'x' && 
			attr != 'y' && 
			attr != 'w' && 
			attr != 'h' && 
			attr != 'type' && 
			attr != 'children' 
		) {
			this.dom.style[attr] = obj[attr];
		}
	}
	return this;
}


/**
* Drawing methods
*/

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
Donatello.prototype.ellipse = function( x, y, rx, ry, a ) {
	var s = a && a['stroke-width'] || 1;
	var c = a && a['stroke'] || 'black';
	var f = a && a['fill'] || 'transparent';
	var style = a && a['stroke-style'] || 'solid';

	var el = Donatello.createElement( x-rx-s, y-ry-s, 2*rx, 2*ry, 'div');
	el.style.borderRadius = ( rx + s ) + 'px / ' + ( ry + s ) + 'px';
	el.style.borderStyle = style;
	el.style.borderColor = c;
	el.style.borderWidth = s + 'px';
	el.style.backgroundColor = f;
	
	this.dom.appendChild( el );
	return new Donatello( el );
}



/**
*  Draw a rectangular region to the scene.
*/
Donatello.prototype.rect = function( x, y, w, h, a ) {
	return this.pgram( x, y, w, h, null, a );
}

/**
* Set up some reasonable default values if attr array
* is missing or underspecified
*/
Donatello.attrDefaults = function( a ) {
	a = a || {};
	if( !a['stroke-width'] ) a['stroke-width'] = 1;
	if( !a['stroke'] ) a['stroke'] = 'black';
	if( !a['fill'] ) a['fill'] = 'transparent';
	if( !a['stroke-style'] ) a['stroke-style'] = 'solid';
	return a;
};

/**
 * generalized parallelogram, used by rect.
 */
Donatello.prototype.pgram = function( x, y, dx, dy, skew, a ) {
	a = Donatello.attrDefaults( a );
	var el = Donatello.createElement( x, y, dx, dy, 'div');

	el.style.borderWidth = a['stroke-width'] + 'px';

	if( skew != null ) {
		el.style[ Donatello.transform ] += 'skew(' + skew + 'deg)';
	}
	this.dom.appendChild( el );
	var don = new Donatello( el );
	don.attr( a );
	return don;
}

/**
* Draw text to the scene using a <div> tag.
*/
Donatello.prototype.text = function( x, y, str ) {
	var el = Donatello.createElement( x, y, null, null, 'div');
	el.innerHTML = str;
	this.dom.appendChild( el );
	return new Donatello( el );
}

/**
* Draw an image to the scene using an <img> tag.
*/
Donatello.prototype.image = function( x, y, w, h, img ) {
	var el = Donatello.createElement( x, y, w, h, 'img');
	el.src = img;
	this.dom.appendChild( el );
	return new Donatello( el );
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
*
* Note that angles are inaccurate for wide stroke widths.
*/
Donatello.prototype.line = function( x, y, dx, dy, a ) {
	var w = a && a['stroke-width'] || 1
	var stroke = w;

	var c = a && a['stroke'] || 'black';
	var f = a && a['fill'] || 'transparent';
	var style = a && a['stroke-style'] || 'solid';

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
	el.style.borderTopStyle = style;
	el.style.borderTopWidth = stroke + 'px';
	el.style.borderTopColor = c;

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
		rot = 180+rot;
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

/**
* Internally used  method for creating
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
