import React from 'react';

const BlogForm = ({
  handleSubmit,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
  title,
  author,
  url,
}) => {
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          title:
          <input
            type='text'
            value={title}
            name='title'
            onChange={handleTitleChange}
          />
        </div>
        <div>
          author:
          <input
            type='text'
            value={author}
            name='author'
            onChange={handleAuthorChange}
          />
        </div>
        <div>
          url:
          <input
            type='text'
            value={url}
            name='url'
            onChange={handleUrlChange}
          />
        </div>

        <button type='submit'>create</button>
      </form>
    </div>
  );
};

export default BlogForm;
