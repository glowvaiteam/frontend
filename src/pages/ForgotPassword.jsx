import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleReset = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Password reset email sent! Check your inbox.");
      toast({ description: "Password reset email sent!" });
    } catch (err) {
      setError("Failed to send reset email. Please check your email address.");
      toast({ description: "Failed to send reset email", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 flex items-center justify-center px-4 py-8 md:py-12">
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Forgot Password?</h1>
          <p className="text-base md:text-lg text-muted-foreground">Enter your email to receive a password reset link.</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 md:p-8 border border-white/40">
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-800 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  setError("");
                  setSuccess("");
                }}
                className="pl-12 h-12 rounded-xl border-gray-200 focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:border-transparent text-base"
                disabled={isLoading}
              />
            </div>
          </div>
          {error && (
            <div className="mb-5 p-4 bg-red-50/80 border border-red-200 rounded-xl backdrop-blur-sm">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-5 p-4 bg-green-50/80 border border-green-200 rounded-xl backdrop-blur-sm">
              <p className="text-green-700 text-sm font-medium">{success}</p>
            </div>
          )}
          <Button
            onClick={handleReset}
            disabled={!email || isLoading}
            className="w-full h-12 text-base font-semibold rounded-full bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-all duration-200 shadow-md mb-4"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
          <div className="text-center">
            <a href="/login" className="text-yellow-600 hover:text-yellow-700 font-semibold transition-colors text-sm">Back to Login</a>
          </div>
        </div>
      </div>
    </div>
  );
}
