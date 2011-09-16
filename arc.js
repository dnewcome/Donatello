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

	var deg = t2-t1;
	// four circles and a clipping region
	var clip = Donatello.createElement( x-r-s, y-r-s, 2*r, 2*r, 'div');
	// clip.style.border = 'solid 1px orange';
	var c1 = Donatello.createElement( x-r-s, y-r-s, 2*r, 2*r, 'div');
	var c2 = Donatello.createElement( x-r-s, y-r-s, 2*r, 2*r, 'div');
	var c3 = Donatello.createElement( x-r-s, y-r-s, 2*r, 2*r, 'div');
	var c4 = Donatello.createElement( x-r-s, y-r-s, 2*r, 2*r, 'div');
	clip.appendChild( c1 );
	clip.appendChild( c2 );
	clip.appendChild( c3 );
	clip.appendChild( c4 );

	clip.style[ Donatello.transform ]= 'skew(' + (90-deg) +'deg)';
	clip.style[ Donatello.transform + 'Origin' ]= '100% 100%';

	parent.dom.appendChild( clip );
	this.dom = clip;
	// attr calls draw ...
	// this.attr( a );
	this.draw( a );
}
Donatello.Arc.prototype = new Donatello( null );

Donatello.prototype.arc = function( x, y, r, t1, t2, a ) {
	return new Donatello.Arc( this, x, y, r, t1, t2, a );
};

Donatello.Arc.prototype.draw = function() {
	var angle = 290;
	if( angle < 90 ) {
		this.dom.style.overflow = 'hidden';
		this.dom.style[ Donatello.transform ]= 'skew(' + (90-angle) +'deg)';
	}
	else {
		this.dom.style.overflow = 'visible';
	}

	// TODO: some of this doesn't belong here
	// we don't have to recalculate when color changes
	var r = this.properties.r;
	console.log('drawing with radius ' + r );
	var s = this.properties['stroke-width'];
	var c = this.properties.stroke;
	var f = this.properties.fill;
	var style = this.properties['stroke-style'];

	function setprops( el, ang ) {
		console.log(angle);
		el.style.borderRadius = r + s + 'px';
		el.style.borderWidth = s  + 'px';

		el.style.borderStyle = style;
		el.style.borderColor = c;
		el.style.borderBottomColor = 'transparent';
		el.style.borderLeftColor = 'transparent';
		el.style.borderRightColor = 'transparent';
		el.style.backgroundColor = f;
		if( angle < 90 ) {
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
