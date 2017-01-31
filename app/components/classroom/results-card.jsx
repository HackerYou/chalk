import React from 'react';
import { Link , History} from 'react-router';

export default function(props) {
	const testRes = props.studentInfo.tests;
	const answers = props.studentInfo.test_results;
	const courseTestIds = props.course.tests.map((test) => test._id);
	let counter = 0;
	return (
		<div className="classCard">
			<article className="card">
				<h3>{props.studentInfo.firstName} {props.studentInfo.lastName}</h3>
				<div className="progressCard">
					<ul className="testProgress testProgress__circles">
							{answers.map((test, i) => {
								if(courseTestIds.includes(test.id)) {
									counter++;
									//only show results for test that are on this course 
									const isCorrect = test.answers.filter((item) => {
										return item.correct === true
									});
									const passGrade = test.answers.length * 0.6;
									return <li className={isCorrect.length >= passGrade ? "testProgress__circles--pass" : "testProgress__circles--fail"} key={`testcard-${i}`}>{counter}</li>
								}

							})}
					</ul>
					<ul>
						{props.studentInfo.tests.map((test, i) => {
							if(courseTestIds.includes(test._id)) {
								return <li key={`testtitle-${i}`}>{test.title}</li>
							}
						})}
					</ul>
				</div>
			</article>
		</div>
	)
}
