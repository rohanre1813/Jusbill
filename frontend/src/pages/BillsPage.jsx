import { useEffect, useState } from "react";
import { getInvoices, updateInvoiceStatus, deleteInvoice, sendSalesReport, sendInvoiceEmail } from "../api/invoice.api";
import { getProfile } from "../api/user.api";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, Calendar, User, Download, CheckCircle, XCircle, Trash2, Bell, Filter } from "lucide-react";
import toast from "react-hot-toast";
import { generateInvoicePDF } from "../utils/pdfGenerator";
import LoadingSpinner from "../components/LoadingSpinner";
import { getCached, setCached, invalidateCache } from "../utils/dataCache";

export default function BillsPage() {
  const [allInvoices, setAllInvoices] = useState([]);
  const [stats, setStats] = useState({ totalSales: 0, totalReceived: 0, totalPending: 0 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: new Date().toISOString().split('T')[0]
  });

  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getProfile();
      setUserProfile(res.data);
      if (res.data?.createdAt) {
        setDateRange(prev => ({
          ...prev,
          startDate: new Date(res.data.createdAt).toISOString().split('T')[0]
        }));
      }
    } catch (error) {
      console.error("Failed to load shop profile");
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    // Stale-while-revalidate: show cached data instantly, then refresh
    const stale = getCached('invoices');
    if (stale) {
      setAllInvoices(stale.invoices);
      setStats(stale.stats);
      // Don't show spinner if we have something to display
    } else {
      setLoading(true);
    }

    try {
      const res = await getInvoices();
      setAllInvoices(res.data.invoices);
      setStats(res.data.stats);
      setCached('invoices', res.data);
    } catch (error) {
      if (!stale) toast.error("Failed to fetch bills");
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = allInvoices.filter(invoice => {
    const matchSearch = (invoice.invoiceId && invoice.invoiceId.toLowerCase().includes(search.toLowerCase())) ||
      (invoice.customerName && invoice.customerName.toLowerCase().includes(search.toLowerCase()));

    const invDate = new Date(invoice.createdAt);
    const start = new Date(dateRange.startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(dateRange.endDate);
    end.setHours(23, 59, 59, 999);

    return matchSearch && invDate >= start && invDate <= end;
  });

  const handleStatusToggle = async (invoice) => {
    const newStatus = invoice.paymentStatus === "Paid" ? "Unpaid" : "Paid";

    // Optimistic Update
    setAllInvoices(prev => prev.map(inv =>
      inv._id === invoice._id ? { ...inv, paymentStatus: newStatus } : inv
    ));
    invalidateCache('invoices'); // keep client cache in sync

    try {
      await updateInvoiceStatus(invoice._id, newStatus);
      toast.success(`Invoice marked as ${newStatus}`);
    } catch (error) {
      // Revert on failure
      setAllInvoices(prev => prev.map(inv =>
        inv._id === invoice._id ? { ...inv, paymentStatus: invoice.paymentStatus } : inv
      ));
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this invoice? This action cannot be undone.")) return;

    try {
      await deleteInvoice(id);
      setAllInvoices(prev => prev.filter(inv => inv._id !== id));
      invalidateCache('invoices'); // keep client cache in sync
      toast.success("Invoice deleted successfully");
    } catch (error) {
      toast.error("Failed to delete invoice");
    }
  };

  const handleDownload = (invoice) => {
    if (!userProfile) return toast.error("Profile data missing, cannot generate PDF");

    const invoiceData = {
      ...invoice,
      companyName: userProfile.companyName,
      companyAddress: userProfile.address,
      companyMobile: userProfile.mobile,
      companyEmail: userProfile.email,
      companyGstin: userProfile.gstin,
      companyImage: userProfile.profileImage,
      qrCode: userProfile.qrCode,
      companyBankName: userProfile.bankName,
      companyBankAccount: userProfile.bankAccount,
      companyIfscCode: userProfile.ifscCode,
    };

    generateInvoicePDF(invoiceData, "download");
  };

  const totalSales = stats.totalSales;
  const totalReceived = stats.totalReceived;
  const totalPending = stats.totalPending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bills & Invoices</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage invoices and track sales</p>
        </div>


        <div className="flex flex-col sm:flex-row gap-3 items-end sm:items-center bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <label className="text-[10px] uppercase font-bold text-gray-500">From</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] uppercase font-bold text-gray-500">To</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            onClick={async () => {
              setClearing(true);
              try {
                await sendSalesReport({
                  fromDate: dateRange.startDate,
                  toDate: dateRange.endDate
                });
                toast.success("Sales report emailed!");
              } catch (error) {
                toast.error("Failed to generate report.");
                console.error(error);
              } finally {
                setClearing(false);
              }
            }}
            disabled={clearing || filteredInvoices.length === 0}
            className="h-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2 disabled:opacity-50 disabled:shadow-none whitespace-nowrap"
          >
            {clearing ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </span>
            ) : (
              <>
                <FileText size={18} /> Send Report
              </>
            )}
          </button>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sales (Selected Period)</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
              ₹{totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {filteredInvoices.length} invoices found
            </p>
          </div>
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <FileText size={48} className="text-indigo-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-green-200 dark:border-green-900/50 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-sm font-medium text-green-600 dark:text-green-400">Received (Selected Period)</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-500 mt-1">
              ₹{totalReceived.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <CheckCircle size={48} className="text-green-600" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-red-200 dark:border-red-900/50 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-sm font-medium text-red-600 dark:text-red-400">Pending (Selected Period)</p>
            <p className={`text-3xl font-bold mt-1 ${totalPending > 0 ? 'text-red-700 dark:text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
              ₹{totalPending.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <XCircle size={48} className="text-red-600" />
          </div>
        </div>
      </div>


      <div className="relative w-full md:max-w-md">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by Invoice ID or Customer Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-purple-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all"
        />
      </div>


      <div className="grid gap-4">
        <AnimatePresence>
          {filteredInvoices.map((invoice) => (
            <motion.div
              key={invoice._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-purple-300 dark:border-gray-700 hover:shadow-md transition-all group"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {invoice.invoiceId || "INV-PENDING"}
                        <button
                          onClick={() => {
                            if (invoice.paymentStatus === "Paid") {
                              toast.error("Paid invoices cannot be reverted.");
                              return;
                            }
                            handleStatusToggle(invoice);
                          }}
                          disabled={invoice.paymentStatus === "Paid"}
                          className={`text-xs font-medium px-2.5 py-0.5 rounded-full border flex items-center gap-1 transition-all active:scale-95 ${invoice.paymentStatus === "Paid"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 cursor-not-allowed opacity-80"
                            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-200 dark:hover:bg-red-900/50 cursor-pointer"
                            }`}
                          title={invoice.paymentStatus === "Paid" ? "Paid (Locked)" : "Click to mark as Paid"}
                        >
                          {invoice.paymentStatus === "Paid" ? <CheckCircle size={10} /> : <XCircle size={10} />}
                          {invoice.paymentStatus || "Unpaid"}
                        </button>
                        {invoice.paymentStatus !== "Paid" && (
                          <button
                            onClick={() => handleDelete(invoice._id)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ml-2"
                            title="Delete Invoice"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(invoice.createdAt).toLocaleDateString()} at {new Date(invoice.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto justify-between md:justify-end">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <User size={16} className="text-gray-400" />
                    <span className="font-medium truncate max-w-[120px] sm:max-w-none">{invoice.customerName}</span>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">₹{invoice.grandTotal.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {invoice.paymentStatus !== "Paid" && (
                      <button
                        onClick={async () => {
                          if (!userProfile) return toast.error("Profile data missing, cannot send reminder");

                          const customerEmail = invoice.customerEmail || invoice.email;
                          if (!customerEmail) return toast.error("Customer email not found for this invoice.");

                          const toastId = toast.loading("Sending Reminder...");
                          try {
                            const invoiceData = {
                              ...invoice,
                              companyName: userProfile.companyName,
                              companyAddress: userProfile.address,
                              companyMobile: userProfile.mobile,
                              companyEmail: userProfile.email,
                              companyGstin: userProfile.gstin,
                              companyImage: userProfile.profileImage,
                              qrCode: userProfile.qrCode,
                              companyBankName: userProfile.bankName,
                              companyBankAccount: userProfile.bankAccount,
                              companyIfscCode: userProfile.ifscCode,
                            };

                            const pdfBase64 = await generateInvoicePDF(invoiceData, "base64");
                            const base64Data = pdfBase64.split(',')[1];

                            await sendInvoiceEmail({
                              email: customerEmail,
                              customerName: invoice.customerName,
                              invoiceId: invoice.invoiceId,
                              pdfBuffer: base64Data,
                              type: "Reminder"
                            });

                            toast.success("Reminder sent successfully", { id: toastId });
                          } catch (error) {
                            console.error(error);
                            toast.error("Failed to send reminder.", { id: toastId });
                          }
                        }}
                        className="p-2 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                        title="Send Payment Reminder"
                      >
                        <Bell size={20} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDownload(invoice)}
                      className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Download Invoice"
                    >
                      <Download size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>


        {!loading && filteredInvoices.length === 0 && (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <Filter size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No invoices found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your date range or search filters.</p>
          </div>
        )}

        {loading && (
          <div className="py-16 flex justify-center">
            <LoadingSpinner size="md" label="Loading bills..." />
          </div>
        )}
      </div>
    </motion.div>
  );
}
