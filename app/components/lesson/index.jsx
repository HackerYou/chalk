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
		let links, edit; 
		if (location.pathname == '/lesson'){
			links = <div><Link className="linkBtn" to="classroom"><button className="primary"><i className="chalk-home"></i>back to classroom</button></Link>
				<Link className="linkBtn" to="edit-lesson"><button className="success"><i className="chalk-edit"></i>edit lesson</button></Link></div>;
				
		} else{
			links = null;
		}

		if (location.pathname =='/edit-lesson'){
			edit = <div><h3><i className="chalk-add"></i>Add Content</h3></div>
		} else{
			edit = null;
		}


		return (
			<div>
				{links}
				<div>
					<h1>{this.state.lesson.title}</h1>
					<div>
						{(this.state.topic).map(this.renderTopics)}
					</div>
					{edit}
				</div>
				{links}
				
			</div>

		)
	}
});