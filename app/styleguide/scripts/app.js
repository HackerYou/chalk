$(function() {
	$('.title pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });

	


	// hljs.initHighlightingOnLoad();
	$('aside.sg').stick_in_parent();
	$(function() {
	  $('a[href*=#]:not([href=#])').click(function() {
	    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
	      var target = $(this.hash);
	      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	      if (target.length) {
	        $('html,body').animate({
	          scrollTop: target.offset().top
	        }, 500);
	        return false;
	      }
	    }
	  });
	});
});