import React from 'react';
import { Link , History} from 'react-router';

export default function(props) {
	const testRes = props.studentInfo.tests;
	const answers = props.studentInfo.test_results;
	console.log("answers", answers);
	
	return (
		<div className="classCard">
			<article className="card">
				<h3>{props.studentInfo.firstName} {props.studentInfo.lastName}</h3>
				<div className="progressCard">
					<ul className="testProgress testProgress__circles">
						{answers !== "" && answers.map((test, i) => {
							const isCorrect = test.answers.filter((item) => {
								return item.correct === true
							})
							const passGrade = test.answers.length * 0.6;
							i = i + 1;
							return <li className={isCorrect.length >= passGrade ? "testProgress__circles--pass" : "testProgress__circles--fail"} key={i}>{i}</li>
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