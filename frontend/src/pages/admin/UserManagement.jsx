import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './UserManagement.css';
import postData from "./reviewData.jsx"
import {getAllPosts} from '../../api/post';
import { FaEye, FaLock, FaLockOpen } from 'react-icons/fa';
import AdminSearchbar from "../../components/commons/admin/AdminSearchbar.jsx";

const UserManagement = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const data = await getAllPosts();
            console.log(data);
            setPosts(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const [lockedUsers, setLockedUsers] = useState({});

    const toggleLock = (id) => {
        setLockedUsers((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleDetailsClick = (postId) => {
        navigate(`/admin/post/${postId}`);
    };

    // const filteredPosts = postData.filter((post) =>
    //     post.name.toLowerCase().includes(searchQuery.toLowerCase())
    // );

    return (
        <div className="header-wrapper">
            <AdminSearchbar
                section="ユーザー"
                callback={setSearchQuery}
                searchQuery={searchQuery}
            />
            <div className="main-content">
                {postData.length > 0 ? (
                    <div className="item-table">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                            <tr>
                                <th style={{...styles.th, width: '34%'}}>ユーザー</th>
                                <th style={{...styles.th, width: '34%'}}>メール</th>
                                <th style={{...styles.th, width: '16%'}}>詳細を見る</th>
                                <th style={{...styles.th, width: '16%'}}>アカウントのステータス</th>
                            </tr>
                            </thead>
                            <tbody>
                            {postData.map((post) => (
                                <tr key={post.id} style={styles.tr}>
                                    <td style={styles.td}>{post.name}</td>
                                    <td style={styles.td}>{post.email}</td>
                                    <td style={styles.td}>
                                        <FaEye
                                            style={styles.icon}
                                            title="View Profile"
                                            onClick={() => handleDetailsClick(post.id)}
                                        />
                                    </td>
                                    <td style={styles.td}>
                                        {lockedUsers[post.id] ? (
                                            <FaLock
                                                style={{ ...styles.icon, color: 'red' }}
                                                title="Locked"
                                                onClick={() => toggleLock(post.id)}
                                            />
                                        ) : (
                                            <FaLockOpen
                                                style={{ ...styles.icon, color: 'green' }}
                                                title="Unlocked"
                                                onClick={() => toggleLock(post.id)}
                                            />
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="no-results">該当するレストランが見つかりませんでした。</p>
                )}
            </div>
        </div>
    );
};

const styles = {
    th: {
        fontWeight: 'normal',
        padding: '10px',
        textAlign: 'center',
        borderBottom: '1px solid #ddd',
    },
    td: {
        padding: '10px',
        borderBottom: '1px solid #ddd',
    },
    tr: {
        cursor: 'pointer',
    },
    icon: {
        cursor: 'pointer',
        fontSize: '18px',
    },
};

export default UserManagement;
