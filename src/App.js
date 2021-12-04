import React, { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import LoginForm from './components/LoginForm';
import Togglable from './components/Togglable';
import './index.css';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
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
      setErrorMessage('failed to update blog');
    }
  };

  const handleRemoveBlog = async (id) => {
    try {
      await blogService.remove(id);
      setBlogs(blogs.filter((blog) => blog.id !== id));
      updateSuccessMessage('Blog was deleted');
    } catch (error) {
      setErrorMessage('Failed to remove blog');
    }
  };

  const handleLogin = async (newLogin) => {
    try {
      const user = await loginService.login(newLogin);
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
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
    return <LoginForm login={handleLogin} />;
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

        <div className='blogs-list'>
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
