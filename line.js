/**
* Line 
*
* Basic pattern is to create the dom element in the constructor
* and attach it to the given parent. This makes it easy to
* work with from within the convenience methods of the API.
*/
Donatello.Line = function( parent, x, y, dx, dy, a ) {
	a = Donatello.attrDefaults( a );
	var w = a['stroke-width']; 

	this.properties = { 
		x: x, y: y, dx: dx, dy: dy,
		'stroke-width': w
	};
	var c = a['stroke'];
	var f = a['fill'];
	var style = a['stroke-style'];

	var el = Donatello.createElement( x, y, 0, 0, 'div' );

	// use attribute map modifications to write attributes
	// to the object. This was previously hard coded
	this.attrMap['stroke-width'] = 'borderTopWidth';
	this.attrMap['stroke-style'] = 'borderTopStyle';
	this.attrMap['stroke'] = 'borderTopColor';

	this.dom = el;
	this.draw( a );


	// transform origin referenced from border width
	el.style[ Donatello.getTransform() + 'Origin' ] = '0px 0px';

	parent.dom.appendChild( el );

	this.attr( a );

};

Donatello.Line.prototype = new Donatello( null );

Donatello.Line.prototype.draw = function( a ) {
	var x = this.properties.x;
	var y = this.properties.y;
	var dx = this.properties.dx;
	var dy = this.properties.dy;
	var stroke = this.properties['stroke-width'];

	var len = Math.sqrt(dx*dx + dy*dy );

	// width is the line length	
	this.dom.style.width = len + 'px';

	// height is the line width
	this.dom.style.height = '0px';

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

	this.dom.style[ Donatello.getTransform() ] = 
		'rotate(' + rot + 'deg) translate(0px, -' + stroke/2 + 'px)';

	// set the stroke width here manually .. 
	// this would be covered by setting attributes, but since this 
	// requires another full application of all attributes, I'm just
	// calling it here.
	this.dom.style['borderTopWidth' ] = stroke + 'px'; 

	this.dom.style.left = x + 'px'; 
	this.dom.style.top = y + 'px'; 
};

/**
* Draw a straight line.
* dx/dy are offsets from start, w is stroke width
*
* TODO: add end caps - box-radius for rounded,
* borders for diagonal. also maybe linejoin
*/
Donatello.prototype.line = function( x, y, dx, dy, a ) {
	return new Donatello.Line( this, x, y, dx, dy, a );
}
