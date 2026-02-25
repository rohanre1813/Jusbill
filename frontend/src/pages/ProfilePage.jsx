import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { getProfile, updateProfile } from "../api/user.api";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { User, Phone, MapPin, Building, FileText, Smartphone, Mail, Save, Image as ImageIcon, QrCode, Link2, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user } = useAuth();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewQr, setPreviewQr] = useState(null);
  const [copied, setCopied] = useState(false);

  const shareLink = user?.shopId ? `${window.location.origin}/shop/${user.shopId}` : "";

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getProfile();
      const data = res.data;
      setValue("companyName", data.companyName);
      setValue("mobile", data.mobile);
      setValue("secondaryMobile", data.secondaryMobile);
      setValue("address", data.address);
      setValue("state", data.state);
      setValue("email", data.email);
      setValue("gstin", data.gstin);
      setValue("bankName", data.bankName);
      setValue("bankAccount", data.bankAccount);
      setValue("ifscCode", data.ifscCode);

      if (data.profileImage) setPreviewImage(data.profileImage);
      if (data.qrCode) setPreviewQr(data.qrCode);
    } catch (error) {
      toast.error("Failed to load profile");
    }
  };

  const handleImageChange = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    if (profileImage) formData.append("profileImage", profileImage);
    if (qrCode) formData.append("qrCode", qrCode);

    try {
      await updateProfile(formData);
      toast.success("Profile Updated Successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
        <Building className="text-indigo-600" /> Shop Profile
      </h1>

      {shareLink && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Link2 size={18} className="text-indigo-600" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Share Your Inventory</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareLink}
              className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 select-all"
            />
            <button
              type="button"
              onClick={copyLink}
              className={`p-2.5 rounded-lg font-medium transition-all ${copied
                ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 hover:bg-indigo-200 dark:hover:bg-indigo-900/50"
                }`}
              title="Copy link"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">Share this link with customers so they can view your product catalog.</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Business Details</h2>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              <Building size={16} /> Company Name
            </label>
            <input
              {...register("companyName", { required: "Company Name is required" })}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. JusBill Solutions"
            />
            {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              <User size={16} /> Owner Name / Email (Read Only)
            </label>
            <input
              {...register("email")}
              disabled
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                <Phone size={16} /> Mobile
              </label>
              <input
                {...register("mobile", { required: "Mobile is required" })}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Primary Number"
              />
              {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>}
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                <Smartphone size={16} /> Sec. Mobile
              </label>
              <input
                {...register("secondaryMobile")}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Optional"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              <FileText size={16} /> GSTIN
            </label>
            <input
              {...register("gstin")}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Goods and Services Tax ID"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Location</h2>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                <MapPin size={16} /> Address
              </label>
              <textarea
                {...register("address")}
                rows={3}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                placeholder="Shop address..."
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                State
              </label>
              <input
                {...register("state")}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="State / Province"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Bank Details</h2>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                <Building size={16} /> Bank Name
              </label>
              <input
                {...register("bankName")}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. HDFC Bank"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  <FileText size={16} /> Account No.
                </label>
                <input
                  {...register("bankAccount")}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Account Number"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  <FileText size={16} /> IFSC Code
                </label>
                <input
                  {...register("ifscCode")}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none uppercase"
                  placeholder="IFSC Code"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Media</h2>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden border border-gray-200 flex items-center justify-center shrink-0">
                {previewImage ? (
                  <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="text-gray-400" />
                )}
              </div>
              <div className="flex-1 w-full text-center sm:text-left">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Photo</label>
                <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setProfileImage, setPreviewImage)} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 w-full sm:w-auto" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-20 h-20 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden border border-gray-200 flex items-center justify-center shrink-0">
                {previewQr ? (
                  <img src={previewQr} alt="QR" className="w-full h-full object-cover" />
                ) : (
                  <QrCode className="text-gray-400" />
                )}
              </div>
              <div className="flex-1 w-full text-center sm:text-left">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment QR Code</label>
                <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setQrCode, setPreviewQr)} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 w-full sm:w-auto" />
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={20} />
            )}
            Save Profile
          </button>
        </div>
      </form>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
          <Mail size={20} className="text-indigo-500" /> Contact Us
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Have questions or need help? Reach out to us anytime.
        </p>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">jusbill.contact@gmail.com</span>
          <a
            href="mailto:jusbill.contact@gmail.com"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all hover:-translate-y-0.5"
          >
            Send Email
          </a>
        </div>
      </div>
    </motion.div >
  );
}
