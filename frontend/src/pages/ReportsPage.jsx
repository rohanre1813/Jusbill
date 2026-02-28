
import { useEffect, useState, useRef } from "react";
import { getProducts } from "../api/product.api";
import { createPurchase } from "../api/purchase.api";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Trash2, Save, FileText, ShoppingCart, Calendar, Check, X, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { getPurchases, deletePurchase, sendPurchaseReport } from "../api/purchase.api";
import { getProfile } from "../api/user.api";
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
          onClick={() => {
            if (!isOpen) handleFocus();
          }}
          placeholder="Select Product..."
          className={`w-full pl-3 pr-10 py-2 bg-gray-50 dark:bg-gray-900 border ${isOpen ? "border-indigo-500 ring-2 ring-indigo-500/20" : "border-gray-300 dark:border-gray-700"
            } rounded-lg outline-none transition-all cursor-text text-gray-900 dark:text-white placeholder-gray-400`}
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

export default function ReportsPage() {
  const [products, setProducts] = useState([]);
  const [rows, setRows] = useState([]);
  const [supplierName, setSupplierName] = useState("");
  const [loading, setLoading] = useState(true);
  const [purchaseHistory, setPurchaseHistory] = useState([]);

  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [prodRes, purRes, profileRes] = await Promise.all([
        getProducts(),
        getPurchases(),
        getProfile()
      ]);
      setProducts(prodRes.data);
      setPurchaseHistory(purRes.data);
      if (profileRes.data?.createdAt) {
        setDateRange(prev => ({
          ...prev,
          startDate: new Date(profileRes.data.createdAt).toISOString().split('T')[0]
        }));
      }
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const filteredPurchases = purchaseHistory.filter(p => {
    const pDate = new Date(p.createdAt);
    const start = new Date(dateRange.startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(dateRange.endDate);
    end.setHours(23, 59, 59, 999);

    return pDate >= start && pDate <= end;
  });

  const addRow = () => {
    setRows([
      ...rows,
      { productId: "", purchasePrice: "", qty: 1, total: 0 },
    ]);
  };

  const removeRow = (index) => {
    const copy = [...rows];
    copy.splice(index, 1);
    setRows(copy);
  };

  const handleProductChange = (i, id) => {
    const p = products.find((x) => x._id === id);
    if (!p) return;

    const copy = [...rows];
    // Pre-fill with last known purchase price if available, or current selling price as placeholder (or 0)
    // Ideally we want previous purchase price. Product model has purchasePrice now.
    const defaultPrice = p.purchasePrice || 0;

    copy[i] = {
      ...copy[i],
      productId: id,
      purchasePrice: defaultPrice,
      total: defaultPrice * (copy[i].qty || 1)
    };
    setRows(copy);
  };

  const handleChange = (i, field, value) => {
    const copy = [...rows];
    copy[i][field] = value;

    if (field === 'qty' || field === 'purchasePrice') {
      const qty = Number(copy[i].qty) || 0;
      const price = Number(copy[i].purchasePrice) || 0;
      copy[i].total = qty * price;
    }

    setRows(copy);
  };

  let totalAmount = 0;
  for (const row of rows) {
    totalAmount += (row.total || 0);
  }

  const handleSubmit = async () => {
    if (rows.length === 0) return toast.error("Please add at least one item");
    if (rows.some(r => !r.productId || !r.purchasePrice || !r.qty)) {
      return toast.error("Please fill all fields for items");
    }

    try {
      const payload = {
        supplierName,
        items: rows.map(r => {
          const p = products.find(prod => prod._id === r.productId);
          return {
            productId: r.productId,
            name: p?.name,
            purchasePrice: Number(r.purchasePrice),
            qty: Number(r.qty),
            total: Number(r.total)
          };
        }),
        totalAmount
      };

      await createPurchase(payload);
      toast.success("Purchase recorded successfully!");
      window.dispatchEvent(new Event("stock-changed"));

      // Reset
      setRows([]);
      setSupplierName("");
      loadData(); // Reload history and products (stock updated)

    } catch (error) {
      toast.error("Failed to save purchase");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this purchase record?")) return;
    try {
      await deletePurchase(id);
      toast.success("Purchase deleted");
      window.dispatchEvent(new Event("stock-changed"));
      loadData();
    } catch (error) {
      toast.error("Failed to delete purchase");
    }
  };

  const [clearing, setClearing] = useState(false);



  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Purchases</h1>
          <p className="text-gray-500 dark:text-gray-400">Track your inventory purchases and expenses</p>
        </div>
      </div>


      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <ShoppingCart className="text-indigo-500" />
            New Purchase Entry
          </h2>
          <div className="text-sm font-medium text-gray-500 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-600">
            Total: <span className="text-gray-900 dark:text-white font-bold ml-1">₹{totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Supplier Name (Optional)</label>
          <input
            placeholder="e.g. ABC Distributors"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="overflow-x-auto mb-6">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-3 w-[40%]">Product</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-3 w-[20%]">Bought Price</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-3 w-[15%]">Qty</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-3 w-[20%]">Total</th>
                <th className="pb-3 w-[5%]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {rows.map((row, index) => (
                <tr key={index}>
                  <td className="py-3 pr-3">
                    <ProductSelect
                      products={products}
                      value={row.productId}
                      onChange={(id) => handleProductChange(index, id)}
                    />
                  </td>
                  <td className="py-3 pr-3">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={row.purchasePrice}
                      onChange={(e) => handleChange(index, 'purchasePrice', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </td>
                  <td className="py-3 pr-3">
                    <input
                      type="number"
                      placeholder="1"
                      value={row.qty}
                      onChange={(e) => handleChange(index, 'qty', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </td>
                  <td className="py-3 pr-3 font-mono font-medium text-gray-900 dark:text-white">
                    ₹{row.total.toFixed(2)}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => removeRow(index)}
                      className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-400 italic">
                    No items added. Click "Add Item" to start.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex gap-3">
          <button
            onClick={addRow}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors"
          >
            <Plus size={18} /> Add Item
          </button>
          <button
            onClick={handleSubmit}
            disabled={rows.length === 0}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:shadow-none"
          >
            <Save size={18} /> Save Purchase
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="text-gray-400" />
            Recent Purchases
          </h3>

          <div className="flex flex-col sm:flex-row gap-3 items-end sm:items-center w-full md:w-auto">
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

            {purchaseHistory.length > 0 && (
              <button
                onClick={async () => {
                  setClearing(true);
                  try {
                    await sendPurchaseReport({
                      fromDate: dateRange.startDate,
                      toDate: dateRange.endDate
                    });
                    toast.success("Purchase report emailed!");
                  } catch (error) {
                    toast.error("Failed to generate report.");
                    console.error(error);
                  } finally {
                    setClearing(false);
                  }
                }}
                disabled={clearing || filteredPurchases.length === 0}
                className="h-full px-4 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30 dark:text-indigo-400 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50 whitespace-nowrap"
              >
                {clearing ? (
                  <span className="animate-spin w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full"></span>
                ) : (
                  <>
                    <FileText size={14} /> Send Report
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Items</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredPurchases.map((purchase) => (
                <tr key={purchase._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    {purchase.purchaseId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(purchase.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {purchase.supplierName || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {purchase.items.length} items
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-right text-gray-900 dark:text-white">
                    ₹{purchase.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(purchase._id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && purchaseHistory.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    No purchase history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
