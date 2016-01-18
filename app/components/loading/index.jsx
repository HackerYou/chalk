import React from 'react';

export default React.createClass({
	render() {
		return (
			<div className={!this.props.loading ? 'chalk-loader hide' : 'chalk-loader'}>
				<span className="loader"></span> 
				<span className="loader"></span> 
				<span className="loader"></span> 
				<span className="loader"></span> 
				<span className="loader"></span> 
			</div>
		);
	}
});