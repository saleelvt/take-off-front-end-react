/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../reduxKit/store";
import { adminGetEvents, adminDeleteEventById } from "../../reduxKit/actions/admin/admin-event";
import { clearMessage, resetEventState } from "../../reduxKit/reducers/admin/admin-event";
import toast from "react-hot-toast";

interface Event {
  _id: string;
  imageUrl: string;
  dateLabel: string;
  isRegular: boolean;
  title: string;
  type: string;
  description: string;
  eventDate: string;
  eventTime: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

const ListEvent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, message } = useSelector((state: RootState) => state.event || {});

  const [events, setEvents] = useState<Event[]>([]);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string>("");

  useEffect(() => {
    fetchEvents();
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
      dispatch(resetEventState());
    };
  }, [dispatch]);

  const fetchEvents = async () => {
    try {
      const result = await dispatch(adminGetEvents()).unwrap();
      console.log("Events fetched:", result.data);
      setEvents(result.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    setDeleteLoading(id);
    try {
      await dispatch(adminDeleteEventById(id)).unwrap();
      toast.success("Event deleted successfully!");
      fetchEvents();
    } catch (err) {
      console.error("Error deleting event:", err);
      toast.error("Failed to delete event");
    } finally {
      setDeleteLoading("");
    }
  };

  const handleAddNew = () => {
    navigate("/add-event");
  };

  if (loading && events.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-8 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl shadow-lg">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-cyan-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-cyan-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-cyan-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <span className="ml-3 text-gray-700">Loading events...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-xl">
      <div className="mb-6 pb-4 border-b-2 border-cyan-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <svg className="w-6 h-6 mr-2 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Events Management
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Total Events: {events.length}
            </p>
          </div>
          <div className="flex  items-center space-x-3">
            <div className="bg-cyan-600 flex space-x-3 items-center text-white px-6 py-1 rounded-lg shadow-md">
              <span className="text-xs font-medium">Total</span>
              <div className="text-2xl font-bold">{events.length}</div>
            </div>
            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-gradient-to-br from-teal-600 via-cyan-700 to-cyan-400 text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add New Event</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white border-l-4 border-cyan-500 rounded-lg p-4 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-32 h-32 object-cover rounded-lg shadow-md"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/150?text=No+Image';
                  }}
                />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
                      {event.isRegular && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                          Regular
                        </span>
                      )}
                      <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full">
                        {event.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => setExpandedEvent(expandedEvent === event._id ? null : event._id)}
                      className="text-xs bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-3 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-md"
                    >
                      {expandedEvent === event._id ? "Less ▲" : "More ▼"}
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      disabled={deleteLoading === event._id}
                      className="text-xs bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                    >
                      {deleteLoading === event._id ? (
                        <>
                          <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Deleting...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Delete</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs bg-gray-50 p-2 rounded-lg">
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-700">{event.dateLabel}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-700">{new Date(event.eventDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">{event.eventTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-700">{event.location}</span>
                  </div>
                </div>

                {expandedEvent === event._id && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-2 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Additional Details
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="font-medium text-gray-700">Created:</span>
                          <span className="ml-1 text-gray-600">{new Date(event.createdAt).toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Updated:</span>
                          <span className="ml-1 text-gray-600">{new Date(event.updatedAt).toLocaleString()}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="font-medium text-gray-700">Event ID:</span>
                          <span className="ml-1 text-gray-600 font-mono">{event._id}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-16">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500 text-lg mb-4">No events found</p>
          <button
            onClick={handleAddNew}
            className="px-6 py-2 bg-gradient-to-br from-blue-600 via-cyan-700 to-blue-400 text-white rounded-lg hover:shadow-lg transition-all"
          >
            Create Your First Event
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
  );
};

export default ListEvent;