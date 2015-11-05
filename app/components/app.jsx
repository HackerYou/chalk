import React from 'react';
import ReactDom from 'react-dom';
import { Router, Route, Link } from 'react-router';

import Dashboard from './dashboard/index.jsx';

let App = React.createClass({
	render() {
		return (
			<div>
				<header className="mainHeader">
					<ul>
						<li>
							<Link to="/">Home</Link>
						</li>
						<li>
							<Link to="dashboard">Dasboard Link</Link>
						</li>
					</ul>
				</header>
				<section>
					{this.props.children || <h1>HI</h1>}
				</section>
				<footer className="mainFooter">
					<p>Footer Stuff</p>
				</footer>
			</div>
		);
	}
});

ReactDom.render(
	(<Router>
		<Route path='/' component={App}>
			<Route path='/dashboard' component={Dashboard} />
		</Route>
	</Router>)
	, document.getElementById('app'));