import React from 'react';
import { Link , History} from 'react-router';

export default function(props) {
	console.log("lala", props.testTitle);
	return (
		<div className="classCard">
			<article className="card">
				<h3>{props.studentInfo.firstName} {props.studentInfo.lastName}</h3>
				<ul>
					{props.studentInfo.tests.map((test) => {
						return <li>{test.title}</li>
					})}
				</ul>
			</article>
		</div>
	)
}