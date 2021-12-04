import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BlogForm from './BlogForm';

test('<BlogForm /> updates state and calls submit', () => {
  const createBlog = jest.fn();

  const component = render(<BlogForm createBlog={createBlog} />);

  const form = component.container.querySelector('form');
  const title = component.container.querySelector('#title');
  const author = component.container.querySelector('#author');
  const url = component.container.querySelector('#url');

  fireEvent.change(title, {
    target: { value: 'Title Test' },
  });
  fireEvent.change(author, {
    target: { value: 'Author Test' },
  });
  fireEvent.change(url, {
    target: { value: 'urltest.com' },
  });
  fireEvent.submit(form);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe('Title Test');
  expect(createBlog.mock.calls[0][0].author).toBe('Author Test');
  expect(createBlog.mock.calls[0][0].url).toBe('urltest.com');
});
