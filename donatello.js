/**
* Donatello - A pure CSS vector drawing library.
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

	// properties that require a redraw 
	this.properties = {};

	/** 
	* Translation between drawing terminology and CSS property 
	* names.
	*
	* attr map must be created new for each instance. 
	* later we can optimize, one per shape type, but 
	* this was the source of a bug where one map was shared
	* between all donatello shapes, which aren't compatible.
	*/
	this.attrMap = {
		fill: 'backgroundColor',
		stroke: 'borderColor',
		'stroke-style': 'borderStyle',
		'r': 'borderRadius',
		// type and children are not applied as styles
		// so we ignore them by setting to null
		'type': null,
		'children': null,
		'transform': Donatello.getTransform()
	}

	if( typeof id == 'string' ) {
		var el = document.getElementById( id );
		Donatello.createElement( x, y, w, h, el );
		this.dom = el;
	}
	else if( id != null ) {
		this.dom = id;
	}
}

/**
 * Detect css transform attribute for browser compatibility.
 * Must be called after DOM is loaded since we detect
 * features by looking at DOM properties.
 */
Donatello.getTransform = function() {
	var transform;
	var testEl = document.createElement('div');
	if( Donatello.transform == undefined ) {
		// css spec, no browser supports this yet
		if( typeof testEl.style.transform != 'undefined' ) {
			transform = 'transform';
		} 
		else if( typeof testEl.style.webkitTransform != 'undefined' ) {
			transform = 'webkitTransform';
		} 
		else if( typeof testEl.style.MozTransform != 'undefined' ) {
			transform = 'MozTransform';
		} 
		else if( typeof testEl.style.msTransform != 'undefined' ) {
			transform = 'msTransform';
		} 
		else if( typeof testEl.style.OTransform != 'undefined' ) {
			transform = 'OTransform';
		} 
		// transforms not supported
		else { transform = null }
		console.log( 'css transform: ' + transform );
		Donatello.transform = transform;
	}
	else {
		transform = Donatello.transform;
	}	
	// also return transform - used in attr mapping
	// part of hacky init that should be fixed somehow
	return transform;
}

/**
 * Utility function to merge properties of 
 * two objects. Used with map objects.
 */
Donatello.merge = function( src, dst ) {
	for( var prop in src ) {
		dst[prop] = src[prop];
	}
	return dst;
};

/**
* Each type of donatello shape needs to impelement draw
*/
Donatello.prototype.draw = function() {
	// TODO: insert this exception to watch for unimplemented draw()
	// throw "draw not implemented for shape";
};

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
* Internal function for creating the appropriate 
* linear gradient function
*/
Donatello.createLinearGradient = function( deg, color1, color2 ) {
	// we round angles down to multiples of 45deg
	deg = Math.floor(deg/45);
	// default to centered vertical gradient
	var webkitLine = "center top, center bottom";
	switch( deg ) {
		case 0:
			webkitLine = "left center, right center";
			break;
		case 1:
			webkitLine = "left bottom, right top";
			break;
		case 2:
			webkitLine = "center bottom, center top";
			break;
		case 3:
			webkitLine = "right bottom, left top";
			break;
		case 4:
			webkitLine = "right center, left center";
			break;
		case 5:
			webkitLine = "right top, left bottom";
			break;
		case 6:
			webkitLine = "center top, center bottom";
			break;
		case 7:
			webkitLine = "left top, right bottom";
			break;
		case 8:
			webkitLine = "left center, right center";
			break;
	}
	var retval;
	switch( Donatello.getTransform() ) {
		case 'MozTransform':
			retval = '-moz-linear-gradient(' + 
				deg*45 + 'deg,' + color1 + ', ' + color2 + ')';
			break;
		case 'webkitTransform':
			retval = '-webkit-gradient(linear, ' + webkitLine + 
				', from(' + color1 + '), to(' + color2 + '))'; 
			break;
		case 'msTransform':
			// note that filter: attribute must be set rather than background:
			// in IE gradient type is either 0 (top to bottom) or 1 (left to right)
			var gtype = Math.floor(deg%4/2)
			retval = 'progid:DXImageTransform.Microsoft.gradient(GradientType=' + 
				gtype + ', startColorstr="' + 
				color1 + '", endColorstr="' + color2 + '")'; 
			break;
		case 'OTransform':
			retval = '-o-linear-gradient(' + deg*45 +'deg,' + 
				color1 + ',' + color2 + ')';
			break;
	}
	// console.log( 'gradient: ' + retval );
	return retval;
}


/**
 * Transformation methods that apply to all shapes
 */

Donatello.prototype.rotate = function( deg ) {
	// note that we add the rotation direction to the existing transform. 
	// TODO: we need to keep an array of transforms instead of just 
	// concatenating here
	this.dom.style[ Donatello.getTransform() ] += 'rotate(' + deg + 'deg)';
}

Donatello.prototype.clear = function() {
	while( this.dom.hasChildNodes() ) {
		this.dom.removeChild( this.dom.lastChild );
	}
}

Donatello.prototype['delete'] = function() {
	this.dom.parentNode.removeChild( this.dom );
}

Donatello.prototype.node = function() {
	return this.dom;
}

/**
* Setting attributes looks for mapped attributes first, then
* passes attribute through as a CSS attribute.
*
* We merge given properties into the properties map
* TODO: this could be lots simpler. 
*/
Donatello.prototype.attr = function( obj ) {
	if( obj == undefined ) return this.properties;

	Donatello.merge( obj, this.properties );
	var mapping = this.attrMap;
	for( attr in obj ) {
		// apply mapped property
		if( mapping[attr] != null ){
			if( attr == 'r' || attr == 'stroke-width' ) {
				// special case to add 'px' to radius specification
				// TODO: see about simplifying this stuff
				this.dom.style[mapping[attr]] = obj[attr] + 'px';
			}
			else if( attr == 'fill' ) {
				// hacky way to check for gradient spec
				if( obj['fill'] && obj['fill'].length > 7 ) {
					var str = obj['fill'];
					this.dom.style['backgroundImage'] = Donatello.createLinearGradient(
						str.substr( 0, 2 ),
						str.substr( 3, 7 ),
						str.substr( 11, 7 )
					);	
				}
				else {
					this.dom.style[mapping[attr]] = obj[attr];
				}
			}
			// scale in raphael has a center point. Need to convert
			// that to transformOrigin.
			else if( attr == 'scale' ) {
				/*
 				Pretty sure this isn't going to work this easily
				console.log('scaling');
				this.dom.style['transform'] = 'scale( ' + obj[attr]+ ' )';
				*/
			}
			else {
				this.dom.style[mapping[attr]] = obj[attr];
			}
		} 
		// apply property as css otherwise
		else if( 
			// ignore attributes that we ordinarily set using
			// positional arguments.
			attr != 'stroke-width' && 
			attr != 'x' && 
			attr != 'y' && 
			attr != 'w' && 
			attr != 'h' && 
			// children and type are used for declarative instantiation
			attr != 'type' && 
			attr != 'children' 
		) {
			// TODO: thinking about using a function override for 
			// individual elements in a composite shape. This works only
			// if we have a set of elements that we want to apply the same
			// styles to in every case.
			if( typeof this.styleableElements != 'undefined' ) {
				for( var i=0; i < this.styleableElements.length; i++ ) {
					console.log('setting ' + attr + ' to ' + obj[attr] );
					this.styleableElements[i].style[attr] = obj[attr];
				}
			}
			else {
				this.dom.style[attr] = obj[attr];
			}
		}
	}
	this.draw();
	return this;
}


/**
* Drawing methods
*/


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

/**
* Set up some reasonable default values if attr array
* is missing or underspecified
*/
Donatello.attrDefaults = function( a ) {
	a = a || {};
	// have to strictly check for undefined to avoid case where width = 0
	if( a['stroke-width'] === undefined ) a['stroke-width'] = 1;
	if( !a['stroke'] ) a['stroke'] = 'black';
	if( !a['fill'] ) a['fill'] = 'transparent';
	if( !a['stroke-style'] ) a['stroke-style'] = 'solid';
	return a;
};

