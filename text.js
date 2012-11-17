/**
* Draw text to the scene using a <div> tag.
*/
Donatello.Text = function( parent, x, y, str, a ) {

    a = Donatello.attrDefaults( a );

    // properties collection is essential for tracking
    // attributes outside of CSS values.
    this.properties = { 
        x: x, y: y, str: str
    };

    var el = Donatello.createElement( x, y, null, null, 'div' );

    this.dom = el;
    this.draw();
	this._parent = parent;
    parent.dom.appendChild( el );
    this.attr( a );

};

Donatello.Text.prototype = new Donatello( null );

/**
* Every shape has a draw function. Any attribute
*   change that requires a recalculation should be 
*   handled here.
*/
Donatello.Text.prototype.draw = function() {
	this.dom.innerHTML = this.properties['str'];
	this.dom.style.top = this.properties['y'] + 'px';
	this.dom.style.left = this.properties['x'] + 'px';
};

/**
* Draw a shape.
*
* This is the convenience function used to automatically
*   attach the new shape to its parent.
*/
Donatello.prototype.text = function( x, y, str, a ) {
    return new Donatello.Text( this, x, y, str, a );
}
