import React from 'react'
import searchIcon from '../../../../../assets/images/search.svg';
import './SearchForm.css';

export const SearchForm = () => {
  return (
	<form className='searchForm'>
		<input type="text" placeholder='Search' />
		<img src={searchIcon} alt="search" />
	</form>
  )
}

