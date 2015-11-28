import React from 'react';
import { Link, History } from 'react-router';
import AuthMixin from '../../services/authMixin.jsx';
import File from '../file/index.jsx';

export default React.createClass({
	mixins: [AuthMixin,History],
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
				<div className="container">
					<header className="topContent">
						<Link to="dashboard" className="linkBtn"><button className="primary"><i className="chalk-home"></i>back to dashboard</button></Link>
						<h1>Media</h1>
					</header>
				</div>
				<section className="full card detailsForm">
					<form action="">
						<label htmlFor="search" className="inline largeLabel">Search</label>
						<input type="search"/>
					</form>
				</section>
				<div className="container card mediaWrap">
					<ul className="mediaList">
						{this.state.media.map(this.renderFiles)}
					</ul>
				</div>
			</div>
		)
	}
});