import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Button from '../../components/Button/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import mockUsers from '../../data/mockUsers';
import { useNavigate } from 'react-router-dom';
import './user.css';

const User = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setUsers(mockUsers);
    }, []);

    const filteredUsers = useMemo(() => {
        if (!searchTerm.trim()) return users;
        const search = searchTerm.toLowerCase();
        return users.filter(user =>
            user.name.toLowerCase().includes(search) ||
            user.email.toLowerCase().includes(search) ||
            user.role.toLowerCase().includes(search)
        );
    }, [searchTerm, users]);

    const handleEdit = (id) => {
        navigate(`/user/edit/${id}`);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers(prev => prev.filter(user => user.id !== id));
        }
    };

    return (
        <DashboardLayout>
            <div className="news-page">
                <div className="page-header">
                    <div className="product-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <h1 className="page-title">Users</h1>
                            <p className="page-subtitle">Manage all users and their roles</p>
                        </div>
                        <div className="product-actions" style={{ marginLeft: 'auto' }}>
                            <Button className="btn-add" onClick={() => navigate('/user/edit/new')} variant="primary">
                                <AddIcon />
                                Add User
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search by name, email, or role..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    {searchTerm && (
                        <Button
                            type="button"
                            className="clear-search"
                            onClick={() => {
                                setSearchTerm('');
                                setPage(1);
                            }}
                            aria-label="Clear search"
                            variant="secondary"
                        >
                            ×
                        </Button>
                    )}
                </div>
                <div className="user-table-wrapper">
                    <table className="user-table" style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
                        <thead>
                            <tr style={{ background: '#f5f5f5' }}>
                                <th style={{ padding: '12px 8px', textAlign: 'left' }}>#</th>
                                <th style={{ padding: '12px 8px', textAlign: 'left' }}>Profile</th>
                                <th style={{ padding: '12px 8px', textAlign: 'left' }}>Name</th>
                                <th style={{ padding: '12px 8px', textAlign: 'left' }}>Email</th>
                                <th style={{ padding: '12px 8px', textAlign: 'left' }}>Role</th>
                                <th style={{ padding: '12px 8px', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user, idx) => (
                                    <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '10px 8px' }}>{idx + 1}</td>
                                        <td style={{ padding: '10px 8px' }}>
                                            {user.profilePicture ? (
                                                <img
                                                    src={user.profilePicture}
                                                    alt={user.name || user.username || 'User'}
                                                    style={{
                                                        width: 36,
                                                        height: 36,
                                                        borderRadius: '50%',
                                                        objectFit: 'cover',
                                                        display: 'block',
                                                        margin: '0 auto',
                                                        background: '#e0e0e0'
                                                    }}
                                                />
                                            ) : (
                                                <div style={{
                                                    width: 36,
                                                    height: 36,
                                                    borderRadius: '50%',
                                                    background: '#e0e0e0',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 600,
                                                    fontSize: 16,
                                                    color: '#555',
                                                    textTransform: 'uppercase',
                                                    margin: '0 auto'
                                                }}>
                                                    {(user.firstName && user.lastName)
                                                        ? `${user.firstName[0]}${user.lastName[0]}`
                                                        : (user.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : '?')}
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '10px 8px' }}>{user.name}</td>
                                        <td style={{ padding: '10px 8px' }}>{user.email}</td>
                                        <td style={{ padding: '10px 8px' }}>{user.role}</td>
                                        <td style={{ padding: '10px 8px' }}>{user.created_at}</td>
                                        <td>
                                            <Button className="btn-icon edit" onClick={e => handleEdit(user.id, e)} title="Edit" aria-label={`Edit ${user.name}`} variant="icon">
                                                <EditIcon />
                                            </Button>
                                            <Button className="btn-icon delete" onClick={e => handleDelete(user.id, e)} title="Delete" aria-label={`Delete ${user.name}`} variant="danger">
                                                <DeleteIcon />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: 24 }}>
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default User;
