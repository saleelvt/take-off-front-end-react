/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../reduxKit/store";
import { adminGetBanners, adminDeleteBannerById, adminUpdateBanner } from "../../reduxKit/actions/admin/admin-banner";
import { clearMessage, resetBannerState } from "../../reduxKit/reducers/admin/admin-banner";
import toast from "react-hot-toast";

interface Banner {
  _id: string;
  heading: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface UpdateFormData {
  heading: string;
  description: string;
  image: File | null;
}

const ListBanner = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, message } = useSelector((state: RootState) => state.banner || {});

  const [banners, setBanners] = useState<Banner[]>([]);
  const [expandedBanner, setExpandedBanner] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string>("");
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  
  const [updateFormData, setUpdateFormData] = useState<UpdateFormData>({
    heading: "",
    description: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    fetchBanners();
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearMessage());
    }
  }, [message, dispatch]);

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

  const fetchBanners = async () => {
    try {
      const result = await dispatch(adminGetBanners()).unwrap();
      console.log("Banners fetched:", result.data);
      setBanners(result.data);
    } catch (err) {
      console.error("Error fetching banners:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) {
      return;
    }

    setDeleteLoading(id);
    try {
      await dispatch(adminDeleteBannerById(id)).unwrap();
      toast.success("Banner deleted successfully!");
      fetchBanners();
    } catch (err) {
      console.error("Error deleting banner:", err);
      toast.error("Failed to delete banner");
    } finally {
      setDeleteLoading("");
    }
  };

  const handleUpdateClick = (banner: Banner) => {
    setSelectedBanner(banner);
    setUpdateFormData({
      heading: banner.heading,
      description: banner.description,
      image: null,
    });
    setImagePreview(banner.image);
    setShowUpdateModal(true);
  };

  const handleUpdateChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type, files } = e.target as any;
    
    if (type === "file") {
      const file = files && files[0] ? files[0] : null;
      setUpdateFormData((prev) => ({ ...prev, [name]: file }));
      
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setUpdateFormData((prev) => ({ ...prev, [name]: e.target.value }));
    }
  };

  const handleUpdateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!selectedBanner) return;
    
    if (!updateFormData.heading || !updateFormData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setUpdateLoading(true);
    const formDataToSend = new FormData();
    
    formDataToSend.append("heading", updateFormData.heading);
    formDataToSend.append("description", updateFormData.description);
    
    if (updateFormData.image) {
      formDataToSend.append("image", updateFormData.image);
    }

    try {
      await dispatch(adminUpdateBanner({ id: selectedBanner._id, data: formDataToSend })).unwrap();
      toast.success("Banner updated successfully!");
      setShowUpdateModal(false);
      fetchBanners();
    } catch (err) {
      console.error("Error updating banner:", err);
      toast.error("Failed to update banner");
    } finally {
      setUpdateLoading(false);
    }
  };

  const closeModal = () => {
    setShowUpdateModal(false);
    setSelectedBanner(null);
    setUpdateFormData({ heading: "", description: "", image: null });
    setImagePreview("");
  };

  const handleAddNew = () => {
    navigate("/add-banner");
  };

  if (loading && banners.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-8 bg-gradient-to-br from-cyan-50 to-teal-500-50 rounded-2xl shadow-lg">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-cyan-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-cyan-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-cyan-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <span className="ml-3 text-gray-700">Loading banners...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-cyan-50 rounded-2xl shadow-xl">
        <div className="mb-6 pb-4 border-b-2 border-cyan-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <svg className="w-6 h-6 mr-2 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Banner Management
              </h2>
              <p className="text-sm text-gray-600 mt-1">Total Banners: {banners.length}</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-cyan-600 flex text-white px-4 py-1 gap-3 items-center rounded-lg shadow-md">
                <span className="text-xs font-medium">Total</span>
                <div className="text-2xl font-bold">{banners.length}</div>
              </div>
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-gradient-to-br from-cyan-600 via-teal-500-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add New Banner</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {banners.map((banner) => (
            <div
              key={banner._id}
              className="bg-white border-l-4 border-cyan-500 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="relative">
                <img
                  src={banner.image}
                  alt={banner.heading}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/1200x400?text=Banner+Image';
                  }}
                />
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button
                    onClick={() => handleUpdateClick(banner)}
                    className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-all shadow-md flex items-center space-x-1 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(banner._id)}
                    disabled={deleteLoading === banner._id}
                    className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 text-sm"
                  >
                    {deleteLoading === banner._id ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Delete</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{banner.heading}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{banner.description}</p>
                  </div>
                  <button
                    onClick={() => setExpandedBanner(expandedBanner === banner._id ? null : banner._id)}
                    className="ml-4 text-xs bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-3 py-2 rounded-lg hover:from-cyan-600 hover:to-teal-700 transition-all shadow-md"
                  >
                    {expandedBanner === banner._id ? "Less ▲" : "More ▼"}
                  </button>
                </div>

                {expandedBanner === banner._id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="bg-gradient-to-r from-cyan-50 to-teal-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-3 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-2 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Additional Details
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="font-medium text-gray-700">Created:</span>
                          <span className="ml-1 text-gray-600">{new Date(banner.createdAt).toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Updated:</span>
                          <span className="ml-1 text-gray-600">{new Date(banner.updatedAt).toLocaleString()}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="font-medium text-gray-700">Banner ID:</span>
                          <span className="ml-1 text-gray-600 font-mono text-xs">{banner._id}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="font-medium text-gray-700">Image URL:</span>
                          <a href={banner.image} target="_blank" rel="noopener noreferrer" className="ml-1 text-cyan-600 hover:underline break-all text-xs">
                            {banner.image}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {banners.length === 0 && (
          <div className="text-center py-16">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500 text-lg mb-4">No banners found</p>
            <button
              onClick={handleAddNew}
              className="px-6 py-2 bg-gradient-to-br from-cyan-600 via-teal-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Create Your First Banner
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg shadow">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 text-sm font-medium">
                {typeof error === "string" ? error : "An error occurred"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-cyan-600 to-teal-600 text-white p-5 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Update Banner
              </h2>
              <button onClick={closeModal} className="text-white hover:text-gray-200 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="p-6">
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image
                </label>
                {imagePreview && (
                  <div className="mb-3">
                    <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg border-2 border-gray-200" />
                  </div>
                )}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleUpdateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to keep current image</p>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heading <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="heading"
                  value={updateFormData.heading}
                  onChange={handleUpdateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={updateFormData.description}
                  onChange={handleUpdateChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={updateLoading}
                  className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center space-x-2"
                >
                  {updateLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Update Banner</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ListBanner;