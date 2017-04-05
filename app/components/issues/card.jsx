import React from 'react';
import {Link} from 'react-router';
import moment from 'moment';

export default function IssueCard(props) {
	return (
		<div className="classCard">
			<article className="issueCard card">
				<i className={props.issue.archived ? "fa fa-archive redLight" : "fa fa-archive "} onClick={() => props.archiveIssue(props.issue)}></i>
				<h3>{props.issue.title}</h3>
				<div className="created-info">
					<p className="created-by"><strong>Created at: {moment(props.issue.created_at).format('MMM D, YYYY')}</strong></p>
					<p className="created-by"><strong>By: {props.issue.created_by.firstName} {props.issue.created_by.lastName}</strong></p>
				</div>
					<p>{props.issue.body}</p>
				<Link className="button primary" to={`/topic/${props.issue.topic_id}/edit`}>Edit topic</Link>
				<button className="button error" onClick={() => props.removeIssue(props.issue._id)}>Delete</button>
			</article>
		</div>
	)
}