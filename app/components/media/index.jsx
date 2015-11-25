import React from 'react';
import { Link } from 'react-router';
import File from '../file/index.jsx';

export default React.createClass({
	displayName: 'media',
	getInitialState(){
		return {
			media: []
		}
	},
	componentWillMount(){
		let data = require('../sample-data.js');
		this.setState({
			media: data.media
		});
	},
	renderFiles(key, index){
		return <File key={index} details={this.state.media[index]} />
	},
	render() {
		return (
			<div>
				<Link to="dashboard" className="linkBtn"><button className="primary"><i className="chalk-home"></i>back to dashboard</button></Link>
				<h1>Media</h1>
				<form action="" className="card">
					<h3>Search</h3>
					<input type="search"/>
				</form>
				<ul className="card">
					{this.state.media.map(this.renderFiles)}
				</ul>
			</div>
		)
	}
});