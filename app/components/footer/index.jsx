import React from 'react';

export default React.createClass({
	render() {
		return (
			<footer className="mainFooter card">
				<h3>HackerYou</h3>
				<ul>
					<li><a href='http://github.com/hackeryou'><i className="chalk-github"></i>github.com/hackeryou</a></li>
					<li><a href='http://hackeryou.com'><i className='chalk-link'></i>hackeryou.com</a></li>
					<li><a href='mailto:info@hackeryou.com'><i className='chalk-email'></i>info@hackeryou.com</a></li>
					<li><a href='http://twitter.com/hackeryou'><i className='chalk-twitter'></i>@hackeryou</a></li>
				</ul>
				<p><strong>Copyright 2015 HackerYou</strong><br /><small>The contents of this site are the property of HackerYou. No portion of this site is to be shared without permission.</small></p>
			</footer>
		)
	}
});