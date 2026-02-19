import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Button from '../../components/Button/Button';
import { useNavigate, useParams } from 'react-router-dom';
import UserService from '../../services/userService';
import { toast } from 'react-toastify';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import './user.css';
import PageTitle from '../../components/PageTitle/PageTitle';

const roleOptions = ['Customer', 'Shop Manager', 'Administrator'];
const statusOptions = ['active', 'inactive'];

const UserForm = () => {
    const { id } = useParams();
    const isEdit = Boolean(id && id !== 'new');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [role, setRole] = useState('Customer');
    const [status, setStatus] = useState('active');
    const [profilePicture, setProfilePicture] = useState('');
    const [profilePreview, setProfilePreview] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [createdAt, setCreatedAt] = useState('');
    const [originalUser, setOriginalUser] = useState(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const notifyError = (msg) => toast.error(msg);

    useEffect(() => {
        const fetchUser = async () => {
            if (isEdit) {
                try {
                    const token = localStorage.getItem('authToken')?.replace(/^"|"$/g, '');
                    const resp = await UserService.getUserById(token, id);
                    if (resp?.success && resp.data) {
                        const user = resp.data;
                        setUsername(user.userName || user.username || '');
                        setFirstName(user.firstName || '');
                        setLastName(user.lastName || '');
                        setEmail(user.email || '');
                        setPhone(user.phone || '');
                        setCountry(user.country || '');
                        setCity(user.city || '');
                        setAddress(user.address || '');
                        setPostalCode(user.postalCode || '');
                        setRole(user.role || 'Customer');
                        setStatus(user.status || 'active');
                        setProfilePicture(user.profilePicture || '');
                        setProfilePreview(user.profilePicture || '');
                        setCreatedAt(user.created_at || user.createdAt || '');
                        setOriginalUser(user);
                    } else {
                        notifyError('Failed to fetch user details.');
                    }
                } catch (error) {
                    notifyError('An error occurred while fetching user details.');
                }
            }
        };
        fetchUser();
    }, [id, isEdit]);

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
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        if (!username.trim() || !firstName.trim() || !lastName.trim() || !email.trim() || (!isEdit && !password.trim())) {
            setError('Username, first name, last name, email, and password are required.');
            setLoading(false);
            return;
        }
        if (!isEdit && password !== confirmPassword) {
            setError('Password and Confirm Password do not match.');
            setLoading(false);
            return;
        }
        const name = `${firstName} ${lastName}`;
        const token = localStorage.getItem('authToken')?.replace(/^"|"$/g, '');
        const doApi = async () => {
            try {
                let resp;
                if (isEdit) {
                    // Only send changed fields
                    const changed = {};
                    if (!originalUser) return;
                    if ((originalUser.userName || originalUser.username || '') !== username) changed.username = username;
                    if ((originalUser.firstName || '') !== firstName) changed.firstName = firstName;
                    if ((originalUser.lastName || '') !== lastName) changed.lastName = lastName;
                    if ((originalUser.email || '') !== email) changed.email = email;
                    if ((originalUser.phone || '') !== phone) changed.phone = phone;
                    if ((originalUser.country || '') !== country) changed.country = country;
                    if ((originalUser.city || '') !== city) changed.city = city;
                    if ((originalUser.address || '') !== address) changed.address = address;
                    if ((originalUser.postalCode || '') !== postalCode) changed.postalCode = postalCode;
                    if ((originalUser.role || 'Customer') !== role) changed.role = role;
                    if ((originalUser.status || 'active') !== status) changed.status = status;
                    if ((originalUser.profilePicture || '') !== profilePicture) changed.profilePicture = profilePicture;
                    // Always send name if first/last changed
                    if (changed.firstName || changed.lastName) changed.name = name;
                    resp = await UserService.updateUser(token, changed, id);
                } else {
                    const userObj = {
                        userName: username,
                        firstName,
                        lastName,
                        name,
                        email,
                        phone,
                        country,
                        password,
                        city,
                        address,
                        postalCode,
                        role,
                        status,
                        profilePicture,
                        created_at: new Date().toISOString().slice(0, 10)
                    };
                    resp = await UserService.createUser(token, userObj);
                }
                if (resp?.success) {
                    setSuccess(isEdit ? 'User updated!' : 'User added!');
                    toast.success(isEdit ? 'User updated!' : 'User added!');
                    setTimeout(() => navigate('/user'), 1200);
                } else {
                    setError(resp?.message || 'Failed to save user.');
                    toast.error(resp?.message || 'Failed to save user.');
                }
            } catch (error) {
                setError('An error occurred while saving user.');
                toast.error('An error occurred while saving user.');
            } finally {
                setLoading(false);
            }
        };
        doApi();
    };

    return (
        <DashboardLayout>
            <div className="edit-form-card">
                <PageTitle
                    title={isEdit ? 'Edit User' : 'Add User'}
                />
                <form className="edit-form" onSubmit={handleSubmit}>
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
                            <input type="text" className="form-input" value={username} onChange={e => setUsername(e.target.value)} required disabled={isEdit} />
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
                            <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} required disabled={isEdit} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone</label>
                            <input type="text" className="form-input" value={phone} onChange={e => setPhone(e.target.value)} />
                        </div>
                    </div>
                    {!isEdit && (
                        <div className='form-row' >
                            <div className="form-group">
                                <label className="form-label form-label-required">Password{isEdit ? ' (leave blank to keep unchanged)' : ''}</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="form-input"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required={!isEdit}
                                        autoComplete="new-password"
                                        style={{ paddingRight: 36 }}
                                    />
                                    <span
                                        onClick={() => setShowPassword(v => !v)}
                                        style={{
                                            position: 'absolute',
                                            right: 10,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            cursor: 'pointer',
                                            fontSize: 18,
                                            color: '#888'
                                        }}
                                        tabIndex={-1}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <VisibilityOffIcon fontSize='small' /> : <VisibilityIcon fontSize="small" />}
                                    </span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label form-label-required">Confirm Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        className="form-input"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        required={!isEdit}
                                        autoComplete="new-password"
                                        style={{ paddingRight: 36 }}
                                    />
                                    <span
                                        onClick={() => setShowConfirmPassword(v => !v)}
                                        style={{
                                            position: 'absolute',
                                            right: 10,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            cursor: 'pointer',
                                            fontSize: 18,
                                            color: '#888'
                                        }}
                                        tabIndex={-1}
                                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showConfirmPassword ? <VisibilityOffIcon fontSize='small' />: <VisibilityIcon fontSize="small" />}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
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
