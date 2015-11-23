import React from 'react';
import { Link } from 'react-router';
import Topic from '../topic/index.jsx';

export default React.createClass({
	displayName: 'EditTopics',
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
				<Link className="linkBtn" to="topics"><button className="primary"><i className="chalk-home"></i>back to topics</button></Link>
				<form  className="card" action="">
					<label htmlFor="name">Topic Name</label>
					<input type="text" placeholder="Topic Name"/>
					<label htmlFor="category">Topic Category</label>
					<input type="text" placeholder="Topic Category"/>
					<label htmlFor="objective">Topic Objective</label>
					<input type="text" placeholder="Enter the key learning outcome associated with this topic"/>
					<button className="success">Save Topic</button>
					<button className="error">Cancel</button>
				</form>
				<div className="card">
					<textarea name="" id="" cols="160" rows="30"></textarea>
					<h3>Media</h3>
					<p>Drag and drop files here</p>
					<input type="file"/>
					<button className="success">Save Topic</button>
					<button className="error">Cancel</button>
				</div>

			</div>
		)
	}
});