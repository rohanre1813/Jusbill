import { useEffect, useState, useRef } from "react";
import { getProducts } from "../api/product.api";
import { getProfile } from "../api/user.api";
import { createInvoice, sendInvoiceEmail } from "../api/invoice.api";
import { getCustomers } from "../api/customer.api";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Save, Trash2, User, Phone, MapPin, Mail, FileText, X, Printer, Download, Percent, ChevronDown, Check, Send } from "lucide-react";
import toast from "react-hot-toast";
import { generateInvoicePDF } from "../utils/pdfGenerator";
import { createPortal } from "react-dom";

const ProductSelect = ({ products, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef(null);

  const selectedProduct = products.find((p) => p._id === value);

  const updatePosition = () => {
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
      });
    }
  };

  const handleFocus = () => {
    setSearchTerm(selectedProduct ? selectedProduct.name : "");
    updatePosition();
    setIsOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !event.target.closest('.product-dropdown-portal')) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };

    if (isOpen) {
      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleScroll);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isOpen]);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={isOpen ? searchTerm : (selectedProduct?.name || "")}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) {
              setIsOpen(true);
              updatePosition();
            }
          }}
          onFocus={handleFocus}
          onClick={() => { if (!isOpen) handleFocus(); }}
          placeholder="Select Product..."
          className={`w-full pl-3 pr-10 py-2 bg-gray-50 dark:bg-gray-900 border ${isOpen ? "border-indigo-500 ring-2 ring-indigo-500/20" : "border-gray-300 dark:border-gray-700"} rounded-lg outline-none transition-all cursor-text text-gray-900 dark:text-white placeholder-gray-400`}
        />
        <ChevronDown
          size={16}
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-transform pointer-events-none ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.1 }}
            style={{
              position: 'fixed',
              top: coords.top,
              left: coords.left,
              width: coords.width,
              zIndex: 9999
            }}
            className="product-dropdown-portal bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 max-h-60 overflow-y-auto overflow-hidden"
          >
            <div className="py-1">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <div
                    key={p._id}
                    onClick={() => {
                      onChange(p._id);
                      setIsOpen(false);
                      setSearchTerm(p.name);
                    }}
                    className={`px-3 py-2 cursor-pointer transition-colors flex justify-between items-center ${value === p._id
                      ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                      }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{p.name}</span>
                      <span className="text-[10px] text-gray-500">Stock: {p.stock}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono opacity-70">₹{p.price}</span>
                      {value === p._id && <Check size={14} />}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-sm text-gray-400">
                  No products found
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default function InvoicePage() {
  const [products, setProducts] = useState([]);
  const [rows, setRows] = useState([]);
  const [customer, setCustomer] = useState("");
  const [discount, setDiscount] = useState(0);
  const [gstRate, setGstRate] = useState(18);
  const [description, setDescription] = useState("");
  const [userProfile, setUserProfile] = useState(null);

  const [customerResults, setCustomerResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    loadProducts();
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getProfile();
      setUserProfile(res.data);
    } catch (error) {
      console.error("Failed to load profile");
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (customer.trim() && !selectedCustomer) {
        setIsSearching(true);
        try {
          const res = await getCustomers(customer);
          setCustomerResults(res.data);
          setShowResults(true);
        } catch (error) {
          console.error("Failed to search customers");
        } finally {
          setIsSearching(false);
        }
      } else {
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [customer, selectedCustomer]);

  const selectCustomer = (c) => {
    setCustomer(c.name);
    setSelectedCustomer(c);
    setShowResults(false);
  };

  const clearCustomer = () => {
    setCustomer("");
    setSelectedCustomer(null);
    setCustomerResults([]);
  };

  const loadProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (error) {
      toast.error("Failed to load products");
    }
  };

  const addRow = () => {
    setRows([...rows, { productId: "", price: 0, qty: 1, total: 0 }]);
  };

  const removeRow = (index) => {
    const copy = [...rows];
    copy.splice(index, 1);
    setRows(copy);
  };

  const handleProduct = (i, id) => {
    const p = products.find((x) => x._id === id);
    if (!p) return;
    const copy = [...rows];
    copy[i] = { productId: id, price: p.price, qty: 1, total: p.price };
    setRows(copy);
  };

  const handleQty = (i, qty) => {
    const copy = [...rows];
    const val = qty === "" ? "" : Number(qty);
    copy[i].qty = val;
    copy[i].total = copy[i].price * (Number(val) || 0);
    setRows(copy);
  };

  let subtotal = 0;
  for (const r of rows) subtotal += r.total;
  const discountAmount = subtotal * (discount / 100);
  const subtotalAfterDiscount = subtotal - discountAmount;
  const gst = subtotalAfterDiscount * (gstRate / 100);
  const grandTotal = subtotalAfterDiscount + gst;

  const submit = async () => {
    if (!customer) return toast.error("Please enter customer name");
    if (rows.length === 0) return toast.error("Please add at least one item");

    try {
      const res = await createInvoice({
        customerName: customer,
        customerEmail: selectedCustomer?.email,
        customerAddress: selectedCustomer?.address,
        customerMobile: selectedCustomer?.mobile,
        customerGstin: selectedCustomer?.gstin,
        customerState: selectedCustomer?.state,
        description,
        items: rows.map((r) => ({ productId: r.productId, qty: r.qty })),
        discount,
        gstRate,
      });

      toast.success(`Invoice Saved: ${res.data.invoiceId}`);
      setRows([]);
      setCustomer("");
      setDiscount(0);
      setDescription("");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save invoice");
      return null;
    }
  };

  const getInvoiceData = () => ({
    customerName: customer,
    customerMobile: selectedCustomer?.mobile,
    customerAddress: selectedCustomer?.address,
    customerGstin: selectedCustomer?.gstin,
    description,
    items: rows.map(r => ({
      name: products.find(p => p._id === r.productId)?.name || "Unknown",
      price: r.price,
      qty: r.qty
    })),
    subtotal,
    discount,
    discountAmount,
    gstRate,
    gst,
    grandTotal,
    companyName: userProfile?.companyName,
    companyAddress: userProfile?.address,
    companyMobile: userProfile?.mobile,
    companyEmail: userProfile?.email,
    companyGstin: userProfile?.gstin,
    companyImage: userProfile?.profileImage,
    qrCode: userProfile?.qrCode,
    companyState: userProfile?.state,
    companyBankName: userProfile?.bankName,
    companyBankAccount: userProfile?.bankAccount,
    companyIfscCode: userProfile?.ifscCode
  });

  const handleConfirmAction = async () => {
    setShowConfirm(false);
    if (!pendingAction) return;

    if (pendingAction.type === "save") {
      await submit();
    } else if (pendingAction.type === "send") {
      const toastId = toast.loading("Processing...");
      try {
        const invoiceData = getInvoiceData();
        const savedInvoice = await submit();
        if (!savedInvoice) {
          toast.error("Failed to save invoice", { id: toastId });
          return;
        }
        invoiceData.invoiceId = savedInvoice.invoiceId;
        const pdfBase64 = await generateInvoicePDF(invoiceData, "base64");
        const base64Data = pdfBase64.split(',')[1];
        await sendInvoiceEmail({
          email: selectedCustomer.email,
          customerName: invoiceData.customerName,
          invoiceId: savedInvoice.invoiceId,
          pdfBuffer: base64Data
        });
        toast.success(`Invoice sent to ${selectedCustomer.email}`, { id: toastId });
      } catch (error) {
        toast.error("Failed to send email", { id: toastId });
      }
    }
    setPendingAction(null);
  };

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Invoice</h1>
        <div className="grid grid-cols-2 md:flex gap-2 w-full lg:w-auto">
          <button
            onClick={() => {
              if (!customer || rows.length === 0) return toast.error("Please select a customer and add items");
              generateInvoicePDF(getInvoiceData(), "print");
            }}
            disabled={!customer || rows.length === 0}
            className="p-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            title="Print"
          >
            <Printer size={20} />
          </button>
          <button
            onClick={() => {
              if (!customer || rows.length === 0) return toast.error("Please select a customer and add items");
              generateInvoicePDF(getInvoiceData(), "download");
            }}
            disabled={!customer || rows.length === 0}
            className="p-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            title="Download"
          >
            <Download size={20} />
          </button>

          <button
            onClick={async () => {
              if (!customer || rows.length === 0) return toast.error("Please select a customer and add items");
              const toastId = toast.loading("Sending Estimate...");
              try {
                const invoiceData = getInvoiceData();
                const pdfBase64 = await generateInvoicePDF(invoiceData, "base64", "Estimate");
                const base64Data = pdfBase64.split(',')[1];
                await sendInvoiceEmail({
                  email: selectedCustomer.email,
                  customerName: invoiceData.customerName,
                  invoiceId: "EST-DRAFT",
                  pdfBuffer: base64Data,
                  type: "Estimate"
                });
                toast.success(`Estimate sent to ${selectedCustomer.email}`, { id: toastId });
              } catch (error) {
                toast.error("Failed to send estimate", { id: toastId });
              }
            }}
            disabled={!customer || rows.length === 0 || !selectedCustomer?.email}
            className="col-span-2 md:col-span-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            title={!selectedCustomer?.email ? "Customer email required" : "Send Quote/Estimate (No Save)"}
          >
            <Send size={18} />
            <span className="whitespace-nowrap">Send Estimate</span>
          </button>

          <button
            onClick={() => {
              if (!customer || rows.length === 0) return toast.error("Please select a customer and add items");
              setPendingAction({ type: "send" });
              setShowConfirm(true);
            }}
            disabled={!customer || rows.length === 0 || !selectedCustomer?.email}
            className="col-span-2 md:col-span-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            title={!selectedCustomer?.email ? "Customer email required" : "Save & Email Invoice"}
          >
            <Send size={18} />
            <span className="whitespace-nowrap">Send Invoice</span>
          </button>

          <button
            onClick={() => {
              if (!customer || rows.length === 0) return toast.error("Please select a customer and add items");
              setPendingAction({ type: "save" });
              setShowConfirm(true);
            }}
            disabled={!customer || rows.length === 0}
            className="col-span-2 md:col-span-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            <span className="whitespace-nowrap">Save Only</span>
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md shadow-gray-200/50 dark:shadow-none border border-gray-200 dark:border-gray-700 p-4 sm:p-6 z-20 relative">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Customer Details</label>
            {selectedCustomer && (
              <button onClick={clearCustomer} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1">
                <X size={14} /> Clear
              </button>
            )}
          </div>

          <div className="relative">
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                placeholder="Search customer by name or mobile..."
                value={customer}
                onChange={(e) => {
                  setCustomer(e.target.value);
                  if (selectedCustomer && e.target.value !== selectedCustomer.name) setSelectedCustomer(null);
                }}
                className="w-full text-base md:text-lg pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
              {isSearching && (
                <div className="absolute right-3 top-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                </div>
              )}
            </div>

            <AnimatePresence>
              {showResults && customerResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 max-h-60 overflow-y-auto z-50"
                >
                  {customerResults.map((c) => (
                    <div
                      key={c._id}
                      onClick={() => selectCustomer(c)}
                      className="p-3 hover:bg-purple-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-50 dark:border-gray-700 last:border-0 flex justify-between items-center"
                    >
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{c.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                          <Phone size={12} /> {c.mobile}
                        </div>
                      </div>
                      <div className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded">Select</div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {selectedCustomer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Phone size={16} className="text-indigo-500" />
                  <span>{selectedCustomer.mobile}</span>
                </div>
                {selectedCustomer.email && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Mail size={16} className="text-indigo-500" />
                    <span>{selectedCustomer.email}</span>
                  </div>
                )}
                {selectedCustomer.address && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <MapPin size={16} className="text-indigo-500" />
                    <span className="truncate">{selectedCustomer.address}</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md shadow-gray-200/50 dark:shadow-none border border-gray-200 dark:border-gray-700 p-4 sm:p-6 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Items</h3>
            <button
              onClick={addRow}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus size={16} /> Add Item
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b-2 border-gray-100 dark:border-gray-700">
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-3 min-w-[180px]">Product</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-3 min-w-[80px]">Price</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-3 min-w-[60px]">Qty</th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider pb-3 min-w-[80px]">Total</th>
                  <th className="pb-3 w-[5%]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                <AnimatePresence>
                  {rows.map((r, i) => (
                    <motion.tr key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                      <td className="py-4 pr-4">
                        <ProductSelect products={products} value={r.productId} onChange={(val) => handleProduct(i, val)} />
                      </td>
                      <td className="py-4 pr-4 font-mono text-gray-600 dark:text-gray-300">₹{r.price}</td>
                      <td className="py-4 pr-4">
                        <input
                          type="number"
                          min="1"
                          placeholder="1"
                          value={r.qty || ""}
                          onChange={(e) => handleQty(i, e.target.value)}
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </td>
                      <td className="py-4 pr-4 font-mono font-bold text-gray-900 dark:text-white">₹{r.total}</td>
                      <td className="py-4 text-right">
                        <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" onClick={() => removeRow(i)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-gray-400 dark:text-gray-500 italic">No items added yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md shadow-gray-200/50 dark:shadow-none border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Invoice Description (Optional)</label>
          <textarea
            placeholder="Enter additional details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-24 resize-none"
          />
        </div>

        <div className="flex justify-end w-full">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md shadow-gray-200/50 dark:shadow-none border border-gray-200 dark:border-gray-700 p-4 sm:p-6 w-full md:max-w-sm">
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span className="font-mono">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1"><Percent size={14} /> Discount (%)</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discount || ""}
                  onChange={(e) => setDiscount(e.target.value === "" ? 0 : Number(e.target.value))}
                  className="w-20 px-2 py-1 text-right bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400 text-sm">
                  <span>Discount Amount</span>
                  <span className="font-mono">- ₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">GST (%)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={gstRate || ""}
                    onChange={(e) => setGstRate(e.target.value === "" ? 0 : Number(e.target.value))}
                    className="w-16 px-2 py-1 text-right bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                  <span className="font-mono min-w-[80px] text-right">₹{gst.toFixed(2)}</span>
                </div>
              </div>
              <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />
              <div className="flex justify-between text-xl font-bold text-indigo-600 dark:text-indigo-400">
                <span>Total</span>
                <span className="font-mono">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 max-w-sm w-full"
            >
              <div className="flex items-center gap-3 text-amber-500 mb-4">
                <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <FileText size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Confirm Invoice</h3>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium">
                Are you sure you want to {pendingAction?.type === 'send' ? 'save and send' : 'save'} this invoice?
                <span className="block mt-2 text-sm text-red-500 font-bold">⚠️ Changes cannot be undone once saved.</span>
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    setPendingAction(null);
                  }}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAction}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
