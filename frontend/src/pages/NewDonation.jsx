import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function NewDonation() {
  const { user, token } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    title: "",
    clothesType: "children",
    quantity: 1,
    address: "",
    city: "",
    pincode: "",
    phone: "",
    pickupDate: "",
    message: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateInputs = () => {
    let tempErrors = {};
    if (!/^[0-9]{6}$/.test(formData.pincode)) tempErrors.pincode = "Pincode must be a 6-digit number.";
    if (!/^[0-9]{10}$/.test(formData.phone)) tempErrors.phone = "Phone number must be a 10-digit number.";
    if (!formData.title.trim()) tempErrors.title = "Title is required.";
    if (!formData.address.trim()) tempErrors.address = "Address is required.";
    if (!formData.city.trim()) tempErrors.city = "City is required.";
    if (new Date(formData.pickupDate) < new Date()) tempErrors.pickupDate = "Pickup date must be in the future.";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setLoading(true);
    setSuccess(false);

    try {
      await axios.post("/api/donations", { ...formData, donor: user._id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setErrors({ api: err.response?.data?.message || "Failed to create donation." });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      clothesType: "children",
      quantity: 1,
      address: "",
      city: "",
      pincode: "",
      phone: "",
      pickupDate: "",
      message: ""
    });
    setErrors({});
    setSuccess(false);
    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-yellow-500 mb-6 text-center">Create a New Donation</h2>
        
        {errors.api && <div className="bg-red-500 text-white p-2 rounded mb-4">{errors.api}</div>}
        {success && <div className="bg-green-500 text-white p-2 rounded mb-4">Donation created successfully! Redirecting...</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[{ name: "title", label: "Donation Title", type: "text", placeholder: "E.g., Winter Clothes for Kids" },
              { name: "address", label: "Address", type: "text" },
              { name: "city", label: "City", type: "text" },
              { name: "pincode", label: "Pincode", type: "text" },
              { name: "phone", label: "Phone Number", type: "text", placeholder: "E.g., 9876543210" },
              { name: "pickupDate", label: "Pickup Date", type: "date" },
              { name: "quantity", label: "Quantity", type: "number", placeholder: "E.g., 5" },
              { name: "message", label: "Any Message for Us", type: "text", placeholder: "E.g., Please ensure pickup before 5 PM." }
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-bold mb-1">{label}</label>
                <input 
                  type={type} 
                  name={name} 
                  value={formData[name]} 
                  onChange={handleChange} 
                  placeholder={placeholder} 
                  className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:ring-2 focus:ring-yellow-500"
                  required
                />
                {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name]}</p>}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Clothes Type</label>
            <select name="clothesType" value={formData.clothesType} onChange={handleChange} 
              className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white focus:ring-2 focus:ring-yellow-500">
              <option value="children">Children</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
            </select>
          </div>

          <div className="flex justify-between mt-6">
            <button type="button" onClick={() => setShowResetConfirm(true)} className="bg-red-600 px-4 py-2 rounded shadow hover:bg-red-700">
              Reset
            </button>
            <button type="submit" className="bg-yellow-500 px-6 py-2 rounded shadow text-black font-bold hover:bg-yellow-600" disabled={loading}>
              {loading ? "Submitting..." : "Submit Donation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewDonation;
