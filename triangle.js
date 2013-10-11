/**
 * Draw a triangle 
 * center coordinates, radius, attributes 
 */
Donatello.Triangle = function( parent, x1, y1, x2, y2, x3, y3, a ) {
	a = Donatello.attrDefaults( a );

	var s = a['stroke-width'];
	var c = a['stroke'];
	var f = a['fill'];
	var style = a['stroke-style'];

	this.properties = { 
		x1: x1, y1: y1, x2: x2, y2: y2, x3: x3, y3: y3,
		'stroke-width': s, 
		'stroke-style': style, 
		'stroke': c, 
		'fill': f
	};

	// this element will be the fill.. 
	var el = Donatello.createElement( x1, y1, 14, 4, 'div');
	
	parent.dom.appendChild( el );
	this._parent = parent;
	this.dom = el;

	// attr calls draw ...
	//this.attr( a );
	// call draw directly since we don't want default attributes
	// to be applied to this.dom
	this.draw()
}
Donatello.Triangle.prototype = new Donatello( null );

Donatello.prototype.triangle = function( x1, y1, x2, y2, x3, y3, a ) {
	return new Donatello.Triangle( this, x1, y1, x2, y2, x3, y3, a );
};

Donatello.Triangle.prototype.draw = function() {
	var s = this.properties['stroke-width'];
	var x1 = this.properties.x1;
	var y1 = this.properties.y1;
	var x2 = this.properties.x2;
	var y2 = this.properties.y2;
	var x3 = this.properties.x3;
	var y3 = this.properties.y3;
	var c = this.properties.stroke;
	var f = this.properties.fill;
	var style = this.properties['stroke-style'];

	// stroke
	this._parent.line(x1, y1, x2-x1, y2-y1, this.properties);	
	this._parent.line(x2, y2, x3-x2, y3-y2, this.properties);	
	this._parent.line(x3, y3, x1-x3, y1-y3, this.properties);	

	// fill
	this._parent.tri( x1, y1, x2, y2, x3, y3, this.properties );
}
