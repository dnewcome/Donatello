/**
*  Draw a rectangular region to the scene.
*/
Donatello.prototype.rect = function( x, y, w, h, a ) {
	return this.pgram( x, y, w, h, null, a );
}

Donatello.Pgram = function( parent, x, y, dx, dy, skew, a ) {
	a = Donatello.attrDefaults( a );
	var el = Donatello.createElement( x, y, dx, dy, 'div');
	
	var s = a['stroke-width'];
	var c = a['stroke'];
	var f = a['fill'];
	var style = a['stroke-style'];

	this.properties = { 
		x: x, y: y, w: dx, h: dy, skew: skew, 
		'stroke-width': s, 
		'stroke-style': style, 
		'stroke': c, 
		'fill': f
	};
	parent.dom.appendChild( el );
	this._parent = parent;
	this.dom = el;
	this.attr( a );
}
Donatello.Pgram.prototype = new Donatello( null );

/**
 * generalized parallelogram, used by rect.
 */
Donatello.Pgram.prototype.draw = function() {
	var el = this.dom;
	var skew = this.properties.skew;
	el.style.borderWidth = this.properties['stroke-width'] + 'px';

	if( skew != null ) {
		console.log( 'setting skew ' + skew );
		el.style[ Donatello.getTransform() ] += 'skew(' + skew + 'deg)';
	}
	
	if( Donatello.CORRECT_FOR_STROKE ) {
		var strokeWidth = this.properties['stroke-width'];
		el.style.top = this.properties.y - strokeWidth/2 + 'px';
		el.style.left = this.properties.x - strokeWidth/2 + 'px';
		el.style.width = this.properties.w - strokeWidth + 'px';
		el.style.height = this.properties.h - strokeWidth + 'px';
	}	
	else {
		el.style.top = this.properties.y + 'px';
		el.style.left = this.properties.x + 'px';
		el.style.width = this.properties.w + 'px';
		el.style.height = this.properties.h + 'px';
	}
}

Donatello.prototype.pgram = function( x, y, dx, dy, skew, a ) {
	return new Donatello.Pgram( this, x, y, dx, dy, skew, a );
}
