import React from 'react';
import Exercise from '../exercise/index.jsx';

export default React.createClass({
	displayName: 'LessonTopic',
	renderExercises(key, index){
		return <Exercise key={index} index={index} details={this.props.details.exercises[index]} />
	},
	render(){
		return (
			<div>
				<h3>{this.props.details.title}</h3>
				<p>{this.props.details.body}</p>
				<a href="#">{(this.props.details.exercises).map(this.renderExercises)}</a>
			</div>
		)
	}
});