import React, { useState, useEffect } from 'react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Plus, Trash2, MapPin } from 'lucide-react';
import { showToast } from '../../components/ui/toaster.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const STORAGE_KEY = (userId) => `addresses_${userId}`;

export default function Addresses() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm] = useState({
    label: '', firstName: '', lastName: '',
    address: '', city: '', state: '', zip: '', country: 'United States',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user) return;
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY(user.id)) || '[]');
    setAddresses(stored);
  }, [user]);

  const persist = (updated) => {
    setAddresses(updated);
    localStorage.setItem(STORAGE_KEY(user.id), JSON.stringify(updated));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim())  e.lastName  = 'Required';
    if (!form.address.trim())   e.address   = 'Required';
    if (!form.city.trim())      e.city      = 'Required';
    if (!form.state.trim())     e.state     = 'Required';
    if (!form.zip.trim())       e.zip       = 'Required';
    return e;
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const updated = [...addresses, { ...form, id: crypto.randomUUID() }];
    persist(updated);
    setForm({ label: '', firstName: '', lastName: '', address: '', city: '', state: '', zip: '', country: 'United States' });
    setErrors({});
    setShowForm(false);
    showToast.success('Address saved');
  };

  const handleDelete = (id) => {
    persist(addresses.filter(a => a.id !== id));
    showToast.success('Address removed');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Saved Addresses</h3>
        {!showForm && (
          <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowForm(true)}>
            Add Address
          </Button>
        )}
      </div>

      {addresses.length === 0 && !showForm && (
        <div className="text-center py-12 text-gray-400">
          <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No saved addresses yet.</p>
        </div>
      )}

      {addresses.map(addr => (
        <div key={addr.id} className="p-6 border border-gray-100 rounded-2xl flex justify-between items-start">
          <div>
            {addr.label && <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">{addr.label}</p>}
            <p className="font-bold text-gray-900">{addr.firstName} {addr.lastName}</p>
            <p className="text-sm text-gray-500 mt-1">{addr.address}</p>
            <p className="text-sm text-gray-500">{addr.city}, {addr.state} {addr.zip}</p>
            <p className="text-sm text-gray-500">{addr.country}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(addr.id)}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      ))}

      {showForm && (
        <form onSubmit={handleAdd} className="p-6 border-2 border-primary/20 rounded-2xl space-y-4">
          <Input
            label="Label (e.g. Home, Work)"
            value={form.label}
            onChange={e => setForm(p => ({ ...p, label: e.target.value }))}
            placeholder="Home"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" value={form.firstName}
              onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))}
              errorMessage={errors.firstName} />
            <Input label="Last Name" value={form.lastName}
              onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))}
              errorMessage={errors.lastName} />
          </div>
          <Input label="Street Address" value={form.address}
            onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
            errorMessage={errors.address} />
          <div className="grid grid-cols-3 gap-4">
            <Input label="City"  value={form.city}  onChange={e => setForm(p => ({ ...p, city: e.target.value }))}  errorMessage={errors.city} />
            <Input label="State" value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))} errorMessage={errors.state} />
            <Input label="Zip"   value={form.zip}   onChange={e => setForm(p => ({ ...p, zip: e.target.value }))}   errorMessage={errors.zip} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit">Save Address</Button>
            <Button type="button" variant="secondary" onClick={() => { setShowForm(false); setErrors({}); }}>Cancel</Button>
          </div>
        </form>
      )}
    </div>
  );
}
