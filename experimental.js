/**
* Experimental extensions to Donatello. Includes attempt
* at arc and path. Path is a slight cheat since it uses 
* HTML canvas and is not purely CSS. It's possible that
* once we have richer primitives like bezier curves we'll
* be able to do this all in CSS.
*/


/**
* path creates an html canvas element
* and translates svg commands to canvas
* drawing commands.
*
* TODO: parameterize stroke width/style
* and save command array to redraw on changes
* currently path is drawn once and cannot be
* altered later.
*/
Donatello.prototype.path = function( x, y, w, h, path ) {
	var canvas = Donatello.createElement( x, y, w, h, 'canvas' );
	// set coordinate w/h in addition to element css
	canvas.width = w;
	canvas.height = h;

    var context = canvas.getContext("2d");
 
	var lastx = 0, lasty = 0;
    context.beginPath();
	for( var i=0; i < path.length; i++ ) {
		if( path[i][0] == "M" ) {
			context.moveTo( path[i][1], path[i][2] );
			lastx = path[i][1];
			lasty = path[i][2];
		}
		// note relative path commands haven't been tested
		else if( path[i][0] == "m" ) {
			context.moveTo( lastx + path[i][1], lasty + path[i][2] );
			lastx += path[i][1];
			lasty += path[i][2];
		}
		else if( path[i][0] == "L" ) {
			context.lineTo( path[i][1], path[i][2] );
			lastx = path[i][1];
			lasty = path[i][2];
		}
		// note relative path commands haven't been tested
		else if( path[i][0] == "l" ) {
			context.lineTo( lastx + path[i][1], lasty + path[i][2] );
			lastx += path[i][1];
			lasty += path[i][2];
		}
		else if( path[i][0] == "Q" ) {
			context.quadraticCurveTo( 
				path[i][1], path[i][2],path[i][3], path[i][4]  
			);
			lastx = path[i][3];
			lasty = path[i][4];
		}
		else if( path[i][0] == "C" ) {
			context.bezierCurveTo( 
				path[i][1], path[i][2],path[i][3], path[i][4], path[i][5], path[i][6] 
			);
			lastx = path[i][5];
			lasty = path[i][6];
		}
	}
	
    context.lineWidth = 5;
    context.strokeStyle = "#0000ff";
    context.stroke();

	this.dom.appendChild( canvas );
	return new Donatello( canvas );
}

/**
* Thinking about doing some simple layout containers
* Not sure if this is the domain of a drawing tool though
*/
function StackPanel( par, orientation ) {

}

StackPanel.prototype.add = function( item ) {
	item.attr( { float:'left',stroke:'blue',position:'relative' } );	
}

/** 
* create drawing graph declaratively
* par - parent Donatello object
* a - attribute object 
* Only works for rect at this stage.
*/
Donatello.decl = function( par, a ) {
	var don;
	if( a.type == 'rect' ) {
		don = par.rect( a.x, a.y, a.w, a.h, a );
	}
	for( var i=0; i < a.children.length; i++ ) {
		Donatello.decl( don, a.children[i] );	
	}
}

/**
* Internal function for creating the appropriate 
* radial gradient function
* TODO: this is incomplete - need to decide on what level of
* support to provide for radial gradients
*/
Donatello.createRadialGradient = function( deg, color1, color2 ) {
	var retval;
	switch( Donatello.getTransform() ) {
		case 'MozTransform':
			retval = '-moz-radial-gradient(' + deg + 'deg,' + 
				color1 + ', ' + color2 + ')';
			break;
		default:
			throw 'Gradients not implemented for ' + Donatello.getTransform();
	}
	console.log( 'gradient: ' + retval );
	return retval;
}

/**
* Animation - 
*
* Time given in seconds
* Easing is always in-out
*/
Donatello.prototype.animate = function( time, attrs ) {
	// TODO: only works in firefox right now
	var me = this;
	this.attr( {'MozTransition':'all ' + time + 's ease-in 0s'});
	// in order for the animation to work, we have to set
	// moz-transition first, then later in setTimout set the props
	setTimeout( function() { me.attr( attrs ) }, 0 );
	return this.dom;
}

/*
* Stop the current animation
*/
Donatello.prototype.stop = function( time, attrs ) {
	// TODO: this doesn't work how it should
	this.attr( {'MozTransition':''});
}


