import React, { useState } from 'react';
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Phone, 
  MapPin, 
  Car,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';

export interface ServiceManagementHubProps {
  lang: 'en' | 'ur';
}

interface ServiceOrder {
  id: string;
  customerName: string;
  phone: string;
  serviceType: string;
  vehicle: string;
  city: string;
  date: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  price: number;
}

export function ServiceManagementHub({ lang }: ServiceManagementHubProps) {
  const isUrdu = lang === 'ur';
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const [orders, setOrders] = useState<ServiceOrder[]>([
    {
      id: 'SRV-1001',
      customerName: 'Muhammad Haris',
      phone: '+92 312 9085033',
      serviceType: '200+ Point Inspection',
      vehicle: '2022 Toyota Fortuner Legender',
      city: 'Peshawar',
      date: '2026-07-20',
      status: 'Pending',
      price: 8500,
    },
    {
      id: 'SRV-1002',
      customerName: 'Kamran Shah',
      phone: '+92 300 5908508',
      serviceType: 'Ceramic Coating & Detailing',
      vehicle: '2021 Honda Civic Oriel',
      city: 'Islamabad',
      date: '2026-07-19',
      status: 'In Progress',
      price: 25000,
    },
    {
      id: 'SRV-1003',
      customerName: 'Zubair Afridi',
      phone: '+92 315 9085086',
      serviceType: 'Ownership Transfer & Token Tax',
      vehicle: '2019 Toyota Prado TX',
      city: 'Peshawar',
      date: '2026-07-18',
      status: 'Completed',
      price: 15000,
    },
  ]);

  const handleStatusChange = (orderId: string, newStatus: ServiceOrder['status']) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    toast.success(`Service order ${orderId} updated to ${newStatus}`);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Title & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <ClipboardList className="text-sky-600" />
            {isUrdu ? 'سروس مینجمنٹ ڈیسک' : 'Service Orders Management Desk'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isUrdu ? 'گاڑیوں کے معائنہ، ڈیٹیلنگ اور ٹرانسفر بکنگز کو منظم کریں' : 'Track, assign, and update inspection, detailing, and registration bookings.'}
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search orders..."
              className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-sky-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-700 font-semibold focus:outline-hidden"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-sky-400/50 transition-all shadow-2xs"
            >
              {/* Order Info */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs bg-sky-100 text-sky-800 px-2 py-0.5 rounded border border-sky-200">
                    {order.id}
                  </span>
                  <span className="font-black text-slate-900 text-sm sm:text-base">
                    {order.serviceType}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <User size={13} className="text-slate-400" /> {order.customerName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone size={13} className="text-slate-400" /> {order.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Car size={13} className="text-slate-400" /> {order.vehicle}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-slate-400" /> {order.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={13} className="text-slate-400" /> {order.date}
                  </span>
                </div>
              </div>

              {/* Status & Pricing */}
              <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Fee</span>
                  <span className="font-mono font-black text-slate-900 text-sm">
                    PKR {order.price.toLocaleString()}
                  </span>
                </div>

                {/* Status selector */}
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value as ServiceOrder['status'])}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border cursor-pointer focus:outline-hidden ${
                    order.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : order.status === 'In Progress'
                      ? 'bg-sky-50 text-sky-800 border-sky-300'
                      : order.status === 'Cancelled'
                      ? 'bg-rose-50 text-rose-800 border-rose-300'
                      : 'bg-amber-50 text-amber-800 border-amber-300'
                  }`}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
            No service orders match your criteria.
          </div>
        )}
      </div>
    </div>
  );
}

export default ServiceManagementHub;
