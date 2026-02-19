import React, { useState, useEffect, useMemo, useCallback } from 'react';
import GlobalLoader from '../../components/Loader/GlobalLoader';
import EmptyState from '../../components/EmptyState/EmptyState';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Button from '../../components/Button/Button';
import SearchAndFilter from '../../components/SearchAndFilter/SearchAndFilter';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import mockUsers from '../../data/mockUsers';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/orderUtils';
import Pagination from '../../components/Pagination/Pagination';
import PeopleIcon from '@mui/icons-material/People';
import Table from '../../components/Table/Table';
import PageTitle from '../../components/PageTitle/PageTitle';
import UserService from '../../services/userService';
import { toast } from 'react-toastify';
import './user.css';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';


const User = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [userToDelete, setOrderToDelete] = useState(null);
    const itemsPerPage = 10;
    const navigate = useNavigate();


    // Fetch users when page or searchTerm changes
    useEffect(() => {
        getUserList();
    }, [page, searchTerm]);

    const filteredUsers = useMemo(() => {
        return {
            items: users,
            total: totalUsers
        };
    }, [users, totalUsers]);

    const getUserList = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken')?.replace(/^"|"$/g, '');
            const resp = await UserService.getUserList(token, page, itemsPerPage, searchTerm);
            if (resp?.success) {
                setUsers(resp.data || []);
                setTotalPages(resp.pagination?.totalPages || 1);
                setTotalOrders(resp.pagination?.total || 0);
            } else {
                notifyError("Please try again.");
            }
        } catch (error) {
            notifyError("An error occurred during fetch Data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = useCallback((newPage) => {
        setPage(newPage);
    }, []);

    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

    const handleEdit = (id) => {
        navigate(`/user/edit/${id}`);
    };

     const handleDeleteClick = (user) => {
        setOrderToDelete(user);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete || !userToDelete._id) {
            setConfirmOpen(false);
            setOrderToDelete(null);
            return;
        }
        try {
            const token = localStorage.getItem('authToken')?.replace(/^"|"$/g, '');
            const resp = await UserService.DeleteOrder(token, userToDelete._id);
            if (resp?.success) {
                toast.success(resp?.message, {
                    position: 'top-right',
                    autoClose: 3000,
                });
                setUsers(prev => prev.filter(o => o._id !== userToDelete._id));

            }
            else {
                console.error('Failed to delete order');
            }
        } catch (error) {
            console.error('Error deleting order:', error);
        } finally {
            setConfirmOpen(false);
            setOrderToDelete(null);
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
                    {loading ? (
                        <>
                            <GlobalLoader text="Loading users..." />

                        </>
                    ) : filteredUsers.items.length > 0 ? (
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
                                    render: (value, row, idx) => (page - 1) * itemsPerPage + idx + 1,
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
                                                : (user.firstName ? user.firstName.split(' ').map(n => n[0]).join('').slice(0, 2) : '?')}
                                        </div>
                                    ),
                                },
                                {
                                    key: 'userName',
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
                                    key: 'createdAt',
                                    label: 'Created At',
                                    render: (value, row) => (
                                        <span className="order-list__date">{formatDate(row.createdAt)}</span>
                                    ),
                                },
                                {
                                    key: 'actions',
                                    label: 'Actions',
                                    render: (value, user) => (
                                        <>
                                            <Button className="btn-icon edit" onClick={e => handleEdit(user._id, e)} title={`Edit ${user.name}`} aria-label={`Edit ${user.name}`} variant="icon">
                                                <EditIcon />
                                            </Button>
                                            <Button className="btn-icon delete" onClick={e => handleDeleteClick(user)} title={`Delete ${user.name}`} aria-label={`Delete ${user.name}`} variant="danger">
                                                <DeleteIcon />
                                            </Button>
                                        </>
                                    ),
                                },
                            ]}
                            data={filteredUsers?.items}
                        />
                    ) : (
                        <EmptyState
                            icon={<PeopleIcon style={{ fontSize: 48 }} />}
                            title="No Users Found"
                            description={searchTerm ? 'No users match your search.' : 'No users have been added yet.'}
                        />
                    )}
                </div>
                {totalPages > 1 && !loading && (
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        showInfo={true}
                        showJumper={totalPages > 10}
                    />
                )}
            </div>
            <ConfirmDialog
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete User"
                message={userToDelete ? `Are you sure you want to delete User ${userToDelete.userName}?` : ''}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </DashboardLayout>
    );
};

export default User;
