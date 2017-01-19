import React from 'react';
import { Link , History} from 'react-router';

export default function(props) {
	const testRes = props.studentInfo.tests;
	const answers = props.studentInfo.test_results;
	
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
					<ul>
						{answers !== "" ? answers.map((test, i) => {
							const isCorrect = test.answers.filter((item) => {
								return item.correct === true
							})
							const passGrade = test.answers.length * 0.6; 
							if(isCorrect.length >= passGrade) {
								return <li key={i}>you passed</li>
							} else {
								return <li key={i}>you failed</li>
							}
						}) : null}
					</ul>
					
				</div>
			</article>
		</div>
	)
}