/**
* Raphael compatibility layer 
*/

/**
 */
Donatello.prototype.drag = function( onmove, onstart, onend ) {
	$( this.node() ).draggable( {
		start: onstart,
		stop: onend,
		drag: onmove
	} );
};

Donatello.prototype.click = function( fn ) {
	$( this.dom ).click( fn );
}

Donatello.prototype.mousedown = function( fn ) {
	$( this.dom ).mousedown( fn );
}

Donatello.prototype.mouseup = function( fn ) {
	$( this.dom ).mouseup( fn );
}

Donatello.prototype.mousemove = function( fn ) {
	$( this.dom ).mousemove( fn );
}

Donatello.prototype.mouseout = function( fn ) {
	$( this.dom ).mouseout( fn );
}

Donatello.prototype.mouseover = function( fn ) {
	$( this.dom ).mouseover( fn );
}

Donatello.prototype.toFront = function() {
	// TODO: not a good way to do this in jQuery
}

Donatello.prototype.remove = function() {
	$( this.dom ).remove();
}

Donatello.prototype.clone = function() {
	var el = $( this.dom ).clone();
	var don = new Donatello( el );
	return don;
}

/**
* Override rect function to take border radius
*/
Donatello.prototype._rect = Donatello.prototype.rect; 
Donatello.prototype.rect = function( x, y, w, h, r, a ) {
	var a = a || {};
	a.borderRadius = r + 'px';
	return this._rect( x, y, w, h, a );
}

/**
 * Named plural to disambiguate from 
 * our attr() method, which sets attributes only.
 * Raphael api is singular, slight code change will
 * be necessary.
 *
 * Not a complete list, just enough to migrate some 
 * legacy code.
 */
Donatello.prototype.attrs = function() {
	var retval = {
		x: this.dom.offsetLeft,
		y: this.dom.offsetTop,
		w: this.dom.offsetWidth,
		h: this.dom.offsetHeight
	};
	return retval;
};
