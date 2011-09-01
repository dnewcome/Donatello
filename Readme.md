# About

Donatello is a pure-CSS drawing library for the browser.

The idea is that since everything is just DOM+CSS, things like event handlers and drag/drop 
should work without any special techniques. 

h2 Goals

Provide a familiar drawing API similar to Raphael and other drawing
libraries.

h2 Non-goals

Donatello does not seek to replicate functionality found in other
common JS libraries, particularly drag and drop and animation 
faculties.

# Usage

Converting a DOM element into a drawing surface for a is done like this:

    var paper = Donatello.paper('paper-div', 20, 20, 500, 500 );
    paper.attr( { fill: 'black' } );

The div with ID 'paper-div' is converted into a drawing surface. Then we can draw an ellipse
on the surface like this:

    var ellipse = paper.ellipse( 250, 250, 120, 75, { 
        'stroke-width': 4,
        'stroke': '#FFFFFF'
	});

The general form of the API is to pass the x/y coordinates and size along with an object
containing attributes for stroke and fill.

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

Donatello objects are just DOM elements underneath, so adding event handlers and jQuery
animations or drag/drop should be a cinch. For example, using jQuery we should be able to 
attach a click handler like so:

    $( ellipse.node() ).bind( 
        'click', function() { 
            alert( 'clicked!' ); 
        }
    );

# Limitations

Donatello is intended to show what can be done natively using only CSS, and there are many inconsistencies that I'm 
still working out and/or don't know about.

There are some known subtle drawing bugs present that I haven't had the time to fix yet. Wide stroke widths cause errors
in lines where the angle of the line will not be correct given the dx/dy. Stroke widths cause the overall shape to
increase in size outwardly, rather than splitting the difference in line width like most SVG drawing tools. This could
lead to some surprising results if one were to directly port code from another library to Donatello.

Another big limitation is that trying to modify the stroke width after the shape has already been drawn will cause 
display bugs and inconsistencies. The reason for this is that the stroke width is used in the calculations for drawing
the DOM element and applying its CSS, so in order to change the stroke, the shape should be redrawn. Currently using 
.attr() does not trigger a redraw like it should.

# Status

Donatello is super-experimental, designed to see how far CSS could be stretched to provide
general-purpose drawing functions in the browser. The API is in flux and capabilities may be added or 
removed. I don't want to duplicate what can be done by other libraries like jQuery 
or using native browser functionality. The API should eventually be very similar to SVG or Raphael.js, but I also don't
want to be too dogmatic. I'm still thinking about making the interface more CSS-like instead of SVG-like.

# Future work

API support for setting properties after drawing
Regular polygon
grouping, clipping
Bezier curves
bounding box, click/touch area calculations
arcs, paths

# License

