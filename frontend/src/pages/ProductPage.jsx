
import { useEffect, useState } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct, getTopSellingProducts } from "../api/product.api";
import { getProfile } from "../api/user.api";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Plus, Layers, Pencil, Trash2, X, Check, Search, IndianRupee, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Rectangle, Pie, Cell, Legend, PieChart } from 'recharts';
import toast from "react-hot-toast";
import { createPortal } from "react-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { getCached, setCached, invalidateCache } from "../utils/dataCache";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: new Date().toISOString().split('T')[0]
  });

  const [form, setForm] = useState({
    name: "",
    price: "",
    unit: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    price: "",
  });

  // --- Effect 1: Load products immediately (no dependency on profile) ---
  // Uses stale-while-revalidate: cached data shows instantly, fresh data replaces it.
  useEffect(() => {
    const stale = getCached('products');
    if (stale) {
      setProducts(stale);
      setLoading(false); // Show stale data without spinner
    }

    getProducts()
      .then(res => {
        setProducts(res.data);
        setCached('products', res.data);
        setLoading(false);
      })
      .catch(() => {
        if (!stale) toast.error("Failed to load products");
        setLoading(false);
      });
  }, []);

  // --- Effect 2: Load profile to get shop's createdAt (sets analytics date range) ---
  // Runs in parallel with Effect 1 — products are NOT blocked by this.
  useEffect(() => {
    getProfile()
      .then(res => {
        if (res.data?.createdAt) {
          setDateRange(prev => ({
            ...prev,
            startDate: new Date(res.data.createdAt).toISOString().split('T')[0]
          }));
        }
      })
      .catch(() => {
        // If profile fails, leave dateRange as-is; analytics won't fire (startDate is empty)
      });
  }, []);

  // --- Effect 3: Load/reload analytics whenever the date range changes ---
  // Triggered by: (a) profile setting startDate on mount, (b) user changing date inputs.
  useEffect(() => {
    if (!dateRange.startDate) return;
    getTopSellingProducts({ fromDate: dateRange.startDate, toDate: dateRange.endDate })
      .then(res => setAnalyticsData(res.data))
      .catch(() => console.warn("Analytics failed to load"));
  }, [dateRange]);

  // Shared reload helper for after mutations (add/edit/delete product)
  const reloadProducts = () => {
    invalidateCache('products');
    getProducts()
      .then(res => {
        setProducts(res.data);
        setCached('products', res.data);
      })
      .catch(() => toast.error("Failed to reload products"));
  };

  const handleAdd = async () => {
    if (!form.name || !form.price) return toast.error("Name and Price are required");

    try {
      await createProduct({ ...form, stock: 0, purchasePrice: 0 });
      toast.success("Product added successfully!");
      window.dispatchEvent(new Event("stock-changed"));
      setForm({ name: "", price: "", unit: "" });
      reloadProducts();
    } catch (error) {
      toast.error("Failed to add product");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setEditForm({
      price: product.price,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ price: "" });
  };

  const handleUpdate = async (id) => {
    try {
      await updateProduct(id, editForm);
      toast.success("Product updated successfully");
      window.dispatchEvent(new Event("stock-changed"));
      setEditingId(null);
      reloadProducts();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      toast.success("Product deleted successfully");
      window.dispatchEvent(new Event("stock-changed"));
      reloadProducts();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product");
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  const topSellingProducts = analyticsData.slice(0, 10);
  const topRevenueProducts = [...analyticsData].sort((a, b) => b.revenue - a.revenue).slice(0, 10);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Products Inventory</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your product catalog and stock levels</p>
      </div>

      <div className="grid lg:grid-cols-[350px_1fr] gap-8 items-start">

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md shadow-gray-200/50 dark:shadow-none border border-gray-200 dark:border-gray-700 p-6 lg:sticky lg:top-24 h-fit">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-purple-50 dark:border-gray-700">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Plus size={20} />
            </div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Add New Product</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Product Name</label>
              <div className="relative">
                <Package size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  placeholder="e.g. Wireless Mouse"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Selling Price</label>
              <div className="relative">
                <IndianRupee size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  placeholder="0.00"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-purple-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Unit</label>
              <input
                placeholder="e.g. pcs, kg, box"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-purple-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            <button
              className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-md shadow-indigo-500/20 transition-all active:scale-[0.98]"
              onClick={handleAdd}
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-gray-500 dark:text-gray-400 font-medium">Current Inventory ({filteredProducts.length})</h3>
              <div className="relative w-full sm:w-auto">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              <AnimatePresence>
                {filteredProducts.map((p) => (
                  <motion.div
                    key={p._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md shadow-gray-200/50 dark:shadow-none border ${editingId === p._id ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-gray-200 dark:border-gray-700'} flex flex-col gap-3 transition-all group relative`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                        <Package size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white truncate" title={p.name}>{p.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          ID: {p._id.slice(-6)}
                        </p>
                      </div>
                    </div>

                    {editingId === p._id ? (
                      <div className="space-y-2 mt-2">
                        <div className="grid grid-cols-1 gap-2">
                          <div>
                            <label className="text-[10px] text-gray-500 uppercase font-bold">Price</label>
                            <input
                              type="number"
                              value={editForm.price}
                              onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                              className="w-full px-2 py-1 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-indigo-500 outline-none"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleUpdate(p._id)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1.5 rounded text-xs font-medium flex items-center justify-center gap-1"
                          >
                            <Check size={14} /> Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-1.5 rounded text-xs font-medium flex items-center justify-center gap-1"
                          >
                            <X size={14} /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100 dark:border-gray-700/50">
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                              In Stock:({p.stock}) Per Pack:({p.unit || 'units'})
                            </span>
                          </div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            ₹{p.price}
                          </div>
                        </div>

                        <div className="absolute top-2 right-2 flex gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-1 rounded-lg">
                          <button
                            onClick={() => handleEdit(p)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && (
                <div className="col-span-full flex justify-center py-16">
                  <LoadingSpinner size="md" label="Loading products..." />
                </div>
              )}

              {!loading && filteredProducts.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-center">
                  <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4 text-gray-400">
                    <Package size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No products found</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                    Your inventory is currently empty. Add your first product using the form on the left.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-8">
            {/* Bar Chart */}
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                    <BarChart3 size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Top Selling Products</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Based on units sold in date range</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase font-bold text-gray-500">From</label>
                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                      className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] uppercase font-bold text-gray-500">To</label>
                    <input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                      className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {topSellingProducts.length > 0 ? (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topSellingProducts}
                      margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                        itemStyle={{ color: '#fff' }}
                        cursor={{ fill: 'transparent' }}
                      />
                      <Bar dataKey="sold" name="Units Sold" fill="url(#colorSold)" radius={[4, 4, 0, 0]}>
                        <defs>
                          <linearGradient id="colorSold" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2} />
                          </linearGradient>
                        </defs>
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-100 dark:border-gray-700">
                  <BarChart3 size={32} className="mb-2 opacity-50" />
                  <p className="text-sm">No sales data available yet.</p>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                    <PieChartIcon size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Revenue Distribution</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Top 10 Products by Revenue (Sold × Price)</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Total Revenue</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      {(() => {
                        const totalRevenue = analyticsData.reduce((sum, item) => sum + (item.revenue || 0), 0);
                        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalRevenue);
                      })()}
                    </p>
                  </div>
                </div>
              </div>

              {topRevenueProducts.length > 0 ? (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <defs>
                        <filter id="shadow" height="200%">
                          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#000" floodOpacity="0.2" />
                        </filter>
                      </defs>
                      <Pie
                        data={topRevenueProducts}
                        cx="50%"
                        cy="50%"
                        labelLine={false} // Clean look
                        outerRadius={100}
                        fill="#8884d8"
                        stroke="none"
                        dataKey="revenue"
                        nameKey="name"
                        style={{ filter: "url(#shadow)" }}
                        label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                          const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                          const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                          const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

                          // Only show label if slice is > 5%
                          if (percent < 0.05) return null;

                          return (
                            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
                              {`${(percent * 100).toFixed(0)}%`}
                            </text>
                          );
                        }}
                      >
                        {topRevenueProducts.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value)}
                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-100 dark:border-gray-700">
                  <PieChartIcon size={32} className="mb-2 opacity-50" />
                  <p className="text-sm">No sales data available yet.</p>
                  <p className="text-xs text-gray-400 mt-1">Create invoices to see revenue distribution</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
