import React from 'react';

import { PostsHeader } from './PostsHeader/PostsHeader';
import postImage from '../../../assets/images/postImage.jpg';
import './Posts.css';
import { Post } from './Post/Post';

export const Posts = () => {
	return (
		<div className='postsWrapper'>
			<PostsHeader />
			<section className="posts">
				<Post
					title="Post 1"
					description="
						Lorem ipsum dolor sit amet qwerty uiop asdf ghjkl zxcv bnm
					"
					liked
				/>
				<Post
					title="Post 2"
					description="
						Lorem ipsum dolor sit amet qwerty uiop asdf ghjkl zxcv bnm
						Lorem ipsum dolor sit amet qwerty uiop asdf ghjkl zxcv bnm
						Lorem ipsum dolor sit amet qwerty uiop asdf ghjkl zxcv bnm
					"
					image={postImage}
				/>
				<Post
					title="Post 3"
					description="
						Lorem ipsum dolor sit amet qwerty uiop asdf ghjkl zxcv bnm
						Lorem ipsum dolor sit amet qwerty uiop asdf ghjkl zxcv bnm
						Lorem ipsum dolor sit amet qwerty uiop asdf ghjkl zxcv bnm
					"
					liked
				/>
				<Post
					title="Post 4"
					description="
						Lorem ipsum dolor sit amet qwerty uiop asdf ghjkl zxcv bnm
						Lorem ipsum dolor sit amet qwerty uiop asdf ghjkl zxcv bnm
						Lorem ipsum dolor sit amet qwerty uiop asdf ghjkl zxcv bnm
					"
					liked
					image={postImage}
				/>
				<Post
					title="Post 5"
					description="
						Lorem ipsum dolor sit amet qwerty uiop asdf ghjkl zxcv bnm
						Lorem ipsum dolor sit amet qwerty uiop asdf ghjkl zxcv bnm
						Lorem ipsum dolor sit amet qwerty uiop asdf ghjkl zxcv bnm
					"
					image={postImage}
				/>
				<Post
					title="Post 6"
					description="
						Lorem ipsum dolor sit amet qwerty uiop asdf ghjkl zxcv bnm
						Lorem ipsum dolor sit amet qwerty uiop asdf ghjkl zxcv bnm
						Lorem ipsum dolor sit amet qwerty uiop asdf ghjkl zxcv bnm
					"
					liked
					image={postImage}
				/>
			</section>
		</div>
	)
}

