import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Search, User, Phone, MapPin, FileText, Mail, Pencil, X, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { addCustomer, getCustomers, updateCustomer, deleteCustomer } from "../api/customer.api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const fetchCustomers = async (query = "") => {
    setLoading(true);
    try {
      const res = await getCustomers(query);
      setCustomers(res.data);
    } catch (error) {
      console.error("Failed to fetch customers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(search.toLowerCase()) ||
    customer.mobile.includes(search) ||
    (customer.email && customer.email.toLowerCase().includes(search.toLowerCase()))
  );

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await updateCustomer(editingId, data);
        toast.success("Customer updated successfully");
        setEditingId(null);
      } else {
        await addCustomer(data);
        toast.success("Customer added successfully");
      }
      reset();
      fetchCustomers();
    } catch (error) {
      toast.error(error.response?.data?.msg || "Operation failed");
    }
  };

  const startEdit = (customer) => {
    setEditingId(customer._id);
    setValue("name", customer.name);
    setValue("mobile", customer.mobile);
    setValue("email", customer.email);
    setValue("address", customer.address);
    setValue("gstin", customer.gstin);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    reset();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await deleteCustomer(id);
      toast.success("Customer deleted successfully");
      fetchCustomers();
    } catch (error) {
      toast.error("Failed to delete customer");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Customers</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your client details</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-20 dark:bg-gray-800 rounded-2xl shadow-md shadow-gray-200/50 dark:shadow-none border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            {editingId ? <Pencil className="text-indigo-600" size={24} /> : <Plus className="text-indigo-600" size={24} />}
            {editingId ? "Edit Customer" : "Add New Customer"}
          </h2>
          {editingId && (
            <button onClick={cancelEdit} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <X size={24} />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                {...register("name", { required: true })}
                className="w-full pl-10 h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Customer Name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mobile No *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                {...register("mobile", { required: true })}
                className="w-full pl-10 h-10 rounded-lg border border-purple-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Mobile Number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                {...register("email")}
                type="email"
                className="w-full pl-10 h-10 rounded-lg border border-purple-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Email Address"
              />
            </div>
          </div>

          <div className="space-y-2 lg:col-span-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                {...register("address")}
                className="w-full pl-10 h-10 rounded-lg border border-purple-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Full Address"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">GSTIN</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                {...register("gstin", {
                  pattern: {
                    value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                    message: "Invalid GSTIN format"
                  }
                })}
                className="w-full pl-10 h-10 rounded-lg border border-purple-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="GSTIN Number"
              />
            </div>
            {errors.gstin && <span className="text-xs text-red-500 ml-1">{errors.gstin.message}</span>}
          </div>

          <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-3">
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-6 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {editingId ? <Pencil size={18} /> : <Plus size={18} />}
              {editingId ? "Update Customer" : "Add Customer"}
            </button>
          </div>
        </form>
      </motion.div>

      <div className="space-y-6">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((customer) => (
            <motion.div
              key={customer._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-20 dark:bg-gray-800 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md shadow-gray-200/50 dark:shadow-none hover:shadow-lg transition-all group relative"
            >
              <div className="absolute top-3 right-3 flex gap-1 bg-white dark:bg-gray-800 p-1 rounded-full shadow-sm lg:shadow-none lg:bg-transparent lg:opacity-0 lg:group-hover:opacity-100 transition-all">
                <button
                  onClick={() => startEdit(customer)}
                  className="p-2 text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full transition-all"
                  title="Edit Customer"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(customer._id)}
                  className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all"
                  title="Delete Customer"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{customer.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">ID: {customer._id.slice(-6)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" />
                  <span>{customer.mobile}</span>
                </div>
                {customer.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-400" />
                    <span>{customer.email}</span>
                  </div>
                )}
                {customer.address && (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" />
                    <span className="truncate">{customer.address}</span>
                  </div>
                )}
                {customer.gstin && (
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-gray-400" />
                    <span>{customer.gstin}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="md" label="Loading customers..." />
          </div>
        )}

        {filteredCustomers.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <User size={48} className="mx-auto mb-4 opacity-50" />
            <p>No customers found</p>
          </div>
        )}
      </div>
    </div>
  );
}
