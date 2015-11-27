import React from 'react';
import { Link , History } from 'react-router';
import Topic from '../topic/index.jsx';
import AuthMixin from '../../services/authMixin.jsx';


export default React.createClass({
	displayName: 'Topics',
	mixins: [AuthMixin, History],
	getInitialState(){
		return {
			topics: [] 
		}
	}, 
	componentWillMount(){
		let data = require('../sample-data.js');
		this.setState({
			topics: data.lesson.topic
		});
	},
	renderTopics(key, index){
		return <Topic key={index} index={index} details={this.state.topics[index]} />
	},
	render() {
		console.log(this.state);
		return (
			<div>
				<div className="container">
					<header className="topContent">
					<Link className="linkBtn" to="dashboard"><button className="primary"><i className="chalk-home"></i>back to dashboard</button></Link>
					</header>
					<h1>Manage Topics</h1>
					<header className="topContent">
					<Link className="linkBtn" to="/topic/new"><button className="success"><i className="chalk-edit"></i>Create New Topic</button></Link>
					</header>
				</div>
				<section className="full card detailsForm">
				<form action="">
					<label htmlFor="search">Search</label>
					<input type="search" placeholder="Search for a topic"/>
					<label htmlFor="category">Category</label>
					<select name="category" id="category">
						<option value="html">HTML</option>
						<option value="css">CSS</option>
						<option value="javascript">JavaScript</option>
					</select>
				</form>
				</section>
				<div>
				{(this.state.topics).map(this.renderTopics)}
				</div>
			</div>
		)
	}
});