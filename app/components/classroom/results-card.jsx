import React from 'react';
import { Link , History} from 'react-router';

export default function(props) {
	const testRes = props.studentInfo.tests;
	return (
		<div className="classCard">
			<article className="card">
				<h3>{props.studentInfo.firstName} {props.studentInfo.lastName}</h3>
				<div className="progressCard">
					<ul className="testProgress testProgress__circles">
						{props.studentInfo.tests.map((test, i) => {
							i = i + 1;
							return <li className="fillCircle" key={i}>{i}</li>
						})}
					</ul>
					<ul>
						{props.studentInfo.tests.map((test, i) => {
							return <li key={i}>{test.title}</li>
						})}
					</ul>
					
				</div>
			</article>
		</div>
	)
}