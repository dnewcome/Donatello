Donatello.Image = function( parent, x, y, w, h, img, a ) {
    a = Donatello.attrDefaults( a );
    this.properties = { 
        x: x, y: y, w: w, h: h, img: img 
    };
    var el = Donatello.createElement( x, y, w, h, 'img' );
	el.src = img;

    this.dom = el;
	this._parent = parent;

    this.draw();
    parent.dom.appendChild( el );
    this.attr( a );
}
Donatello.Image.prototype = new Donatello( null );

Donatello.Image.prototype.draw = function() {}

/**
* Draw an image to the scene using an <img> tag.
*/
Donatello.prototype.image = function( x, y, w, h, img, a ) {
    return new Donatello.Image( this, x, y, w, h, img, a );
}
