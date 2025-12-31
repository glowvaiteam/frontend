import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import axios from "axios";
import { User, History, Settings, LogOut, ChevronRight, Camera, Sparkles, Edit2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomSelect from "../components/ui/CustomSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({
    full_name: "",
    email: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    profile_image: "",
    profile_completed: false,
  });
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

useEffect(() => {
  const cached = localStorage.getItem("profile");
  if (cached) {
    setProfileData(JSON.parse(cached));
    setIsLoading(false);
  }
}, []);



useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (u) => {
    if (u) {
      setUser(u);

      // ⚡ INSTANT UI (no backend wait)
      setProfileData((prev) => ({
        ...prev,
        full_name: u.displayName || "User",
        email: u.email || "",
        profile_image: u.photoURL || "",
      }));

      setIsLoading(false); // stop loader immediately

      // 🔁 backend fetch in background
      fetchProfileData(u.uid);
    } else {
      navigate("/login");
    }
  });

  return () => unsubscribe();
}, [navigate]);


  const fetchProfileData = async (uid) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await axios.get("https://api.glowvai.in/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
     setProfileData(response.data);
     localStorage.setItem("profile", JSON.stringify(response.data))
      if (response.data.profile_image) {
        setImagePreview(response.data.profile_image);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalysisHistory = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      console.log("Fetching analysis history with token:", token ? "present" : "missing");
      const response = await axios.get("https://api.glowvai.in/api/ml/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Analysis history response:", response.data);
      setAnalysisHistory(response.data || []);
    } catch (error) {
      console.error("Error fetching analysis history:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
  if (user) {
    setTimeout(() => {
      fetchAnalysisHistory();
    }, 300);
  }
}, [user]);


  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      // enter edit mode when user selects a photo
      setIsEditing(true);
    }
  };

  const handleSaveProfile = async () => {
    // Validate required fields
    if (!profileData.age || !profileData.gender || !profileData.height || !profileData.weight) {
      toast({
        description: "Please fill in all required fields: Age, Gender, Height, and Weight",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const formData = new FormData();
      
      formData.append("full_name", profileData.full_name);
      formData.append("age", profileData.age);
      formData.append("gender", profileData.gender);
      formData.append("height", profileData.height);
      formData.append("weight", profileData.weight);
      formData.append("profile_completed", true);
      
      if (imageFile) {
        formData.append("profile_image", imageFile);
      }

      const response = await axios.post("https://api.glowvai.in/api/user/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setProfileData(response.data);
      if (response.data.profile_image) setImagePreview(response.data.profile_image);
      setIsEditing(false);
      setImageFile(null);
      
      toast({
        description: "Profile updated successfully!",
      });
      // return to previous page (if provided) or go back in history
      const from = location?.state?.from;
      const path = typeof from === "string" ? from : from?.pathname;
      if (path) navigate(path);
      else navigate(-1);
    } catch (error) {
      console.error("Error saving profile:", error);
      const errorMsg = error.response?.data?.detail || "Failed to update profile";
      toast({
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        description: "Logged out successfully",
      });
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  const calculateStats = () => {
    if (analysisHistory.length === 0) {
      return { count: 0, avgScore: 0, improvement: 0 };
    }

    const scores = analysisHistory.map((a) => a.skinScore || 0);
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    let improvement = 0;
    if (scores.length > 1) {
      const first = scores[0] || 0;
      const last = scores[scores.length - 1] || 0;
      if (first === 0) improvement = 0;
      else improvement = Math.round(((last - first) / first) * 100);
    }

    return {
      count: analysisHistory.length,
      avgScore,
      improvement,
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 md:py-16 flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div className="min-h-screen py-8 md:py-16">
      <div className="container px-4 md:px-6 max-w-2xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-8 overflow-hidden">
          <div className="h-24 gradient-primary" />
          <CardContent className="relative pt-0 pb-6">
            <div className="flex flex-col items-center -mt-12">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-background overflow-hidden">
                  <AvatarImage
                    src={imagePreview || profileData.profile_image}
                    className="w-full h-full object-cover rounded-full"
                    style={{ aspectRatio: '1/1' }}
                  />
                  <AvatarFallback>{profileData.full_name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                {/* camera overlay always available (click to change photo) */}
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(true);
                    if (fileInputRef.current) fileInputRef.current.click();
                  }}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
                  aria-label="Change profile photo"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <h2 className="text-xl font-bold mt-4">{profileData.full_name || "User"}</h2>
              <p className="text-sm text-muted-foreground">{profileData.email}</p>

              {/* Edit / Complete Profile Button */}
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                  className="mt-4 gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  {profileData.profile_completed ? "Edit Profile" : "Complete Profile"}
                </Button>
              )}
            </div>

            {/* Profile Form - Edit Mode */}
            {isEditing && (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <Input
                    value={profileData.full_name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, full_name: e.target.value })
                    }
                    placeholder="Your full name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Age</label>
                    <Input
                      type="number"
                      value={profileData.age}
                      onChange={(e) =>
                        setProfileData({ ...profileData, age: e.target.value })
                      }
                      placeholder="Age"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Gender</label>
                      {/* custom select to ensure yellow highlight across browsers */}
                      <div>
                        <CustomSelect
                          value={profileData.gender}
                          onChange={(val) => setProfileData({ ...profileData, gender: val })}
                          options={[
                            { value: "", label: "Select Gender" },
                            { value: "Male", label: "Male" },
                            { value: "Female", label: "Female" },
                            { value: "Other", label: "Other" },
                          ]}
                        />
                      </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Height (cm)</label>
                    <Input
                      type="number"
                      value={profileData.height}
                      onChange={(e) =>
                        setProfileData({ ...profileData, height: e.target.value })
                      }
                      placeholder="Height"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                    <Input
                      type="number"
                      value={profileData.weight}
                      onChange={(e) =>
                        setProfileData({ ...profileData, weight: e.target.value })
                      }
                      placeholder="Weight"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSaving || !profileData.age || !profileData.gender || !profileData.height || !profileData.weight}
                    className="flex-1 bg-yellow-400 text-gray-900 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "Saving..." : "Save Profile"}
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      setImageFile(null);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Stats */}
            {!isEditing && (
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-3 rounded-xl bg-secondary/50">
                  <p className="text-2xl font-bold text-primary">{stats.count}</p>
                  <p className="text-xs text-muted-foreground">Analyses</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-secondary/50">
                  <p className="text-2xl font-bold text-primary">{stats.avgScore}</p>
                  <p className="text-xs text-muted-foreground">Avg Score</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-secondary/50">
                  <p className="text-2xl font-bold text-primary">
                    {stats.improvement > 0 ? "+" : ""}{stats.improvement}%
                  </p>
                  <p className="text-xs text-muted-foreground">Improvement</p>
                </div>
              </div>
            )}

            {/* Profile Details */}
            {!isEditing && profileData.profile_completed && (
              <div className="grid grid-cols-2 gap-3 mt-6 text-sm">
                {profileData.age && (
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-muted-foreground text-xs">Age</p>
                    <p className="font-semibold">{profileData.age}</p>
                  </div>
                )}
                {profileData.gender && (
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-muted-foreground text-xs">Gender</p>
                    <p className="font-semibold">{profileData.gender}</p>
                  </div>
                )}
                {profileData.height && (
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-muted-foreground text-xs">Height</p>
                    <p className="font-semibold">{profileData.height} cm</p>
                  </div>
                )}
                {profileData.weight && (
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-muted-foreground text-xs">Weight</p>
                    <p className="font-semibold">{profileData.weight} kg</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analysis History */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Analysis History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysisHistory.length > 0 ? (
              analysisHistory.map((analysis, index) => (
                <div key={analysis.id}>
                  <button
                    onClick={() => navigate(`/analysis/${analysis.id}`)}
                    className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-secondary/50 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {/* Thumbnail Image */}
                      {analysis.image_url ? (
                        <img
                          src={analysis.image_url}
                          alt="Analysis thumbnail"
                          className="w-16 h-16 rounded-lg object-cover border-2 border-primary/20 group-hover:border-primary/50 transition-colors"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                          <Sparkles className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{formatDate(analysis.date)}</p>
                        <p className="text-sm text-muted-foreground">
                          {analysis.concerns?.join(" · ") || "General analysis"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">{analysis.skinScore}</p>
                        <p className="text-xs text-muted-foreground">Score</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                  {index < analysisHistory.length - 1 && <Separator className="my-2" />}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Sparkles className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground font-medium text-xs sm:text-base">No analyses yet</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Upload a face image to get your first skin analysis
                </p>
                <Link
                  to="/analyzer"
                  className="mt-4 inline-block"
                >
                  <Button className="bg-primary hover:bg-primary/90 text-xs sm:text-base px-4 py-2 sm:px-6 sm:py-2.5">Start Analysis</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-4 space-y-2">
            <Link
              to="/settings"
              className="flex items-center justify-between p-4 rounded-xl hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <span>Settings</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
            <Separator />
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-destructive/10 transition-colors text-destructive"
            >
              <div className="flex items-center gap-3">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
