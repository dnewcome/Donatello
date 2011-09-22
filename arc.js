/**
 * Draw an arc 
 *
 * r,t1,t2 - radius, theta1, theta2
 */
Donatello.Arc = function( parent, x, y, r, t1, t2, a ) {
	a = Donatello.attrDefaults( a );

	var s = a['stroke-width'];
	var c = a['stroke'];
	var f = a['fill'];
	var style = a['stroke-style'];

	this.properties = { 
		x: x, y: y, r: r, t1: t1, t2: t2, 
		'stroke-width': s, 
		'stroke-style': style, 
		'stroke': c, 
		'fill': f
	};

	var deg = t2;
	// four circles and a clipping region
	var clip = Donatello.createElement( x-2*r, y-2*r, 2*r, 2*r, 'div');

	// make clipping visible for debugging and to better understand
	// the technique
	// clip.style.border = '1px solid orange';

	var c1 = Donatello.createElement( r-s, r-s, 2*r, 2*r, 'div');
	var c2 = Donatello.createElement( r-s, r-s, 2*r, 2*r, 'div');
	var c3 = Donatello.createElement( r-s, r-s, 2*r, 2*r, 'div');
	var c4 = Donatello.createElement( r-s, r-s, 2*r, 2*r, 'div');
	clip.appendChild( c1 );
	clip.appendChild( c2 );
	clip.appendChild( c3 );
	clip.appendChild( c4 );

	this.styleableElements = [ c1, c2, c3, c4 ];

	clip.style[ Donatello.transform + 'Origin' ]= '100% 100%';

	parent.dom.appendChild( clip );
	this.dom = clip;
	// attr calls draw ...
	// this.attr( a );
	this.draw( t2 );
}
Donatello.Arc.prototype = new Donatello( null );

Donatello.prototype.arc = function( x, y, r, t1, t2, a ) {
	return new Donatello.Arc( this, x, y, r, t1, t2, a );
};

Donatello.Arc.prototype.draw = function( t2 ) {
	var angle = t2;
	var t1 = this.properties.t1;
	// order of skew/rotation important
	if( angle < 90 ) {
		this.dom.style.overflow = 'hidden';
		this.dom.style[ Donatello.transform ] = 
			// offset rotation by 180deg to conform to svg angle conventions
			'rotate(' + (180+t1) + 'deg)' + 
			'skew(' + (90-angle) +'deg)';
	}
	else {
		this.dom.style.overflow = 'visible';
		this.dom.style[ Donatello.transform ] = 
			// offset rotation by 180deg to conform to svg angle conventions
			'rotate(' + (180+t1) + 'deg)' +
			// reset skew
			'skew(0deg)';
	}

	// TODO: some of this doesn't belong here
	// we don't have to recalculate when color changes
	var r = this.properties.r;
	var s = this.properties['stroke-width'];
	var c = this.properties.stroke;
	var f = this.properties.fill;
	var style = this.properties['stroke-style'];

	function setprops( el, ang ) {
		el.style.borderRadius = r + s + 'px';
		el.style.borderWidth = s  + 'px';

		el.style.borderStyle = style;
		el.style.borderColor = c;
		el.style.borderBottomColor = 'transparent';
		el.style.borderLeftColor = 'transparent';
		el.style.borderRightColor = 'transparent';
		el.style.backgroundColor = f;
		if( angle < 90 ) {
			// order of skew/rotation is important
			el.style[ Donatello.transform ]= 'skew(' + -(90-angle) + 'deg)rotate(' + (ang-45) +'deg)';
		}
		else {
			el.style[ Donatello.transform ]= 'rotate(' + (ang-45) +'deg)';
		}
	}
	for( var i=0; i < 4; i++ ) {
		setprops( this.dom.children[i], (angle-90)*i/3 );
	}
}
