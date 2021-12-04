import React, { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import './index.css';
import blogs from './services/blogs';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const blogFormRef = useRef();

  const handleCreateBlog = async (newBlog) => {
    try {
      const response = await blogService.create(newBlog);
      updateSuccessMessage(
        `A new blog '${response.title}' by '${response.author}'`
      );
      blogFormRef.current.toggleVisibility();
      setBlogs(blogs.concat(response));
    } catch (error) {
      console.log(error);
      updateErrorMessage('failed to create blog');
    }
  };

  const handleUpdateBlog = async (id, updatedBlog) => {
    try {
      const response = await blogService.update(id, updatedBlog);
      updateSuccessMessage(`Liked the '${response.title}' blog`);
      setBlogs(
        blogs.map((blog) =>
          blog.id !== id ? blog : { ...blog, likes: blog.likes + 1 }
        )
      );
    } catch (error) {
      console.log(error);
      setErrorMessage('failed to update blog');
    }
  };

  const handleRemoveBlog = async (id) => {
    try {
      await blogService.remove(id);
      setBlogs(blogs.filter((blog) => blog.id !== id));
      updateSuccessMessage(`Blog was deleted'`);
    } catch (error) {
      console.log(error);
      setErrorMessage('Failed to remove blog');
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log('logging in with', username, password);
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      updateErrorMessage('Wrong credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser');
    setUser(null);
  };
  const updateErrorMessage = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };
  const updateSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      blogs.sort((a, b) => {
        return b.likes - a.likes;
      });
      setBlogs(blogs);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const loginForm = () => {
    return (
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type='text'
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type='password'
            value={password}
            name='Password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    );
  };
  const blogsData = () => {
    return (
      <div>
        <h2>blogs</h2>
        <p>
          {user.name} logged in <button onClick={handleLogout}>logout</button>
        </p>
        <Togglable buttonLabel='create Blog' ref={blogFormRef}>
          <BlogForm createBlog={handleCreateBlog} />
        </Togglable>

        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            updateBlog={handleUpdateBlog}
            removeBlog={handleRemoveBlog}
            user={user}
          />
        ))}
      </div>
    );
  };
  return (
    <div>
      {errorMessage && <p className={'error'}>{errorMessage}</p>}
      {successMessage && <p className={'success'}>{successMessage}</p>}
      {user === null ? loginForm() : blogsData()}
    </div>
  );
};

export default App;
