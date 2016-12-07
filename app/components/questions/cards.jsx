import React from 'react';
import { Link , History} from 'react-router';
import AuthMixin from '../../services/authMixin.jsx';
import userData from '../../services/user.jsx';
import questionData from '../../services/questions.jsx';

export default function(props) {
	return (
		<div className="inline card questionCard">
			<ul className="questionCard--attr">
				<li>{props.question.category}</li>
				<li>{props.question.difficulty}</li>
				<li>{props.question.type}</li>
				<button className="error" onClick={(e) => props.removeCard(e,props.question._id)}>Remove</button>
			</ul>
			<div className="questionCard--attr">
				<p>{props.question.body}</p>
			</div>
		</div>
	)
}
