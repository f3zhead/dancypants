import { useState } from 'react';

const SearchForm = () => {
  const [searchTerm, setSearchTerm] = useState();
  const handleSubmit = (e) => {
    e.preventDefault();
    const searchValue = e.target.elements.search.value;
    if (!searchValue) return;
    setSearchTerm(searchValue);
  };
  return (
    <section>
        <h1>Dancypants</h1>
      <form className='search-form' onSubmit={handleSubmit}>
        <input
          type='text'
          className='form-input search-input'
          name='search'
          placeholder='Search'
        />
        <button type='submit' className='btn'>
          search
        </button>
      </form>
    </section>
  );
};
export default SearchForm;