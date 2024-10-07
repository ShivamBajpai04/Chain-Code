import { useEffect, useState } from "react";
import axios from "axios";

export default function SubmissionsTab() {
  const [submissions, setSubmissions] = useState<[]>([]);

  useEffect(() => {
    fetchRecentSubmissions();
  }, []);

  const fetchRecentSubmissions = async () => {
    try {
      const response = await axios.get("process.env.DOMAIN/submissions/user");
      console.log(response.data);
      setSubmissions(response.data);
    } catch (error) {
      console.error("Error fetching recent submissions:", error);
    }
  };

  return <div className="flex-1 overflow-auto">So empty!!</div>;
}
