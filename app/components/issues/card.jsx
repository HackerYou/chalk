import React from 'react';
import {Link} from 'react-router';
import moment from 'moment';

export default function IssueCard(props) {
	return (
		<div className="classCard">
			<article className="card">
				<h3>{props.issue.title}</h3>
				<p>{moment(props.issue.created_at).format('MMM D, YYYY')}</p>
				<p>{props.issue.body}</p>
				<Link className="button primary" to={`/topic/${props.issue.topic_id}/edit`}>Edit topic</Link>
				<button className="button error">Delete</button>
			</article>
		</div>
	)
}