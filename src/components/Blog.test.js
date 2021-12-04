import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import Blog from './Blog';

describe('<Blog />', () => {
  let component;
  const likeBlog = jest.fn();
  const blog = {
    id: '12345678987654321',
    title: 'Testing Title',
    author: 'Testing Author',
    likes: 0,
    user: {
      id: '123456787654321',
      name: 'Test User',
      username: 'Test Username',
    },
  };
  const user = {
    name: 'Test User',
    username: 'Test Username',
    toke: 'ahosgaougpaghpshahj',
  };
  beforeEach(() => {
    component = render(<Blog blog={blog} user={user} updateBlog={likeBlog} />);
  });

  test('at start the children are not displayed', () => {
    const div = component.container.querySelector('.detailsContent');
    expect(div).toHaveStyle('display: none');
  });

  test('after clicking the show button, details are displayed', () => {
    const button = component.getByText('show');
    fireEvent.click(button);

    const div = component.container.querySelector('.detailsContent');
    expect(div).not.toHaveStyle('display: none');

    const likes = component.container.querySelector('.likes');
    const url = component.container.querySelector('.url');
    expect(url).not.toBe(null);
    expect(likes).not.toBe(null);
  });

  test('after clicking the like button twice, ', () => {
    const button = component.getByText('show');
    fireEvent.click(button);

    const likeButton = component.getByText('like');
    fireEvent.click(likeButton);
    fireEvent.click(likeButton);

    expect(likeBlog.mock.calls).toHaveLength(2);
  });
});
