import React from 'react';
let ReactCSSTransitionGroup = require('react-addons-css-transition-group');

export default React.createClass({
	displayName: 'Modal',
	openModal(){
		this.setState({isModalOpen: true});
	},
	closeModal(){
		this.setState({isModalOpen: false});
	},
	render() {
		if(this.props.isOpen){
			return (
				<ReactCSSTransitionGroup transitionName={this.props.transitionName} transitionEnterTimeout={200} transitionLeaveTimeout={200}>
					<div className="modal">
						<div className="modalBody card">
							{this.props.children}
						</div>
					</div>
				</ReactCSSTransitionGroup>
				)
		} else {
			return <ReactCSSTransitionGroup transitionName={this.props.transitionName} transitionEnterTimeout={200} transitionLeaveTimeout={200} />;
		}
	}
});