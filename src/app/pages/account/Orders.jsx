import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api.js';
import { Button } from '../../components/Button';
import { ChevronRight } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOrders().then(setOrders).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl" />)}</div>;

  return (
    <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-xl shadow-gray-200/20">
      <div className="p-8 border-b border-gray-50">
        <h3 className="text-xl font-bold">My Orders</h3>
      </div>
      {orders.length === 0 ? (
        <div className="p-12 text-center text-gray-500">No orders yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                {['Order ID', 'Date', 'Status', 'Total', 'Actions'].map(h => (
                  <th key={h} className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6 text-sm font-bold text-gray-900">#{order.id?.slice(0, 8)}</td>
                  <td className="px-8 py-6 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.status === 'DELIVERED' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-gray-900">${order.total?.toFixed(2)}</td>
                  <td className="px-8 py-6">
                    <Button variant="secondary" size="sm" className="h-9 px-4 text-xs border-gray-100 hover:border-primary">Details</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
