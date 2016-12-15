import React from 'react';

export default function(props) {

	let showSelect = (
		<div>
			<button className="success" onClick={(e) => props.selectCard(e, props.question)}>Select</button>
		</div>
	)
	let showRemove = (
		<button className="error" onClick={(e) => props.removeCard(e,props.question._id)}>Remove</button>
	)
	const classLink = `/classroom/${props.classId}/create-test`;

	return (
		<div className="inline card questionCard">
			<ul className="questionCard--attr">
				<li>{props.question.category}</li>
				<li>{props.question.difficulty}</li>
				<li>{props.question.type}</li>
				{props.showSelected === "true" ? showSelect : showRemove}
			</ul>
			<div className="questionCard--attr">
				<p>{props.question.body}</p>
			</div>
		</div>
	)
}
