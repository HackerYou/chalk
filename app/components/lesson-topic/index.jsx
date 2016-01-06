import React from 'react';
import Exercise from '../exercise/index.jsx';
import Markdown from 'react-remarkable';
import hljs from 'highlight.js';


export default React.createClass({
	displayName: 'LessonTopic',

	render(){
		return (
			<div className="lessonTopic">
				<h2 className="lessonTitle">{this.props.details.title}</h2>
				<Markdown options={{'html':true}}>{(this.props.details.body)}</Markdown>
			</div>
		)
	}
});
