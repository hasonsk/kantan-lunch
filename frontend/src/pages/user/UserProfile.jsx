import React, { useEffect, useState } from 'react';
import './UserProfile.css';
import { useNavigate, useParams } from 'react-router-dom';
import avatar from '../../assets/default-avatar.jpg';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from 'jwt-decode';
import { useSelector } from 'react-redux';
import { getUserById, updateProfile } from '../../api/user';
import { getAllPosts } from '../../api/post';
import UncontrolledExample from '../../components/carousel';
const UserProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const fetchBlog = async (id) => {
    return (data = await getAllPosts({
      limit: 100,
      id: id,
    }));
  };
  const fetchProfile = async (id) => {
    return (data = await getUserById(id).profile); //expected output to be {date_of_birth:,phone_number:,fullname:,avatar:,}
  };
  const { value, rememberMe } = useSelector((state) => state.user);
  var userId;
  if (value === true) {
    //TAKE ID OF THE CURRENT LOGGED IN USER IF POSSIBLE
    if (rememberMe) {
      userId = jwtDecode(localStorage.getItem('token')).id;
    } else userId = jwtDecode(sessionStorage.getItem('token')).id;
  }
  const mockData = {
    full_name: 'test1',
    date_of_birth: '',
    phone_number: '0123456789',
  };

  const mockBlog = [
    {
      _id: '1',
      like_count: 3,
      caption: 'some random content',
      media: [
        'https://images.unsplash.com/photo-1549396535-c11d5c55b9df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1549396535-c11d5c55b9df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1549396535-c11d5c55b9df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      ],
      user_id: '1',
    },
    {
      _id: '2',
      like_count: 3,
      caption: 'some random content',
      media: ['url1', 'url2', 'url3'],
      user_id: '1',
    },
    {
      _id: '4',
      like_count: 3,
      caption: 'some random content',
      media: ['url1'],
      user_id: '1',
    },
  ];

  const [isUser, setIsUser] = useState();
  const [isEditing, setEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [blogList, setBlogList] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    //setUserInfo(fetchProfile(id));
    //setBlogList(fetchBlog(id));
    setUserInfo(mockData);
    setBlogList(mockBlog);
  }, []);

  const likePost = async (e) => {};

  const handleSubmit = async (e) => {
    const avatarInput = document.getElementById('upload');
    const formData = new FormData();
    formData.append('full_name', userInfo.full_name);
    formData.append('date_of_birth', formData.date_of_birth);
    formData.append('phone_number', userInfo.phone_number);
    formData.append('avatar', avatarInput.files[0]);
    try {
      const check = await updateProfile(formData);
      if (check.status === 400) setError('Bad request');
      if (check.status === 401) setError('Unauthorized request');
      else if (check.status === 200) navigate(`/profile/${id}`);
      else throw new Error('Internal Error');
    } catch (e) {
      console.log(e);
    }
    console.log(e);
  };

  return (
    <div className="container">
      <div className="content">
        {/* Sidebar Section */}
        <aside className="sidebar">
          <div className="profile-picture-container">
            {userId && userId == id ? (
              <div className="edit-profile" onClick={() => setEditing(true)}>
                Change your profile <i class="fas fa-edit"></i>
              </div>
            ) : (
              <>
                <a className="edit-profile" onClick={() => setEditing(true)}>
                  Change your profile <i class="fas fa-edit"></i>
                </a>
              </>
            )}
            <img
              className="avatar"
              src={userInfo.avatar ? userInfo.avatar : avatar}
            ></img>
            {isEditing ? (
              <label>
                <div class="hover-text">
                  Edit Profile Picture
                  <input type="file" id="upload" style={{ display: 'none' }} />
                </div>
              </label>
            ) : (
              <></>
            )}
          </div>
          <div className="user-info">
            <form>
              <div>
                <label>ユーザ名</label>
                <input
                  type="text"
                  value={userInfo.full_name}
                  disabled={!isEditing}
                  onChange={(e) => {
                    setUserInfo({ ...userInfo, full_name: e.target.value });
                  }}
                />
              </div>
              <div>
                <label>生年月日</label>
                <input
                  type="date"
                  value={userInfo.date_of_birth}
                  disabled={!isEditing}
                  onChange={(e) => {
                    setUserInfo({ ...userInfo, date_of_birth: e.target.value });
                  }}
                />
              </div>
              <div>
                <label>携帯電話</label>
                <input
                  type="tel"
                  value={userInfo.phone_number}
                  disabled={!isEditing}
                  onChange={(e) => {
                    setUserInfo({ ...userInfo, phone_number: e.target.value });
                  }}
                />
              </div>
              {isEditing ? (
                <div>
                  <input
                    className="submit-button"
                    id="submitButton"
                    type="submit"
                    value="Update"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmit();
                    }}
                  />
                  <input
                    className="cancel-button"
                    id="cancelButton"
                    type="button"
                    value="Cancel"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditing(false);
                    }}
                  />
                </div>
              ) : (
                <></>
              )}
            </form>
          </div>
        </aside>

        {/* Main Section */}
        <main className="main">
          <h2>活動記録</h2>
          {blogList ? (
            <>
              {mockBlog.map((blog, index) => (
                <>
                  <div className="post">
                    <div className="post-header">
                      <span
                        className="author"
                        onClick={() => {
                          navigate(`/profile/${blog.user_id}`);
                        }}
                      >
                        ROAN
                      </span>
                      <span className="likes">
                        <i class="fa-regular fa-heart pointer"></i>{' '}
                        {blog.like_count}
                      </span>
                    </div>
                    <div className="post-time">12:57PM 26/10/2023</div>
                    <div className="post-content">
                      <div className="base-comment">{blog.caption}</div>
                      <div className="post-images">
                        {console.log(blog.media.length >= 2)}
                        {blog.media.length >= 2 ? (
                          <UncontrolledExample media={blog.media} />
                        ) : (
                          <img
                            className="d-block w-100"
                            src="https://miro.medium.com/v2/resize:fit:600/1*YM9c6zMefXW8lHGX_yIy1A.png"
                            alt="First slide"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </>
          ) : (
            <div>No blog to be shown</div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserProfile;
