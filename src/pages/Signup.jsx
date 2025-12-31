import { useState, useRef } from "react";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import GoogleSVG from "../assets/google.svg";

export default function Signup() {
  useAuthRedirect();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSignup = async () => {
    setError("");

    // 🔹 Validation
    if (!name.trim()) {
      toast({ description: "Name is required", variant: "destructive" });
      return;
    }

    if (!email.includes("@")) {
      toast({ description: "Invalid email", variant: "destructive" });
      return;
    }

    if (password.length < 6) {
      toast({
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // 1️⃣ Create Firebase Auth user
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;

      // 2️⃣ Save user to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        full_name: name,
        age: "",
        gender: "",
        height: "",
        weight: "",
        profile_completed: false,
        created_at: new Date(),
        updated_at: new Date(),
      });

      toast({
        description: "Account created successfully!",
      });

      // 3️⃣ Redirect to profile completion
      navigate("/profile");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        toast({ description: "Email already in use", variant: "destructive" });
      } else {
        toast({ description: "Signup failed", variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setIsLoading(true);

    try {
      // 1️⃣ Google authentication
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;

      // 2️⃣ Firestore reference
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      // 3️⃣ Create Firestore document if new user
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          full_name: user.displayName || "User",
          age: "",
          gender: "",
          height: "",
          weight: "",
          profile_completed: false,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }

      toast({
        description: "Google signup successful!",
      });

      // 4️⃣ Redirect to profile completion
      navigate("/");
    } catch (err) {
      console.error(err);
      toast({
        description: "Google signup failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fix: Add handleKeyPress function
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (e.target.name === "name" && emailRef.current) {
        emailRef.current.focus();
      } else if (e.target.name === "email" && passwordRef.current) {
        passwordRef.current.focus();
      } else if (e.target.name === "password") {
        handleSignup();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 flex items-center justify-center px-4 py-8 md:py-12">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-yellow-200/20 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-yellow-100/20 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Mobile illustration */}

        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
            Join <span className="text-gradient">GLOWVAI</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">
            Create your account for personalized beauty analysis
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 md:p-8 border border-white/40">
          {/* Google Sign Up Button */}
          <Button
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="w-full mb-6 rounded-full bg-white/20 text-gray-900 border border-white/40 hover:bg-yellow-50 hover:border-yellow-200 h-12 text-base font-medium transition-all duration-200"
          >
            <img src={GoogleSVG} alt="Google" className="w-5 h-5 mr-2" />
            Continue with Google
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-400 font-medium">
                or sign up with email
              </span>
            </div>
          </div>

          {/* Full Name Input */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                onKeyPress={handleKeyPress}
                className="pl-12 h-12 rounded-xl border-gray-200 focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:border-transparent text-base"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                ref={emailRef}
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                onKeyPress={handleKeyPress}
                className="pl-12 h-12 rounded-xl border-gray-200 focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:border-transparent text-base"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                ref={passwordRef}
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                onKeyPress={handleKeyPress}
                className="pl-12 pr-12 h-12 rounded-xl border-gray-200 focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:border-transparent text-base"
                disabled={isLoading}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-gray-500 text-xs mt-2 font-medium">
              At least 6 characters
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-4 bg-red-50/80 border border-red-200 rounded-xl backdrop-blur-sm">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Sign Up Button */}
          <Button
            onClick={handleSignup}
            disabled={!name || !email || !password || isLoading}
            className="w-full h-12 text-base font-semibold rounded-full bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-all duration-200 shadow-md mb-4"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-yellow-600 hover:text-yellow-700 font-semibold transition-colors"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>

        {/* Terms */}
        <p className="text-center text-gray-500 text-xs mt-6 px-4">
          By signing up, you agree to our{" "}
          <a
            href="/privacy"
            className="text-yellow-600 hover:text-yellow-700 font-medium transition-colors"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
