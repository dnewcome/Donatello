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
}

Donatello.prototype.click = function() {}

/**
 * Named plural to disambiguate from 
 * our attr() method, which sets attributes only.
 * Raphael api is singular, slight code change will
 * be necessary.
 *
 * Not a complete list, just enough to migrate some 
 * legacy code.
 */
Donatello.prototype.attrs() {
	var retval = {
		x: this.dom.offsetLeft,
		y: this.dom.offsetTop,
		w: this.dom.offsetWidth,
		h: this.dom.offsetHeight
	};
	return retval;
}
