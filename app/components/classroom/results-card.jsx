import React from 'react';
import { Link , History} from 'react-router';

export default function(props) {
	const testRes = props.studentInfo.tests;
	const answers = [];
	for(let key in props.studentInfo.test_results) {
		answers.push(props.studentInfo.test_results[key]);
	}
	const courseTestIds = props.course.tests.map((test) => test._id);
	let counter = 0;
	return (
		<div className="classCard">
			<article className="card">
				<h3 className="studentName">{props.studentInfo.firstName} {props.studentInfo.lastName}</h3>
				<div className="progressCard">
					<ul className="testProgress testProgress__circles">
						{answers !== "" && answers.map((test, i) => {
							const isCorrect = test.answers.filter((item) => {
								return item.correct === true || item.correct.numFailedTestSuites === 0
							})
							const passGrade = test.answers.length * 0.6;
							i = i + 1;
							return <li className={isCorrect.length >= passGrade ? "testProgress__circles--pass" : "testProgress__circles--fail"} key={`result-${i}`}>{i}</li>
						})}
					</ul>
					<ul>
						{props.studentInfo.tests.map((test, i) => {
							return <li key={`resulttitle-${i}`}>{test.title}</li>
						})}
					</ul>
				</div>
			</article>
		</div>
	)
}
