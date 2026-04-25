import { useState, useEffect } from "react";
import { authService } from "../../auth/services/authService";
import { toast } from "react-toastify";

export const useSettings = () => {
  const [profile, setProfile] = useState({ username: "", id: "", email: "" });
  const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await authService.getProfile();
        const userData = data.data || data;
        setProfile({
          username: userData.username,
          id: userData.id,
          email: userData.email || "No email linked",
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchUserData();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      await authService.changePassword(passwords.old, passwords.new);
      toast.success("Password updated successfully!");
      setPasswords({ old: "", new: "", confirm: "" });
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    passwords,
    setPasswords,
    loading,
    fetching,
    handlePasswordChange,
  };
};
