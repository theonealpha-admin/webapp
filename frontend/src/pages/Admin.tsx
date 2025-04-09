"use client";

import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/axios";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { AUTH_TOKEN } from "@/constants/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Admin() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dataFile, setDataFile] = useState<File | null>(null);
  const [userFile, setUserFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const parseUser = JSON.parse(user);
    console.log("user----", parseUser);
    const token = localStorage.getItem(AUTH_TOKEN);
    if (!token) {
      navigate("/", { replace: true });
      return;
    }
    if (token && !parseUser?.admin) {
      navigate("/dashboard", { replace: true });
    }
  }, []);

  const handleUserUpload = async (file: File) => {
    if (file) {
      setUserFile(file);
    }
  };

  const handleDataUpload = async (file: File) => {
    if (file) {
      setDataFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!dataFile && !userFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload",
        duration: 1500,
      });
      return;
    }
    setLoading(true);
    const formData = new FormData();
    if (dataFile) formData.append("data", dataFile);
    if (userFile) formData.append("users", userFile);

    try {
      const { data } = await axiosInstance.post("/data/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setDataFile(null);
      setUserFile(null);
      if (data) {
        toast({
          title: "Upload Successful",
          description: "Files uploaded successfully.",
          duration: 1500,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error while uploading files. Please try again.",
        duration: 1500,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen h-screen bg-black flex flex-col">
      <div className="flex justify-between items-center p-4 px-10">
        <h2
          className="text-xl font-bold text-white cursor-pointer"
          onClick={() => navigate("/")}
        >
          Admin
        </h2>
        <h2
          className="text-xl font-bold text-white cursor-pointer"
          onClick={() => handleLogout()}
        >
          Logout
        </h2>
      </div>

      <main className="flex-grow flex flex-col items-center justify-center gap-4">
        <div className="flex gap-4">
          <div>
            <FileUpload
              onFileSelect={handleDataUpload}
              acceptedFileTypes=".xls, .xlsx"
              maxFileSizeInBytes={10 * 1024 * 1024} // 10MB
              buttonText="Select Data"
            />
            {dataFile && (
              <p className="text-white text-sm p-3">{dataFile?.name}</p>
            )}
          </div>

          <div>
            <FileUpload
              onFileSelect={handleUserUpload}
              acceptedFileTypes=".xls, .xlsx"
              maxFileSizeInBytes={10 * 1024 * 1024} // 10MB
              buttonText="Select User Data"
            />
            {userFile && (
              <p className="text-white text-sm p-3 ">{userFile?.name}</p>
            )}
          </div>
        </div>
        <Button onClick={handleSubmit} className="mt-8" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Upload"
          )}
        </Button>
      </main>
    </div>
  );
}
