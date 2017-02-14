import React from 'react';
import { Link , History} from 'react-router';

function correctAnswers(test) {
	return test.answers.filter((item) => {
		return item.correct === true || item.correct.numFailedTestSuites === 0
	});
}

export default function TestCard(props) {
	const testRes = props.studentInfo.tests;
	const answers = [];
	const correct = {};
	for(let key in props.studentInfo.test_results) {
		answers.push(props.studentInfo.test_results[key]);
	}
	return (
		<div className="classCard">
			<article className="card">
				<h3 className="studentName">{props.studentInfo.firstName} {props.studentInfo.lastName}</h3>
				<div className="progressCard">
					<ul className="testProgress testProgress__circles">
						{answers.map((test, i) => {
							const isCorrect = correctAnswers(test);
							correct[i] = isCorrect;
							const passGrade = test.answers.length * 0.6;
							return <li className={isCorrect.length >= passGrade ? "testProgress__circles--pass" : "testProgress__circles--fail"} key={`result-${i + 1}`}>{i + 1}</li>
						})}
					</ul>
					<ul>
						{props.studentInfo.tests.map((test, i) => {
							return <li key={`resulttitle-${i}`}>{test.title} {correct[i].length}/{test.questions.length}</li>
						})}
					</ul>
				</div>
			</article>
		</div>
	)
}
