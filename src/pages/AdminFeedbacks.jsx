import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/firebase";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";

export default function AdminFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* 🔹 FETCH FEEDBACKS */
  const fetchFeedbacks = async () => {
    try {
      const q = query(
        collection(db, "feedbacks"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      setFeedbacks(data);
    } catch (error) {
      toast.error("Failed to load feedbacks");
    } finally {
      setLoading(false);
    }
  };

  /* 🔹 DELETE FEEDBACK */
  const deleteFeedback = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this feedback?"
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "feedbacks", id));
      toast.success("Feedback deleted");
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    } catch (error) {
      toast.error("Failed to delete feedback");
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading feedbacks...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-yellow-500">
          User Feedbacks
        </h1>
        <button
          className="border px-4 py-2 rounded-lg"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">S.No</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Rating</th>
              <th className="border p-2">Message</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((f, i) => (
              <tr key={f.id}>
                <td className="border p-2 text-center">{i + 1}</td>
                <td className="border p-2">{f.name}</td>
                <td className="border p-2">{f.email}</td>
                <td className="border p-2 text-center">
                  ⭐ {f.rating}/5
                </td>
                <td className="border p-2 max-w-xs truncate">
                  {f.message}
                </td>
                <td className="border p-2 text-center">
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => deleteFeedback(f.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {feedbacks.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-400">
                  No feedbacks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
