import React, { useState } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Gauge, 
  Wrench, 
  Car, 
  Zap, 
  Disc, 
  Layers, 
  Sliders, 
  Sparkles, 
  ChevronRight, 
  Phone, 
  MessageSquare,
  ArrowUpRight,
  Filter,
  Plus
} from 'lucide-react';
import { CarListing } from '../../types';

interface VehicleHealthFleetHubProps {
  listings: CarListing[];
  onSelectVehicle: (vehicle: CarListing) => void;
  formatPrice: (price: number) => string;
}

interface MaintenanceTask {
  id: string;
  time: string;
  type: string;
  vehicleTitle: string;
  location: string;
  technician: string;
  status: 'Scheduled' | 'In-Progress' | 'Completed' | 'Urgent';
}

export const VehicleHealthFleetHub: React.FC<VehicleHealthFleetHubProps> = ({
  listings,
  onSelectVehicle,
  formatPrice,
}) => {
  const [selectedVehicleIndex, setSelectedVehicleIndex] = useState(0);
  const [timeFilter, setTimeFilter] = useState<'This Week' | 'Today' | 'This Month'>('This Week');
  const [bookedServiceSuccess, setBookedServiceSuccess] = useState(false);

  const activeVehicle = listings[selectedVehicleIndex] || listings[0];

  // Subsystem telemetry data
  const subsystems = [
    { name: 'Engine & Valvetrain', score: 96, status: 'Excellent', color: 'bg-emerald-500', icon: Wrench },
    { name: 'Hydraulic Brakes', score: 91, status: 'Optimal', color: 'bg-emerald-500', icon: Disc },
    { name: 'Hybrid / 12V Battery', score: 88, status: 'Good', color: 'bg-emerald-500', icon: Zap },
    { name: 'Adaptive Suspension', score: 79, status: 'Good', color: 'bg-blue-500', icon: Layers },
    { name: 'Tire Tread & Pressure', score: 72, status: 'Attention', color: 'bg-amber-500', icon: Gauge },
    { name: 'Transmission & Drivetrain', score: 94, status: 'Optimal', color: 'bg-emerald-500', icon: Sliders },
  ];

  const maintenanceSchedule: MaintenanceTask[] = [
    {
      id: 'task-1',
      time: '08:00 AM - 09:00 AM',
      type: 'Oil Change & Filter Flush',
      vehicleTitle: 'Toyota Fortuner Legender 2.8',
      location: 'Auto Choice Service Bay 1',
      technician: 'Eng. Asfandyar',
      status: 'Scheduled',
    },
    {
      id: 'task-2',
      time: '09:30 AM - 10:30 AM',
      type: 'Electronic Brake Inspection & Bleed',
      vehicleTitle: 'Honda Civic RS Turbo 2022',
      location: 'Precision Dyno Workshop',
      technician: 'M. Nasir Mirza',
      status: 'In-Progress',
    },
    {
      id: 'task-3',
      time: '11:00 AM - 12:00 PM',
      type: 'All-Terrain Tire Rotation & Alignment',
      vehicleTitle: 'Kia Sportage AWD Special Edition',
      location: 'Alamas Car Village Ring Road',
      technician: 'Malak Mazhar',
      status: 'Scheduled',
    },
    {
      id: 'task-4',
      time: '02:00 PM - 02:45 PM',
      type: 'High-Voltage Battery Cell Health Test',
      vehicleTitle: 'Toyota Yaris ATIV X CVT',
      location: 'Diagnostics Lab',
      technician: 'Eng. Asfandyar',
      status: 'Completed',
    },
  ];

  const recentAlerts = [
    {
      id: 'alt-1',
      title: 'Tire Pressure Calibration Suggested',
      desc: 'Rear right pressure 28 PSI (Standard 32 PSI)',
      type: 'Warning',
      time: '5 mins ago',
    },
    {
      id: 'alt-2',
      title: 'Routine 10,000 km Scheduled Service',
      desc: 'Synthetic 5W-30 Oil and Cabin Air Filter replacement due',
      type: 'Info',
      time: '1 hour ago',
    },
    {
      id: 'alt-3',
      title: 'Brake Pad Thickness Verified: 8.5mm',
      desc: 'Passed certified 150-point diagnostic inspection',
      type: 'Passed',
      time: 'Yesterday',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* 1. Header Banner & Subsystem Overview */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <Activity size={15} />
              <span>Northvale AI • Vehicle Telemetry & Diagnostics</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Vehicle Health Center & Maintenance Planner
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Centralized showroom fleet monitoring, predictive telemetry alerts, and certified diagnostic scheduling.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="Today">Today (Tue, 30 Sep)</option>
              <option value="This Week">This Week (30 Sep - 06 Oct)</option>
              <option value="This Month">This Month</option>
            </select>
            
            <button
              onClick={() => {
                setBookedServiceSuccess(true);
                setTimeout(() => setBookedServiceSuccess(false), 4000);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Plus size={14} />
              <span>Book Service</span>
            </button>
          </div>
        </div>

        {bookedServiceSuccess && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>Service appointment request submitted! Auto Choice certified technician will confirm your bay slot on WhatsApp.</span>
          </div>
        )}

        {/* Top KPIs Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mt-6">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
            <span className="text-xs text-slate-500 font-semibold block">Scheduled Today</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900">24</span>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+12%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full w-3/4" />
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
            <span className="text-xs text-slate-500 font-semibold block">Due This Week</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900">18</span>
              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">-8%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-blue-500 h-full w-1/2" />
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
            <span className="text-xs text-slate-500 font-semibold block">Under Active Service</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900">12</span>
              <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">-5%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-indigo-500 h-full w-2/5" />
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
            <span className="text-xs text-slate-500 font-semibold block">Overdue Alerts</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900">6</span>
              <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">-3%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-amber-500 h-full w-1/4" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Center Grid: Vehicle Health Score Radial Arc + Subsystems + Alert Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Vehicle Health & Interactive Subsystems */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Vehicle Selector Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Select Vehicle for Live Telemetry</h2>
              <span className="text-xs text-slate-400 font-mono">VIN / Ref Verified</span>
            </div>

            {/* Vehicle Selection Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {listings.slice(0, 3).map((car, idx) => (
                <div
                  key={car.id}
                  onClick={() => setSelectedVehicleIndex(idx)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    selectedVehicleIndex === idx
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
                    <span className="truncate">{car.make} {car.model}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                      idx === 0 ? 'bg-emerald-100 text-emerald-700' : idx === 1 ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {idx === 0 ? 'Active' : idx === 1 ? 'Service' : 'Inspected'}
                    </span>
                  </div>

                  <div className="aspect-[16/10] bg-slate-50 rounded-xl overflow-hidden my-2 flex items-center justify-center">
                    <img 
                      src={car.imageUrl || (car.images && car.images[0])} 
                      alt={car.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="font-bold text-slate-900 truncate">{car.title}</span>
                    <span className="font-mono text-blue-600 font-bold">{formatPrice(car.price)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Health Score Gauge & Diagnostics */}
            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
              
              {/* Radial Arc Visual Health Meter */}
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Overall Health Score</span>
                
                <div className="relative w-36 h-20 overflow-hidden flex items-end justify-center">
                  {/* Gauge Ring Background */}
                  <div className="w-36 h-36 rounded-full border-[14px] border-slate-200 border-b-transparent border-l-transparent absolute top-0 -rotate-45" />
                  {/* Gauge Active Arc */}
                  <div className="w-36 h-36 rounded-full border-[14px] border-emerald-500 border-b-transparent border-l-transparent absolute top-0 -rotate-12 transition-all duration-700" />
                  
                  <div className="flex flex-col items-center -mb-1">
                    <span className="text-3xl font-black text-slate-900 tracking-tight">86<span className="text-base text-slate-400 font-normal">/100</span></span>
                  </div>
                </div>

                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                  <ShieldCheck size={14} />
                  <span>Condition: Excellent (Grade 4.5A)</span>
                </div>
              </div>

              {/* Subsystem Telemetry Bars */}
              <div className="sm:col-span-2 space-y-2.5">
                {subsystems.map((sub) => {
                  const Icon = sub.icon;
                  return (
                    <div key={sub.name} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                        <Icon size={13} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-800 truncate">{sub.name}</span>
                          <span className="font-mono font-bold text-slate-900">{sub.score}% <span className="text-slate-400 font-normal">({sub.status})</span></span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className={`${sub.color} h-full rounded-full transition-all duration-500`} style={{ width: `${sub.score}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

          {/* Maintenance Planner Task List */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Today's Maintenance Schedule</h2>
                <p className="text-xs text-slate-400">Peshawar Service Bay & Dyno Queue</p>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                4 Operations Planned
              </span>
            </div>

            <div className="space-y-3">
              {maintenanceSchedule.map((item) => (
                <div 
                  key={item.id}
                  className="p-3.5 rounded-2xl border border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0 mt-0.5">
                      <Wrench size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{item.type}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                          item.status === 'In-Progress' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{item.vehicleTitle} • {item.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-500 sm:border-l sm:border-slate-100 sm:pl-4">
                    <div className="flex items-center gap-1 font-mono text-slate-700">
                      <Clock size={13} className="text-slate-400" />
                      <span>{item.time}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-900 bg-slate-100 px-2 py-1 rounded">
                      {item.technician}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Col: Predictive Alerts & Quick Actions */}
        <div className="space-y-6">
          
          {/* Predictive Alerts */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle size={17} className="text-amber-500" />
                <h3 className="font-bold text-slate-900 text-sm">Predictive Alerts</h3>
              </div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Live Stream
              </span>
            </div>

            <div className="space-y-3">
              {recentAlerts.map((alt) => (
                <div key={alt.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{alt.title}</span>
                    <span className="text-[10px] text-slate-400">{alt.time}</span>
                  </div>
                  <p className="text-xs text-slate-500">{alt.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Auto Choice Certified Workshop Guarantee */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <ShieldCheck size={22} />
            </div>
            
            <div>
              <h3 className="text-lg font-bold">150-Point Certified Diagnostic Bay</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Every vehicle listed on Bazar360 undergoes electronic OBD-II computer scanning, frame alignment verification, and total genuine paint depth measurement.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Workshop Inquiries:</span>
              <a 
                href="https://wa.me/923159085086?text=Hi%2C%20I%20want%20to%20book%20a%20vehicle%20inspection%20and%20health%20check%20at%20Auto%20Choice."
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-bold transition-colors"
              >
                <MessageSquare size={13} />
                <span>WhatsApp Bay</span>
              </a>
            </div>
          </div>

          {/* Quick Vehicle Inspection CTA */}
          <div className="bg-blue-50 border border-blue-200/80 rounded-3xl p-5 text-center space-y-3">
            <h4 className="font-bold text-blue-950 text-sm">Need a Pre-Purchase Inspection?</h4>
            <p className="text-xs text-blue-800">
              Our mobile auditors visit any showroom in Peshawar, Islamabad, or Lahore to generate a digital health report in 60 minutes.
            </p>
            <button 
              onClick={() => onSelectVehicle(activeVehicle)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Inspect {activeVehicle?.title || 'Vehicle'}</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
