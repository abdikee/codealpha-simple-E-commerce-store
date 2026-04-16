import React, { useState } from 'react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../utils/api.js';
import { showToast } from '../../components/ui/toaster.jsx';
import { Mail, User, Lock, Loader2 } from 'lucide-react';

export default function AccountDetails() {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName:  user?.lastName  || '',
    email:     user?.email     || '',
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  });
  const [savingProfile,  setSavingProfile]  = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileErrors,  setProfileErrors]  = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!profile.firstName.trim()) errs.firstName = 'Required';
    if (!profile.lastName.trim())  errs.lastName  = 'Required';
    if (!profile.email.trim())     errs.email     = 'Required';
    if (Object.keys(errs).length) { setProfileErrors(errs); return; }
    setProfileErrors({});
    setSavingProfile(true);
    try {
      await api.updateUser(user.id, {
        firstName: profile.firstName,
        lastName:  profile.lastName,
        email:     profile.email,
      });
      showToast.success('Profile updated successfully');
    } catch (err) {
      showToast.error(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!passwords.currentPassword) errs.currentPassword = 'Required';
    if (!passwords.newPassword)     errs.newPassword     = 'Required';
    else if (passwords.newPassword.length < 8) errs.newPassword = 'At least 8 characters';
    if (passwords.newPassword !== passwords.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (Object.keys(errs).length) { setPasswordErrors(errs); return; }
    setPasswordErrors({});
    setSavingPassword(true);
    try {
      await api.updatePassword(user.id, {
        currentPassword: passwords.currentPassword,
        newPassword:     passwords.newPassword,
      });
      showToast.success('Password updated successfully');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showToast.error(err.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-10 max-w-lg">
      <div>
        <h3 className="text-xl font-bold mb-6">Account Details</h3>
        <form onSubmit={handleProfileSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={profile.firstName}
              leadingIcon={<User className="w-4 h-4" />}
              onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))}
              errorMessage={profileErrors.firstName}
            />
            <Input
              label="Last Name"
              value={profile.lastName}
              leadingIcon={<User className="w-4 h-4" />}
              onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))}
              errorMessage={profileErrors.lastName}
            />
          </div>
          <Input
            label="Email Address"
            type="email"
            value={profile.email}
            leadingIcon={<Mail className="w-4 h-4" />}
            onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
            errorMessage={profileErrors.email}
          />
          <Button type="submit" size="lg" className="w-full" loading={savingProfile}>
            Save Profile
          </Button>
        </form>
      </div>

      <div className="pt-6 border-t border-gray-100">
        <h4 className="font-bold text-gray-700 mb-6">Change Password</h4>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={passwords.currentPassword}
            leadingIcon={<Lock className="w-4 h-4" />}
            onChange={e => setPasswords(p => ({ ...p, currentPassword: e.target.value }))}
            errorMessage={passwordErrors.currentPassword}
          />
          <Input
            label="New Password"
            type="password"
            value={passwords.newPassword}
            leadingIcon={<Lock className="w-4 h-4" />}
            onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))}
            errorMessage={passwordErrors.newPassword}
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={passwords.confirmPassword}
            leadingIcon={<Lock className="w-4 h-4" />}
            onChange={e => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))}
            errorMessage={passwordErrors.confirmPassword}
          />
          <Button type="submit" size="lg" variant="secondary" className="w-full" loading={savingPassword}>
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
}
