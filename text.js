/**
* Draw text to the scene using a <div> tag.
*/
Donatello.prototype.text = function( x, y, str, a ) {
	var el = Donatello.createElement( x, y, null, null, 'div');
	el.innerHTML = str;
	this.dom.appendChild( el );
	var don = new Donatello( el );
	don.attr( a );
	return don;
}
