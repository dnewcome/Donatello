/**
 * Draw solid triangle fill
 * args: coordinates of vertices, attributes 
 */

/*
 * note: this code works for some limited cases of right triangles
 * need to add rectangle skew to make this applicable to all triangles
 */
Donatello.Tri = function( parent, x1, y1, x2, y2, x3, y3, a ) {
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
	var el = Donatello.createElement( x1, y1, 4, 4, 'div');
	
	parent.dom.appendChild( el );
	this._parent = parent;
	this.dom = el;
	// attr calls draw ...
	// this.attr( a );
	this.draw();
}
Donatello.Tri.prototype = new Donatello( null );

Donatello.prototype.tri = function( x1, y1, x2, y2, x3, y3, a ) {
	return new Donatello.Tri( this, x1, y1, x2, y2, x3, y3, a );
};

Donatello.Tri.prototype.draw = function() {
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

	var el = this.dom;
	el.style.transformOrigin = '0 0';
	el.style.left = x1 + 'px';
	el.style.top = y1 + 'px';

	// note: find lengths of all sides, then
	// use heron's formula to find area, then
	// find height.
	// todo: we should be able to do this without finding
	// the area 
	var dx1 = x1 - x2;
	var dy1 = y1 - y2;
	var len1 = Math.sqrt( dx1*dx1 + dy1*dy1 );

	var dx2 = x2 - x3;
	var dy2 = y2 - y3;
	var len2 = Math.sqrt( dx2*dx2 + dy2*dy2 );

	var dx3 = x3 - x1;
	var dy3 = y3 - y1;
	var len3 = Math.sqrt( dx3*dx3 + dy3*dy3 );

	var sp = ( len1 + len2 + len3 ) / 2;
 	var area = Math.sqrt( sp * (sp-len1) * (sp-len2) * (sp-len3) )

	var height = 2*area/len1
	var width = len1

	this.dom.style.width = width + 'px';
	this.dom.style.height = height + 'px';

	// find the rotation angle for dom container
	var rot = Math.asin( (y2 - y1) / len1 );
	rot = rot * (180/Math.PI);

	// correction angle for skew
	var rot2 = Math.asin( (x3 - x1) / len3 );
	console.log(x1 + " " + x3 );
	rot2 = rot2 * (180/Math.PI);

	// gradient rotation angle
	var grad = -(180/Math.PI)*Math.atan( width/height );

	console.log('rotation: ' + rot);
	console.log('rotation2: ' + rot2);

	this.dom.style[ Donatello.getTransform() ] = 
		'rotate(' + rot + 'deg) skew(' + (rot+rot2) + 'deg)';

	this.dom.style.backgroundImage = 
			 // '-moz-linear-gradient(-45deg, #77EDFF, #00ADFF ' + height + 'px, transparent ' + height + 'px)';
			 '-moz-linear-gradient(' + grad + 'deg, #77EDFF, #00ADFF 50%, transparent 50%)';
}
