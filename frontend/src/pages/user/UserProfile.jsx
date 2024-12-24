import React, { useState } from 'react';
import './UserProfile.css';
import { useParams } from 'react-router-dom';
import avatar from '../../assets/default-avatar.jpg';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from 'jwt-decode';
import { useSelector } from 'react-redux';

const UserProfile = () => {
  const { id } = useParams();
  console.log('profileId');

  console.log(id);

  const { value, rememberMe } = useSelector((state) => state.user);
  console.log(value);
  console.log(rememberMe);
  var userId;
  if (value === true) {
    //TAKE ID OF THE CURRENT LOGGED IN USER IF POSSIBLE
    if (rememberMe) {
      userId = jwtDecode(localStorage.getItem('token')).id;
    } else userId = jwtDecode(sessionStorage.getItem('token')).id;
  }
  const mockData = {
    name: 'test1',
    email: 'test2@gmail.com',
    tel: '0123456789',
  };

  const mockBlog = [
    {
      id: '1',
      content: 'some random content',
      imageUrl: ['url1', 'url2', 'url3'],
    },
    {
      id: '2',
      content: 'some random content2',
      imageUrl: ['url1', 'url2', 'url3'],
    },
    {
      id: '3',
      content: 'some random content4',
      imageUrl: ['url1', 'url2', 'url3'],
    },
  ];

  const [isUser, setIsUser] = useState();
  const [isEditing, setEditing] = useState(false);
  const [userInfo, setUserInfo] = useState(mockData);
  const [blogList, setBlogList] = useState(mockBlog);
  const handleSubmit = async (e) => {
    console.log(e);
  };

  return (
    <div className="container">
      <div className="content">
        {/* Sidebar Section */}
        <aside className="sidebar">
          <img
            className="avatar"
            src={userInfo.avatarUrl ? userInfo.avatarUrl : avatar}
          ></img>
          <div className="user-info">
            <form>
              <div>
                {userId && userId == id ? (
                  <a className="edit-profile" onClick={() => setEditing(true)}>
                    Change your profile <i class="fas fa-edit"></i>
                  </a>
                ) : (
                  <>
                    <a
                      className="edit-profile"
                      onClick={() => setEditing(true)}
                    >
                      Change your profile <i class="fas fa-edit"></i>
                    </a>
                  </>
                )}

                <label>ユーザ名</label>
                <input
                  type="text"
                  value={userInfo.name}
                  disabled={!isEditing}
                  onChange={(e) => {
                    setUserInfo({ ...userInfo, name: e.target.value });
                  }}
                />
              </div>
              <div>
                <label>メール</label>
                <input
                  type="email"
                  value={userInfo.email}
                  disabled={!isEditing}
                  onChange={(e) => {
                    setUserInfo({ ...userInfo, email: e.target.value });
                  }}
                />
              </div>
              <div>
                <label>携帯電話</label>
                <input
                  type="tel"
                  value={userInfo.tel}
                  disabled={!isEditing}
                  onChange={(e) => {
                    setUserInfo({ ...userInfo, tel: e.target.value });
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
                      <span className="author">ROAN</span>
                      <span className="likes">
                        <i class="fa-regular fa-heart pointer"></i> 100
                      </span>
                    </div>
                    <div className="post-time">12:57PM 26/10/2023</div>
                    <div className="post-content">
                      <div className="base-comment">
                        Hello this is a normal post
                      </div>
                      <div className="post-image">[Image Placeholder]</div>
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
