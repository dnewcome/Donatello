/**
 * Ellipse is similar to circle, should consolidate.
 *
 * xy position, xy radius, stroke width
 */
Donatello.Ellipse = function( parent, x, y, rx, ry, a ) {
	a = Donatello.attrDefaults( a );
	var s = a['stroke-width'];
	var c = a['stroke'];
	var f = a['fill'];
	var style = a['stroke-style'];

	this.properties = { 
		x: x, y: y, rx: rx, ry: ry,
		'stroke-width': s, 
		'stroke-style': style, 
		'stroke': c, 
		'fill': f
	};
	var el = Donatello.createElement( x-rx-s, y-ry-s, 2*rx, 2*ry, 'div');
	parent.dom.appendChild( el );
	this.dom = el;
	// attr calls draw ...
	this.attr( a );
}
Donatello.Ellipse.prototype = new Donatello( null );

Donatello.prototype.ellipse = function( x, y, rx, ry, a ) {
	return new Donatello.Ellipse( this, x, y, rx, ry, a );
};

Donatello.Ellipse.prototype.draw = function() {
	// TODO: some of this doesn't belong here
	// we don't have to recalculate when color changes
	var x = this.properties.x;
	var y = this.properties.y;

	var r = this.properties.r;
	var rx = this.properties.rx;
	var ry = this.properties.ry;
	var s = this.properties['stroke-width'];
	var c = this.properties.stroke;
	var f = this.properties.fill;
	var style = this.properties['stroke-style'];

	var el = this.dom;
	el.style.borderRadius = ( rx + s ) + 'px / ' + ( ry + s ) + 'px';
	el.style.borderWidth = s  + 'px';

	el.style.borderStyle = style;
	el.style.borderColor = c;
	el.style.backgroundColor = f;

	el.style.left = x-rx-s + 'px';
	el.style.top = y-ry-s + 'px';
}
