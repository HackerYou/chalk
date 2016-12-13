import React from 'react';

export default function(props) {

	let showSelect = (
		<button className="primary" onClick={(e) => props.selectCard()}>Select</button>
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
				{props.path === classLink ? showSelect : showRemove}
			</ul>
			<div className="questionCard--attr">
				<p>{props.question.body}</p>
			</div>
		</div>
	)
}
