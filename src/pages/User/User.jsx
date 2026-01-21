import React, { useState, useEffect, useMemo } from 'react';
import EmptyState from '../../components/EmptyState/EmptyState';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Button from '../../components/Button/Button';
import SearchAndFilter from '../../components/SearchAndFilter/SearchAndFilter';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import mockUsers from '../../data/mockUsers';
import { useNavigate } from 'react-router-dom';
import './user.css';
import Pagination from '../../components/Pagination/Pagination';
import PeopleIcon from '@mui/icons-material/People';
import Table from '../../components/Table/Table';
import PageTitle from '../../components/PageTitle/PageTitle';

const User = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 2;
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

    // Pagination logic
    const totalPages = Math.ceil(filteredUsers.length / pageSize);
    const paginatedUsers = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredUsers.slice(start, start + pageSize);
    }, [filteredUsers, page, pageSize]);

    // Reset to first page when search changes
    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

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
                <PageTitle
                    title="Users"
                    subTitle="Manage all users and their roles."
                    button={true}
                    buttonLabel="Add User"
                    onButtonClick={() => navigate('/user/edit/new')}
                />
                <div className="search-bar">
                    <SearchAndFilter
                        searchValue={searchTerm}
                        onSearchChange={setSearchTerm}
                        showFilter={false}
                        placeholder="Search by name, email, or role..."
                    />
                </div>
                <div className="user-table-wrapper order-list__table-container">
                    {paginatedUsers.length > 0 ? (
                        <Table
                            tableClassName="user-table"
                            theadClassName=""
                            tbodyClassName=""
                            trClassName=""
                            thClassName=""
                            tdClassName=""
                            columns={[
                                {
                                    key: 'index',
                                    label: '#',
                                    render: (value, row, idx) => (page - 1) * pageSize + idx + 1,
                                },
                                {
                                    key: 'profile',
                                    label: 'Profile',
                                    render: (value, user) => user.profilePicture ? (
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
                                    ),
                                },
                                {
                                    key: 'name',
                                    label: 'Name',
                                },
                                {
                                    key: 'email',
                                    label: 'Email',
                                },
                                {
                                    key: 'role',
                                    label: 'Role',
                                },
                                {
                                    key: 'created_at',
                                    label: 'Created At',
                                },
                                {
                                    key: 'actions',
                                    label: 'Actions',
                                    render: (value, user) => (
                                        <>
                                            <Button className="btn-icon edit" onClick={e => handleEdit(user.id, e)} title={`Edit ${user.name}`} aria-label={`Edit ${user.name}`} variant="icon">
                                                <EditIcon />
                                            </Button>
                                            <Button className="btn-icon delete" onClick={e => handleDelete(user.id, e)} title={`Delete ${user.name}`} aria-label={`Delete ${user.name}`} variant="danger">
                                                <DeleteIcon />
                                            </Button>
                                        </>
                                    ),
                                },
                            ]}
                            data={paginatedUsers}
                        />
                    ) : (
                        <EmptyState
                            icon={<PeopleIcon style={{ fontSize: 48 }} />}
                            title="No Users Found"
                            description={searchTerm ? 'No users match your search.' : 'No users have been added yet.'}
                        />
                    )}
                </div>
                {totalPages > 1 && (
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        showInfo={true}
                        showJumper={totalPages > 10}
                    />
                )}
            </div>
        </DashboardLayout>
    );
};

export default User;
