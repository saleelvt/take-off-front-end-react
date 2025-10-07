/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch,  } from "react-redux";
import { AppDispatch,  } from "../../reduxKit/store";
import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom"; // Add this back in your actual component
import { adminGetMemberships } from "../../reduxKit/actions/admin/admin-membership";

export default function EnquiredMembersList() {
  // const navigate = useNavigate(); // Add this back in your actual component
  const dispatch = useDispatch<AppDispatch>();

  
  const [Membership, setMembership] = useState<any[]>([]);
  // const [deleteLoading, setDeleteLoading] = useState<string>("");
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [loading,setLoading]=useState(false)

  useEffect(() => {
    fetchMembership();
  }, [dispatch]); 

  const fetchMembership = async () => {
    try {
      setLoading(true)
      const result = await dispatch(adminGetMemberships()).unwrap();
      console.log("Membership fetched:", result.data);
      if(result.success){
        setMembership(result.data);
        setLoading(false)
      }
    } catch (err) {
      console.error("Error fetching Membership:", err);
    }
  };

  if (loading) { 
    return (
      <div className="max-w-7xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center text-lg">Loading memberships...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white rounded-lg shadow">
      <div className="mb-3">
        <h2 className="text-lg font-semibold">Membership Enquiries</h2>
        <p className="text-xs text-cyan-500">Total: {Membership.length}</p>
      </div>

      <div className="space-y-2">
        {Membership.map((member) => (
          <div
            key={member._id}
            className="border border-gray-200 rounded p-3 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-sm font-medium">
                  {member.personalInfo.firstName} {member.personalInfo.lastName}
                </h3>
                <p className="text-xs text-gray-600">{member.businessInfo.position} at {member.businessInfo.companyName}</p>
              </div>
              <button
                onClick={() => setExpandedProject(expandedProject === member._id ? null : member._id)}
                className="text-xs text-cyan-600 hover:text-cyan-800"
              >
                {expandedProject === member._id ? "Less" : "More"}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <div>
                <span className="text-gray-500">Email:</span> {member.personalInfo.email}
              </div>
              <div>
                <span className="text-gray-500">Phone:</span> {member.personalInfo.phone}
              </div>
              <div>
                <span className="text-gray-500">Location:</span> {member.businessInfo.primaryLocation}
              </div>
              <div>
                <span className="text-gray-500">Industry:</span> {member.businessInfo.industry}
              </div>
            </div>

            {expandedProject === member._id && (
              <div className="mt-3 pt-3 border-t border-gray-200 space-y-2 text-xs">
                <div>
                  <span className="font-medium text-gray-700">Business Info:</span>
                  <div className="ml-2 mt-1 space-y-1">
                    <p><span className="text-gray-500">Company Size:</span> {member.businessInfo.companySize}</p>
                    <p><span className="text-gray-500">Business Type:</span> {member.businessInfo.businessType}</p>
                    <p><span className="text-gray-500">Description:</span> {member.businessInfo.companyDescription}</p>
                    <p><span className="text-gray-500">Website:</span> <a href={member.businessInfo.companyWebsite} className="text-cyan-600 hover:underline" target="_blank" rel="noopener noreferrer">{member.businessInfo.companyWebsite}</a></p>
                  </div>
                </div>

                <div>
                  <span className="font-medium text-gray-700">Interests:</span>
                  <div className="ml-2 mt-1 space-y-1">
                    <p><span className="text-gray-500">Programs:</span> {member.interests.programInterests.join(", ")}</p>
                    <p><span className="text-gray-500">Goals:</span> {member.interests.businessGoals}</p>
                    <p><span className="text-gray-500">Referral:</span> {member.interests.referralSource}</p>
                    <p><span className="text-gray-500">Volunteering:</span> {member.interests.volunteeringInterested ? "Yes" : "No"}</p>
                    {member.interests.contributionIdeas && (
                      <p><span className="text-gray-500">Ideas:</span> {member.interests.contributionIdeas}</p>
                    )}
                  </div>
                </div>

                <div>
                  <span className="font-medium text-gray-700">Other:</span>
                  <div className="ml-2 mt-1 space-y-1">
                    <p><span className="text-gray-500">Nationality:</span> {member.personalInfo.nationality}</p>
                    <p><span className="text-gray-500">LinkedIn:</span> <a href={member.personalInfo.linkedin} className="text-cyan-600 hover:underline" target="_blank" rel="noopener noreferrer">Profile</a></p>
                    <p><span className="text-gray-500">Registered:</span> {new Date(member.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {Membership.length === 0 && (
        <div className="text-center py-8 text-sm text-gray-500">
          No membership enquiries found
        </div>
      )}
    </div>
  );
}