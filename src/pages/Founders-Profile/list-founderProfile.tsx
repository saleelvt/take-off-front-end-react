/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../reduxKit/store";
import { adminGetFounderProfiles, adminDeleteFounderProfileById, adminUpdateFounderProfile } from "../../reduxKit/actions/admin/admin-founderProfile";
import { clearMessage, resetFounderProfileState } from "../../reduxKit/reducers/admin/admin-founderProfile";
import toast from "react-hot-toast";

interface FounderProfile {
  _id: string;
  imageUrl: string;
  badge: string;
  fullName: string;
  role: string;
  summary: string;
  achievements: string[];
  socialLinks: {
    linkedIn: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface UpdateFormData {
  image: File | null;
  badge: string;
  fullName: string;
  role: string;
  summary: string;
  achievements: string[];
  linkedIn: string;
}

const ListFounderProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, message } = useSelector((state: RootState) => state.founderProfile || {});

  const [profiles, setProfiles] = useState<FounderProfile[]>([]);
  const [expandedProfile, setExpandedProfile] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string>("");
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [selectedProfile, setSelectedProfile] = useState<FounderProfile | null>(null);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  
  const [updateFormData, setUpdateFormData] = useState<UpdateFormData>({
    image: null,
    badge: "",
    fullName: "",
    role: "",
    summary: "",
    achievements: [""],
    linkedIn: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    fetchProfiles();
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
      dispatch(resetFounderProfileState());
    };
  }, [dispatch]);

  const fetchProfiles = async () => {
    try {
      const result = await dispatch(adminGetFounderProfiles()).unwrap();
      console.log("Founder profiles fetched:", result.data);
      setProfiles(result.data);
    } catch (err) {
      console.error("Error fetching founder profiles:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this founder profile?")) {
      return;
    }

    setDeleteLoading(id);
    try {
      await dispatch(adminDeleteFounderProfileById(id)).unwrap();
      toast.success("Founder profile deleted successfully!");
      fetchProfiles();
    } catch (err) {
      console.error("Error deleting founder profile:", err);
      toast.error("Failed to delete founder profile");
    } finally {
      setDeleteLoading("");
    }
  };

  const handleUpdateClick = (profile: FounderProfile) => {
    setSelectedProfile(profile);
    setUpdateFormData({
      image: null,
      badge: profile.badge,
      fullName: profile.fullName,
      role: profile.role,
      summary: profile.summary,
      achievements: profile.achievements.length > 0 ? profile.achievements : [""],
      linkedIn: profile.socialLinks?.linkedIn || "",
    });
    setImagePreview(profile.imageUrl);
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

  const handleAchievementChange = (index: number, value: string) => {
    const newAchievements = [...updateFormData.achievements];
    newAchievements[index] = value;
    setUpdateFormData((prev) => ({ ...prev, achievements: newAchievements }));
  };

  const addAchievement = () => {
    setUpdateFormData((prev) => ({ ...prev, achievements: [...prev.achievements, ""] }));
  };

  const removeAchievement = (index: number) => {
    if (updateFormData.achievements.length > 1) {
      const newAchievements = updateFormData.achievements.filter((_, i) => i !== index);
      setUpdateFormData((prev) => ({ ...prev, achievements: newAchievements }));
    }
  };

  const handleUpdateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!selectedProfile) return;
    
    if (!updateFormData.fullName || !updateFormData.badge) {
      toast.error("Please fill in all required fields");
      return;
    }

    setUpdateLoading(true);
    const filteredAchievements = updateFormData.achievements.filter(a => a.trim() !== "");
    const formDataToSend = new FormData();
    
    if (updateFormData.image) {
      formDataToSend.append("image", updateFormData.image);
    }
    
    formDataToSend.append("badge", updateFormData.badge);
    formDataToSend.append("fullName", updateFormData.fullName);
    formDataToSend.append("role", updateFormData.role);
    formDataToSend.append("summary", updateFormData.summary);
    formDataToSend.append("achievements", JSON.stringify(filteredAchievements));
    formDataToSend.append("socialLinks", JSON.stringify({ linkedIn: updateFormData.linkedIn }));

    try {
      await dispatch(adminUpdateFounderProfile({ id: selectedProfile._id, data: formDataToSend })).unwrap();
      toast.success("Founder profile updated successfully!");
      setShowUpdateModal(false);
      fetchProfiles();
    } catch (err) {
      console.error("Error updating founder profile:", err);
      toast.error("Failed to update founder profile");
    } finally {
      setUpdateLoading(false);
    }
  };

  const closeModal = () => {
    setShowUpdateModal(false);
    setSelectedProfile(null);
    setUpdateFormData({ image: null, badge: "", fullName: "", role: "", summary: "", achievements: [""], linkedIn: "" });
    setImagePreview("");
  };

  const handleAddNew = () => {
    navigate("/admin/add-founder-profile");
  };

  if (loading && profiles.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-8 bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl shadow-lg">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-cyan-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-cyan-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-cyan-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <span className="ml-3 text-gray-700">Loading founder profiles...</span>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Founder Profiles
              </h2>
              <p className="text-sm text-gray-600 mt-1">Total Profiles: {profiles.length}</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-cyan-600 flex gap-2 text-white px-4 py-1 items-center rounded-lg shadow-md">
                <span className="text-xs font-medium">Total</span>
                <div className="text-2xl font-bold">{profiles.length}</div>
              </div>
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-gradient-to-br from-cyan-600 via-teto-teal-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add New Profile</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <div
              key={profile._id}
              className="bg-white border-l-4 border-cyan-500 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="relative">
                <div className="h-48 bg-gradient-to-br from-cyan-100 to-teal-100 flex items-center justify-center">
                  <img
                    src={profile.imageUrl}
                    alt={profile.fullName}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/150?text=Profile';
                    }}
                  />
                </div>
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button
                    onClick={() => handleUpdateClick(profile)}
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all shadow-md"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(profile._id)}
                    disabled={deleteLoading === profile._id}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleteLoading === profile._id ? (
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-800 text-center mb-1">{profile.fullName}</h3>
                <p className="text-sm text-cyan-600 text-center font-medium mb-2">{profile.badge}</p>
                {profile.role && (
                  <p className="text-xs text-gray-600 text-center mb-3">{profile.role}</p>
                )}

                {profile.summary && (
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">{profile.summary}</p>
                )}

                {profile.achievements && profile.achievements.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Achievements:</p>
                    <div className="flex flex-wrap gap-1">
                      {profile.achievements.slice(0, 2).map((achievement, index) => (
                        <span key={index} className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full">
                          {achievement}
                        </span>
                      ))}
                      {profile.achievements.length > 2 && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                          +{profile.achievements.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  {profile.socialLinks?.linkedIn && (
                    <a
                      href={profile.socialLinks.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      <span>LinkedIn</span>
                    </a>
                  )}
                  <button
                    onClick={() => setExpandedProfile(expandedProfile === profile._id ? null : profile._id)}
                    className="text-xs bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-3 py-1 rounded-lg hover:from-cyan-600 hover:to-teal-700 transition-all"
                  >
                    {expandedProfile === profile._id ? "Less ▲" : "More ▼"}
                  </button>
                </div>

                {expandedProfile === profile._id && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="bg-gradient-to-r from-cyan-50 to-teal-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2 text-xs">All Achievements:</h4>
                      <ul className="space-y-1 text-xs text-gray-700 list-disc list-inside">
                        {profile.achievements.map((achievement, index) => (
                          <li key={index}>{achievement}</li>
                        ))}
                      </ul>
                      <div className="mt-3 pt-2 border-t border-cyan-200">
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">Created:</span> {new Date(profile.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">Updated:</span> {new Date(profile.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {profiles.length === 0 && (
          <div className="text-center py-16">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-500 text-lg mb-4">No founder profiles found</p>
            <button
              onClick={handleAddNew}
              className="px-6 py-2 bg-gradient-to-br from-cyan-600 via-teto-teal-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Add Your First Profile
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
                Update Founder Profile
              </h2>
              <button onClick={closeModal} className="text-white hover:text-gray-200 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="p-6">
              {imagePreview && (
                <div className="mb-5 flex justify-center">
                  <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-full border-4 border-cyan-200" />
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleUpdateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to keep current image</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={updateFormData.fullName}
                    onChange={handleUpdateChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Badge <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="badge"
                    value={updateFormData.badge}
                    onChange={handleUpdateChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <input
                  type="text"
                  name="role"
                  value={updateFormData.role}
                  onChange={handleUpdateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Summary</label>
                <textarea
                  name="summary"
                  value={updateFormData.summary}
                  onChange={handleUpdateChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Achievements</label>
                <div className="space-y-2">
                  {updateFormData.achievements.map((achievement, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={achievement}
                        onChange={(e) => handleAchievementChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 text-sm"
                      />
                      {updateFormData.achievements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAchievement(index)}
                          className="px-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addAchievement}
                    className="text-sm text-cyan-600 hover:text-cyan-800 flex items-center space-x-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add Achievement</span>
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                <input
                  type="url"
                  name="linkedIn"
                  value={updateFormData.linkedIn}
                  onChange={handleUpdateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={updateLoading}
                  className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 flex items-center space-x-2"
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
                      <span>Update Profile</span>
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

export default ListFounderProfile;