# About

Donatello is a pure-CSS drawing library for the browser. The API
is inspired in part by Raphael.js. All graphical elements are rendered 
using HTML DOM and CSS. The idea came together from various code snippets
I had lying around for drawing circles and lines in other projects. I 
decided to make an attepmpt at a drawing API using these ideas after 
using Raphael.js in my Node Knockout team project.

### Goals

Donatello aims to provide a familiar drawing API similar to Raphael and other drawing
libraries. Since all rendering is done using HTML and CSS, and a lot
of effort is going toward optimizing CSS using graphics acceleration
in the major browsers, there is the opportunity to do very efficient
and performant drawing in the browser using this technique. In future
versions I hope to be able to leverage CSS animations and transitions 
for efficient hardware-accelerated animations.

### Non-goals

Donatello does not seek to replicate functionality found in other
common JS libraries, particularly drag and drop and animation 
faculties.

# Usage

The Donatello drawing surface is called a 'paper'. The only difference between a 
paper and any other drawing primitive is that the paper has no visible attributes.
However, since the paper is a DOM element and also a first-class Donatello object,
it is fully stylable if desired (e.g. putting a border around the drawing area or 
selecting a background color).

Converting a DOM element into a drawing surface for Donatello is done like this:

    var paper = Donatello.paper('paper-div', 20, 20, 500, 500 );

The div with ID 'paper-div' is converted into a drawing surface. Then we can draw an ellipse
at the center of the surface like this:

    var ellipse = paper.ellipse( 250, 250, 120, 75, { 
        'stroke-width': 4,
        'stroke': '#FFFFFF'
	});

The general form of the API is to pass the x/y coordinates and size along with an optional 
object containing attributes for stroke and fill. Attributes may be added or changed at
any time using the attr() method. For example, the ellipse in the previous example could
have been created, omitting the optional style attributes and styled using something like 
the following:

    ellipse.attr( { 'stroke-width': 4, 'stroke': '#FFFFFF' } );

A more complex example would be to arrange a series of ellipses in a geometric pattern:

    for( var i=0; i < 8; i ++ ) {
        var x = Math.cos( i*Math.PI/4 )*r;
        var y = Math.sin( i*Math.PI/4 )*r;
        var circle = paper.ellipse( 250 + x, 250 + y, 120, 75, { 
            'stroke-width': 4*i,
            'stroke': colors[i%8],
            'stroke-style': 'solid'
        });
        ellipse.rotate( (i*Math.PI/4)*180/Math.PI );
    }

Which produces the following:

![Ellipses geometric image](https://github.com/dnewcome/Donatello/raw/master/samples/ellipses.png)

Using a similar idea, we can arrange lines to mark the divisions on a clock face. 

    for( var i=0; i < 60; i ++ ) {
        var stroke;
        if( i%5 == 0 ) {
        stroke = 4;
        r1 = 125;
        }
            else {
            stroke = 2;
            r1 = 135;
        }
        var x1 = Math.cos( i*Math.PI/30 )*r1;
        var y1 = Math.sin( i*Math.PI/30 )*r1;
        var x2 = Math.cos( i*Math.PI/30 )*r2;
        var y2 = Math.sin( i*Math.PI/30 )*r2;
	...
    }

Once we have calculated the line endpoints, lengths and thicknesses mathematically we
use Donatello to easily plot the lines using the computed values offset against the 
center point of the drawing surface:

    var line = paper.line( 250+x1, 250+y1, x2-x1, y2-y1,
    { 
        'stroke-width': stroke,
        'stroke': colors[0],
        'stroke-style': 'solid'
    });

Firefox
supports CSS border gradients so the clock bezel is styled with a
gradient that currently dependent on Firefox. The result when rendered in Firefox
looks like this:

![Clock image](https://github.com/dnewcome/Donatello/raw/master/samples/clock.png)

As a test of the Donatello arc shape, there is a version of the arc clock from the Raphael.js
demos. Most browsers show some display artifacts (thin lines or lumps along the arc sections)
but hopefully the technique for drawing arcs can be refined.

![Arc clock image](https://github.com/dnewcome/Donatello/raw/master/samples/arc-clock.png)

Keep in mind that everything seen in the clock rendering is a simple DOM element. No canvas
or SVG is being used at all.

We can begin to draw more complex shapes using the primitives that are defined already in 
Donatello. I have created a quadratic bezier curve out of line segments. The following image
shows the result of using 30 discrete elements. The end points and control
points are shown in black, and the points on the polygon are shown in yellow and red. As 
you can see, in Firefox with antialiasing the curve looks nearly perfect 
even at this coarse element count. 

![Bezier curve geometric image](https://github.com/dnewcome/Donatello/raw/master/samples/bezier.png)

Donatello objects are just DOM elements underneath, so adding event handlers 
or drag/drop should be a cinch. For example, using jQuery we should be able to 
attach a click handler like so:

    $( ellipse.node() ).bind( 
        'click', function() { 
            alert( 'clicked!' ); 
        }
    );

# Limitations

Stroke widths currently cause the overall shape to
increase in size outwardly, rather than splitting the difference in line width like most SVG drawing tools. This could
lead to some surprising results if one were to directly port code from another library to Donatello.

Animations are not directly supported yet. jQuery animations will work on the underlying DOM elements but
may have unpredictable results if trying to animate values that require the drawing primitive to be
redrawn. Animation may be done directly by changing attributes via attr() however.

# Status

Donatello is super-experimental, designed to see how far CSS could be stretched to provide
general-purpose drawing functions in the browser. The API is in flux and capabilities may be added or 
removed. The API should eventually be very similar to SVG or Raphael.js, but I also don't
want to be too dogmatic about maintaining compatibility. Currently there are extensions in
rcompat.js that show how a compatibility layer might be created to allow Donatello to function
as a drop-in replacement for Raphael.js. 
I'm still thinking about making the interface more CSS-like instead of SVG-like. Comments are
welcome as to how to approach attribute naming (e.g. 'stroke', 'stroke-width', etc.).

# Future work

- regular polygons
- grouping, clipping
- bezier curves
- bounding box, click/touch area calculations
- paths
- gradients
- better jQuery support for animating calculated attributes

# License

Copyright 2011, Dan Newcome. Provided under the MIT license. See the file LICENSE for details.

# Adding new shapes

	/**
	* The constructor is responsible for setting defaults
	*	setting attributes and calling draw().
	*/
	Donatello.Shape = function( parent, x, y, w, h, a ) {

		a = Donatello.attrDefaults( a );

		// properties collection is essential for tracking
		// attributes outside of CSS values.
		this.properties = { 
			x: x, y: y, dx: dx, dy: dy,
			'stroke-width': w
		};

		var el = Donatello.createElement( x, y, w, h, 'div' );

		// use attribute map modifications to write attributes
		this.attrMap['stroke-width'] = 'borderTopWidth';

		this.dom = el;
		this.draw( a );
		parent.dom.appendChild( el );
		this.attr( a );

	};

	Donatello.Shape.prototype = new Donatello( null );

	/**
	* Every shape has a draw function. Any attribute
	*	change that requires a recalculation should be 
	*	handled here.
	*/
	Donatello.Shape.prototype.draw = function( a ) {
	};

	/**
	* Draw a shape.
	*
	* This is the convenience function used to automatically
	*	attach the new shape to its parent.
	*/
	Donatello.prototype.shape = function( x, y, dx, dy, a ) {
		return new Donatello.Shape( this, x, y, dx, dy, a );
	}
