import React from 'react';

export default React.createClass({
	render() {
		return (
			<div className={!this.props.loading ? 'chalk-loader hide' : 'chalk-loader'}>
				<div className="loader-container">
					<h2>{this.props.loadingText ? this.props.loadingText : 'Loading'}</h2>
					<span className="loader"></span> 
					<span className="loader"></span> 
					<span className="loader"></span> 
					<span className="loader"></span> 
					<span className="loader"></span> 
				</div>
			</div>
		);
	}
});