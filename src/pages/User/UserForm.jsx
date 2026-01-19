import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Button from '../../components/Button/Button';
import { useNavigate, useParams } from 'react-router-dom';
import mockUsers from '../../data/mockUsers';
import './user.css';

const roleOptions = ['Customer', 'Shop Manager', 'Administrator'];
const statusOptions = ['active', 'inactive'];

const UserForm = () => {
    const { id } = useParams();
    const isEdit = Boolean(id && id !== 'new');
    const currentUser = isEdit ? mockUsers.find(u => u.id === id) : null;
    const [username, setUsername] = useState(currentUser?.username || '');
    const [firstName, setFirstName] = useState(currentUser?.firstName || '');
    const [lastName, setLastName] = useState(currentUser?.lastName || '');
    const [email, setEmail] = useState(currentUser?.email || '');
    const [phone, setPhone] = useState(currentUser?.phone || '');
    const [country, setCountry] = useState(currentUser?.country || '');
    const [city, setCity] = useState(currentUser?.city || '');
    const [address, setAddress] = useState(currentUser?.address || '');
    const [postalCode, setPostalCode] = useState(currentUser?.postalCode || '');
    const [role, setRole] = useState(currentUser?.role || 'Customer');
    const [status, setStatus] = useState(currentUser?.status || 'active');
    const [profilePicture, setProfilePicture] = useState(currentUser?.profilePicture || '');
    const [profilePreview, setProfilePreview] = useState(currentUser?.profilePicture || '');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setError('');
        setSuccess('');
    }, [username, firstName, lastName, email, phone, country, city, address, postalCode, role, status]);

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(reader.result);
                setProfilePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }
        const handleSubmit = (e) => {
            e.preventDefault();
            setError('');
            setSuccess('');
            setLoading(true);
            if (!username.trim() || !firstName.trim() || !lastName.trim() || !email.trim()) {
                setError('Username, first name, last name, and email are required.');
                setLoading(false);
                return;
            }
            // Simulate localStorage update
            let users = JSON.parse(localStorage.getItem('users') || 'null') || mockUsers;
            const name = `${firstName} ${lastName}`;
            const userObj = {
                id: isEdit ? id : String(users.length + 1),
                username,
                firstName,
                lastName,
                name,
                email,
                phone,
                country,
                city,
                address,
                postalCode,
                role,
                status,
                profilePicture,
                created_at: isEdit ? (currentUser?.created_at || new Date().toISOString().slice(0, 10)) : new Date().toISOString().slice(0, 10)
            };
            if (isEdit) {
                users = users.map(u => u.id === id ? userObj : u);
                setSuccess('User updated!');
            } else {
                users = [
                    ...users,
                    userObj
                ];
                setSuccess('User added!');
            }
            localStorage.setItem('users', JSON.stringify(users));
            setLoading(false);
            setTimeout(() => navigate('/user'), 1200);
        };

        return (
            <DashboardLayout>
                <div className="edit-form-card">
                    <form className="edit-form" onSubmit={handleSubmit}>
                        <h1 className="edit-form-title">{isEdit ? 'Edit User' : 'Add User'}</h1>
                        {(error || success) && (
                            <div style={{ marginBottom: 16 }}>
                                {error && <div className="form-error">{error}</div>}
                                {success && <div className="form-success">{success}</div>}
                            </div>
                        )}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Profile Picture</label>
                                <input type="file" accept="image/*" className="form-input" onChange={handleProfilePictureChange} />
                                {profilePreview && (
                                    <div className="user-profile-img-preview">
                                        <img src={profilePreview} alt="Profile Preview" className="user-profile-img" style={{ width: 64, height: 64 }} />
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <label className="form-label form-label-required">Username</label>
                                <input type="text" className="form-input" value={username} onChange={e => setUsername(e.target.value)} required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label form-label-required">First Name</label>
                                <input type="text" className="form-input" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label form-label-required">Last Name</label>
                                <input type="text" className="form-input" value={lastName} onChange={e => setLastName(e.target.value)} required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label form-label-required">Email</label>
                                <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone</label>
                                <input type="text" className="form-input" value={phone} onChange={e => setPhone(e.target.value)} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Country</label>
                                <input type="text" className="form-input" value={country} onChange={e => setCountry(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">City</label>
                                <input type="text" className="form-input" value={city} onChange={e => setCity(e.target.value)} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Address</label>
                                <input type="text" className="form-input" value={address} onChange={e => setAddress(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Postal Code</label>
                                <input type="text" className="form-input" value={postalCode} onChange={e => setPostalCode(e.target.value)} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label form-label-required">Role</label>
                                <select className="form-input" value={role} onChange={e => setRole(e.target.value)} required>
                                    {roleOptions.map(r => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label form-label-required">Status</label>
                                <select className="form-input" value={status} onChange={e => setStatus(e.target.value)} required>
                                    {statusOptions.map(s => (
                                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-actions">
                            <Button
                                type="submit"
                                className="btn-add"
                                disabled={loading}
                            >
                                {loading ? (isEdit ? 'Updating...' : 'Adding...') : (isEdit ? 'Update User' : 'Add User')}
                            </Button>
                            <Button
                                type="button"
                                className="btn-secondary"
                                onClick={() => navigate('/user')}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </DashboardLayout>
        );
    };

    export default UserForm;
