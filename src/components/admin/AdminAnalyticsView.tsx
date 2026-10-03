import React from 'react';
import { DAILY_ANALYTICS } from '../../data/adminData';
import { OrderItem, Product } from '../../types';
import {
  TrendingUp,
  CreditCard,
  Banknote,
  ShieldCheck,
  PackageCheck,
  Users,
  Clock,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

interface AdminAnalyticsViewProps {
  orders: OrderItem[];
  products: Product[];
  onNavigateTab: (tab: any) => void;
}

export const AdminAnalyticsView: React.FC<AdminAnalyticsViewProps> = ({
  orders,
  products,
  onNavigateTab
}) => {
  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0) + (DAILY_ANALYTICS.gmvToday || 0);
  const totalOrders = orders.length + (DAILY_ANALYTICS.ordersToday || 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const codOrdersCount = orders.filter((o) => o.paymentMethod === 'COD').length;
  const prepaidOrdersCount = orders.filter((o) => o.paymentMethod.includes('Prepaid')).length;
  const dispatchedCount = orders.filter((o) => o.status === 'Dispatched' || o.status === 'In Transit').length;

  const codPct = totalOrders > 0 ? Math.round((codOrdersCount / totalOrders) * 100) : 0;
  const prepaidPct = totalOrders > 0 ? Math.round((prepaidOrdersCount / totalOrders) * 100) : 0;

  const hourlyTrends = orders.length > 0 ? [
    { hour: '09 AM', orders: Math.ceil(orders.length * 0.1), gmv: `₹${Math.round(totalRevenue * 0.1).toLocaleString('en-IN')}` },
    { hour: '11 AM', orders: Math.ceil(orders.length * 0.15), gmv: `₹${Math.round(totalRevenue * 0.15).toLocaleString('en-IN')}` },
    { hour: '01 PM', orders: Math.ceil(orders.length * 0.2), gmv: `₹${Math.round(totalRevenue * 0.2).toLocaleString('en-IN')}` },
    { hour: '03 PM', orders: Math.ceil(orders.length * 0.25), gmv: `₹${Math.round(totalRevenue * 0.25).toLocaleString('en-IN')}` },
    { hour: 'Now', orders: orders.length, gmv: `₹${totalRevenue.toLocaleString('en-IN')}` }
  ] : [];

  return (
    <div className="space-y-6">
      
      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Gross Revenue */}
        <div className="bg-white rounded-3xl p-5 border border-[#eae5dc] shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#747878]">
              Today's Total Sales
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#fed488]/30 flex items-center justify-center text-[#8c7138]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#141414]">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </h3>
            {totalRevenue > 0 && (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center">
                +28.4% <ArrowUpRight className="w-3 h-3" />
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#747878] mt-1">
            {totalOrders > 0 ? `${totalOrders} orders logged` : '0 orders logged'}
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#fed488] to-[#8c7138]" />
        </div>

        {/* Metric 2: Orders Velocity */}
        <div className="bg-white rounded-3xl p-5 border border-[#eae5dc] shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#747878]">
              Total Orders Today
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#faf8f5] border border-[#eae5dc] flex items-center justify-center text-[#141414]">
              <PackageCheck className="w-4 h-4 text-[#8c7138]" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#141414]">
              {totalOrders}
            </h3>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              {totalOrders > 0 ? 'Fast Orders' : 'Live Ready'}
            </span>
          </div>
          <p className="text-[11px] text-[#747878] mt-1">
            Average Order Amount: <strong>₹{avgOrderValue.toLocaleString('en-IN')}</strong>
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#141414] to-[#444748]" />
        </div>

        {/* Metric 3: RTO Shield Protected Savings */}
        <div className="bg-white rounded-3xl p-5 border border-[#eae5dc] shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#747878]">
              Fake Order Prevention Savings
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-emerald-800">
              ₹{(DAILY_ANALYTICS.rtoShieldSavings || 0).toLocaleString('en-IN')}
            </h3>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              Active Protection
            </span>
          </div>
          <p className="text-[11px] text-[#747878] mt-1">
            0 flagged Cash on Delivery orders
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />
        </div>

        {/* Metric 4: Live Storefront Visitors */}
        <div className="bg-white rounded-3xl p-5 border border-[#eae5dc] shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#747878]">
              People on Store Right Now
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#faf8f5] flex items-center justify-center text-[#141414]">
              <Users className="w-4 h-4 text-[#8c7138]" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#141414] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              {DAILY_ANALYTICS.activeVisitors || 0}
            </h3>
            <span className="text-[10px] font-mono font-bold text-[#8c7138]">
              Active Now
            </span>
          </div>
          <p className="text-[11px] text-[#747878] mt-1">
            Visitors who bought: <strong>{totalOrders > 0 ? '4.8%' : '0%'}</strong>
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#8c7138]" />
        </div>

      </div>

      {/* Center 2-Column: Hourly Sales Breakdown + Payment Mix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Hourly Sales Velocity Chart */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-[#eae5dc] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#eae5dc]">
            <div>
              <h3 className="font-display text-base font-bold text-[#141414] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#8c7138]" />
                Hourly Orders &amp; Sales Speed
              </h3>
              <p className="text-xs text-[#747878] mt-0.5">
                {orders.length > 0 ? 'Live hourly sales flow' : 'No sales activity recorded yet'}
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-[#faf8f5] px-2.5 py-1 rounded-full border border-[#eae5dc] text-[#141414]">
              TODAY'S RUN RATE
            </span>
          </div>

          {/* Bar Chart Visualizer */}
          <div className="pt-4 space-y-3">
            {hourlyTrends.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center px-4 bg-[#faf8f5] rounded-2xl border border-dashed border-[#eae5dc]">
                <Clock className="w-8 h-8 text-[#8c7138]/50 mb-2" />
                <p className="text-sm font-semibold text-[#141414]">No hourly sales recorded today</p>
                <p className="text-xs text-[#747878] mt-1">New incoming orders and sales speed will be tracked here live in real-time.</p>
              </div>
            ) : (
              hourlyTrends.map((trend, idx) => {
                const maxVal = Math.max(...hourlyTrends.map(t => t.orders), 1);
                const pct = Math.round((trend.orders / maxVal) * 100);
                const isPeak = trend.orders === maxVal;

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[#747878]">{trend.hour}</span>
                      <span className="font-bold text-[#141414]">
                        {trend.orders} orders • <span className="text-[#8c7138]">{trend.gmv}</span>
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-[#faf8f5] border border-[#eae5dc] overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${
                          isPeak
                            ? 'bg-gradient-to-r from-[#fed488] via-[#c5a059] to-[#8c7138]'
                            : 'bg-[#141414]'
                        }`}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Payment Method & Courier Distribution */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Payment Share Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#eae5dc] shadow-sm space-y-4">
            <h3 className="font-display text-base font-bold text-[#141414] flex items-center gap-2 pb-2 border-b border-[#eae5dc]">
              <CreditCard className="w-4 h-4 text-[#8c7138]" />
              Payment Mix Breakdown
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#141414] font-medium">
                  <Banknote className="w-4 h-4 text-[#8c7138]" />
                  Cash On Delivery (COD)
                </span>
                <span className="font-bold text-[#141414]">{codPct}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#faf8f5] border border-[#eae5dc] overflow-hidden">
                <div className="h-full bg-[#8c7138] rounded-full transition-all duration-500" style={{ width: `${codPct}%` }} />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="flex items-center gap-1.5 text-[#141414] font-medium">
                  <CreditCard className="w-4 h-4 text-emerald-700" />
                  Prepaid Instant UPI / Cards
                </span>
                <span className="font-bold text-emerald-800">{prepaidPct}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#faf8f5] border border-[#eae5dc] overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full transition-all duration-500" style={{ width: `${prepaidPct}%` }} />
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#faf8f5] border border-[#eae5dc] text-[11px] text-[#444748] leading-relaxed">
              💡 <strong>Prepaid Incentive Engine:</strong> Offering ₹20 instant discount on UPI checkout converts 22% of COD orders to Prepaid.
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-[#141414] text-white rounded-3xl p-6 shadow-sm space-y-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-[#fed488] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#fed488]" />
              Quick Ops Actions
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button
                onClick={() => onNavigateTab('orders')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-left transition-colors"
              >
                📦 Process Orders
              </button>
              <button
                onClick={() => onNavigateTab('inventory')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-left transition-colors"
              >
                💎 Manage Stock
              </button>
              <button
                onClick={() => onNavigateTab('rto-shield')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-left transition-colors"
              >
                🛡️ RTO Shield
              </button>
              <button
                onClick={() => onNavigateTab('coupons')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-left transition-colors"
              >
                🎟️ Discount Codes
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
