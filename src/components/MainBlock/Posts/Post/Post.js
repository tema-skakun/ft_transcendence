import React, { useState } from 'react';

import imagePlaceholder from '../../../../assets/images/Placeholder.png';
import { ReactComponent as HeartIcon } from '../../../../assets/images/heart.svg';

import './Post.css';

export const Post = ({
	title,
	description,
	liked = false,
	image = imagePlaceholder
}) => {

	//may set like
	const [isLiked, setIsLiked] = useState(liked);

	const customFilling = isLiked ? 'crimson' : 'black';

	const like = () => setIsLiked(!isLiked);

	//hide a very long text
	const hideDescription = (
		<p>
			{
				description.length > 100 ? (
					<>
					{description.slice(0, 101)}...
					<a href="/">More details</a>
					</>
				) :description
			}
		</p>
	)

	return (
		<div className='post'>
			<img src={image} alt="post" />
			<h2>{title}</h2>
			{
				hideDescription
			}
			<button onClick={like} className='likeBtn'>
				<HeartIcon fill={customFilling}/>
			</button>
		</div>
	)
}

