import React from 'react';
import { Link } from 'react-router';
import Topic from '../topic/index.jsx';

export default React.createClass({
	displayName: 'Lesson',
	getInitialState(){
		return {
			lesson: {},
			topic: []
		}
	},
	componentDidMount(){
		let data = require('../sample-data.js');
		this.setState({
			lesson: data.lesson,
			topic: data.lesson.topic
		});
	},
	renderTopics(key, index){
		return <Topic key={index} index={index} details={this.state.lesson.topic[index]} />
	},
	render() {
		return (
			<div>
				<h1>{this.state.lesson.title}</h1>
				<div>
					{(this.state.topic).map(this.renderTopics)}
				</div>
				<button className="primary"><i className="chalk-home"></i>back to classroom</button>
				<button className="success"><i className="chalk-edit"></i>edit lesson</button>
			</div>

		)
	}
});