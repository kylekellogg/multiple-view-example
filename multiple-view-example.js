if ( Meteor.is_client ) {
	
	var callbacks = {
			'/':		function() {
				/**
				 * This is where you put page specific javascript.
				 * 
				 * It will be called after the page has been set,
				 * but could possibly be called before the page has been loaded.
				 * 
				 * Keep this in mind so that all handler assignments
				 * use .on() (if using jQuery) to find & attach to live elements.
				 */
			},
			'/one':		function() {
				/**
				 * Assign a default subpage.
				 * Could be chosen smartly based on location.
				 */
				Session.set( 'sub', '/foo' );
			},
			'/two':		function() {
				
			},
			'/three':	function() {
				
			}
		},
		noop = function(){};
	
	/**
	 * If a callback exists for the page, return it.
	 * Otherwise, return an empty function.
	 */
	function getCallback( data ) {
		return callbacks.hasOwnProperty( data ) ? callbacks[ data ] : noop;
	}
	
	/**
	 * Assign a default page.
	 * Could be chosen smartly based on location.
	 */
	Session.set( 'page', '/' );
	
	/**
	 * We must make use of Meteor's Handlebar extension
	 * so we assign this Block Helper to a default template.
	 */
	Template.body.page_is = function( data, options ) {
		/**
		 * This will test the currently set page against the
		 * data (string) passed in the template.
		 * 
		 * If they are the same, it will then schedule a callback
		 * to happen as soon as possible before returning the
		 * content of the block.
		 * 
		 * If they are not the same, it will return whatever is
		 * in the {{else}} block.
		 */
		if ( Session.equals( 'page', data ) ) {
			setTimeout( getCallback( data ), 0 );
			return options.fn( this );
		}
		return options.inverse( this );
	};
	
	/**
	 * To show that we can handle subpages as well,
	 * page one has it's own Block Helper.
	 */
	Template.one.sub_is = function( data, options ) {
		if ( Session.equals( 'sub', data ) ) {
			return options.fn( this );
		}
		return options.inverse( this );
	};
	
	/**
	 * Meteor equivalent of $(document).ready();
	 */
	Meteor.startup( function() {
		/**
		 * Override handling for links.
		 * 
		 * Do it this way to handle link elements dynamically added later on.
		 */
		$( document ).on( 'click', function( e ) {
			if ( e.target.nodeName === 'A' ) {
				var $this = $( e.target );
				
				/**
				 * Set either sub or page to be whatever the href is for
				 * this link based on whether or not it is a subnav item.
				 */
				if ( $this.hasClass( 'subnav' ) ) {
					Session.set( 'sub', $this.attr( 'href' ) );
				} else {
					Session.set( 'page', $this.attr( 'href' ) );
				}
				return false;
			}
		} );
		
	} );
	
}

/**
 * We don't use the server portion at all for this example.
 * Ignore it for now, but you'll see something very much like this
 * once you set up your own Meteor project.
 */
if ( Meteor.is_server ) {
	Meteor.startup( function() {
		return;
	} );
}