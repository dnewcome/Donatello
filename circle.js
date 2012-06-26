/**
 * Draw a circle
 * center coordinates, radius, attributes 
 */
Donatello.Circle = function( parent, x, y, r, a ) {
	a = Donatello.attrDefaults( a );

	var s = a['stroke-width'];
	var c = a['stroke'];
	var f = a['fill'];
	var style = a['stroke-style'];

	this.properties = { 
		x: x, y: y, r: r, 
		'stroke-width': s, 
		'stroke-style': style, 
		'stroke': c, 
		'fill': f
	};
	var el = Donatello.createElement( x-r-s, y-r-s, 2*r, 2*r, 'div');
	parent.dom.appendChild( el );
	this._parent = parent;
	this.dom = el;
	// attr calls draw ...
	this.attr( a );
}
Donatello.Circle.prototype = new Donatello( null );

Donatello.prototype.circle = function( x, y, r, a ) {
	return new Donatello.Circle( this, x, y, r, a );
};

Donatello.Circle.prototype.draw = function() {
	// TODO: some of this doesn't belong here
	// we don't have to recalculate when color changes
	var s = this.properties['stroke-width'];

	var x = this.properties.x;
	var y = this.properties.y;
	var r = this.properties.r;
	var c = this.properties.stroke;
	var f = this.properties.fill;
	var style = this.properties['stroke-style'];

	var el = this.dom;
	el.style.borderRadius = r + s + 'px';
	el.style.borderWidth = s  + 'px';

	el.style.borderStyle = style;
	el.style.bordercolor = c;
	el.style.backgroundColor = f;
	
	if( Donatello.CORRECT_FOR_STROKE ) {
		el.style.left = x-r-s/2 + 'px';
		el.style.top = y-r-s/2 + 'px';
		el.style.width = 2*r - s + 'px';
		el.style.height = 2*r - s + 'px';
	}
	else {
		el.style.left = x-r-s + 'px';
		el.style.top = y-r-s + 'px';
	}
}
