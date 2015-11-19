import React from 'react';
let ReactCSSTransitionGroup = require('react-addons-css-transition-group');

export default React.createClass({
	displayName: 'Modal',
	render() {
		if(this.props.isOpen){
			return (
				<ReactCSSTransitionGroup transitionName={this.props.transitionName} transitionEnterTimeout={200} transitionLeaveTimeout={200}>
					<div className="modal">
						{this.props.children}
					</div>
				</ReactCSSTransitionGroup>
				)
		} else {
			return <ReactCSSTransitionGroup transitionName={this.props.transitionName} transitionEnterTimeout={200} transitionLeaveTimeout={200} />;
		}
	}
});