function Donatello( id, x, y, w, h ) {
	if( typeof id == 'string' ) {
	var el = document.getElementById( id );
	el.style.position = 'relative';
	el.style.top = x + 'px';
	el.style.left = y + 'px';
	el.style.width = w + 'px';
	el.style.height = h + 'px';
	
	this.dom = el;
	}
	else {
		this.dom = id;
	}

}

Donatello.prototype.circle = function( x, y, r ) {
	var el = document.createElement( 'div' );	
	el.style.position = 'absolute';
	el.style.top = y + 'px';
	el.style.left = x + 'px';
	el.style.width = 2*r + 'px';
	el.style.height = 2*r + 'px';
	el.style.borderRadius = r + 'px';
	el.style.border = '1px solid black';
	
	this.dom.appendChild( el );
}

Donatello.prototype.rect = function( x, y, dx, dy ) {
	var el = document.createElement( 'div' );	
	el.style.position = 'absolute';
	el.style.top = y + 'px';
	el.style.left = x + 'px';
	el.style.width = dx + 'px';
	el.style.height = dy + 'px';
	el.style.border = '1px solid black';
	
	this.dom.appendChild( el );
	return new Donatello( el );
}

Donatello.prototype.ellipse = function( x, y, r1, r2 ) {
	var el = document.createElement( 'div' );	
	el.style.position = 'absolute';
	el.style.top = y + 'px';
	el.style.left = x + 'px';
	el.style.width = r1 + 'px';
	el.style.height = r2 + 'px';
	el.style.borderRadius = r1 / 2  + 'px / ' + r2 / 2  + 'px';
	el.style.border = '1px solid black';
	
	this.dom.appendChild( el );
}

// like raphael, get underlying dom node
Donatello.prototype.node = function() {
	return this.dom;
}

// like raphael, set attributes 
Donatello.prototype.attr = function( obj ) {
	for( attr in obj ) {
		this.dom.style[attr] = obj[attr];
	}
	return this.dom;
}
// TODO: need cases for other orientations
Donatello.prototype.line = function( x, y, dx, dy ) {
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
	el.style.borderTop = '1px solid black';

	/*
			-webkit-transform:rotate(25deg);
			-moz-transform:rotate(25deg);
			-ms-transform:rotate(25deg);
			-o-transform:rotate(25deg);
	*/
	// find the angle
	var rot = Math.asin( dy / len );
	rot = rot * (180/Math.PI);
	el.style.MozTransform = 'rotate(' + rot + 'deg)';
	el.style.MozTransformOrigin = 'top left';
	this.dom.appendChild( el );
}
