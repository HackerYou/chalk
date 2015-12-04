import React from 'react';
import Exercise from '../exercise/index.jsx';
import Markdown from 'react-remarkable';


export default React.createClass({
	displayName: 'LessonTopic',
	render(){
		return (
			<div className="lessonTopic">
				<h3>{this.props.details.title}</h3>
				<Markdown>{(this.props.details.body)}</Markdown>
			</div>
		)
	}
});