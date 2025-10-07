/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../reduxKit/store";
import { adminAddBannerAction } from "../../reduxKit/actions/admin/admin-banner";
import { clearMessage, resetBannerState } from "../../reduxKit/reducers/admin/admin-banner";
import toast from "react-hot-toast";

interface BannerFormData {
  heading: string;
  description: string;
  image: File | null;
}

const AddBanner = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, message } = useSelector((state: RootState) => state.banner || {});

  const [formData, setFormData] = useState<BannerFormData>({
    heading: "",
    description: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearMessage());
      setTimeout(() => navigate("/add-banner"), 1800);
    }
  }, [message, navigate, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(typeof error === "string" ? error : "An error occurred");
      dispatch(clearMessage());
    }
  }, [error, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetBannerState());
    };
  }, [dispatch]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, type, files } = e.target as any;
    
    if (type === "file") {
      const file = files && files[0] ? files[0] : null;
      setFormData((prev) => ({ ...prev, [name]: file }));
      
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview("");
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: e.target.value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.heading || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const formDataToSend = new FormData();
    
    formDataToSend.append("heading", formData.heading);
    formDataToSend.append("description", formData.description);
    
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }
    
    try {
      await dispatch(adminAddBannerAction(formDataToSend)).unwrap();
    } catch (error) {
      console.log("error is ", error);
    }
  };

  const handleCancel = () => navigate("/admin/banners");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-t-2xl shadow-lg p-5 border-b-4 border-cyan-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <svg className="w-7 h-7 mr-3 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Add New Banner
              </h1>
              <p className="text-gray-600 mt-1 text-sm">Create an engaging banner for your network</p>
            </div>
            <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-b-2xl shadow-lg p-6">
          {/* Banner Image Section */}
          <div className="mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-3 flex items-center border-b pb-2">
              <svg className="w-5 h-5 mr-2 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Banner Image
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Banner Image
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Recommended size: 1920x600px (JPG, PNG, GIF - Max 5MB)</p>
              </div>
              {imagePreview && (
                <div className="flex items-center justify-center">
                  <div className="relative w-full h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Banner Content Section */}
          <div className="mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-3 flex items-center border-b pb-2">
              <svg className="w-5 h-5 mr-2 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Banner Content
            </h2>

            {/* Heading */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heading <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="heading"
                value={formData.heading}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
                placeholder="e.g., Welcome to Take-Off Business Network"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Main heading displayed on the banner</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
                placeholder="Join our exclusive network of entrepreneurs and business leaders..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">Supporting text or call-to-action message</p>
            </div>
          </div>

          {/* Preview Section */}
          {(formData.heading || formData.description || imagePreview) && (
            <div className="mb-6">
              <h2 className="text-base font-semibold text-gray-800 mb-3 flex items-center border-b pb-2">
                <svg className="w-5 h-5 mr-2 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Live Preview
              </h2>
              <div className="bg-gradient-to-r from-cyan-50 to-pink-50 p-6 rounded-lg relative overflow-hidden">
                {imagePreview && (
                  <div className="absolute inset-0 opacity-20">
                    <img src={imagePreview} alt="Background" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="relative z-10">
                  {formData.heading && (
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {formData.heading}
                    </h3>
                  )}
                  {formData.description && (
                    <p className="text-gray-700 text-sm">
                      {formData.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2  bg-gradient-to-br from-cyan-600 via-cyan-700 to-cyan-400 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-sm font-medium"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Adding Banner...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Banner</span>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg shadow">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 text-sm font-medium">
                {typeof error === "string" ? error : "An error occurred while adding the banner"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddBanner;