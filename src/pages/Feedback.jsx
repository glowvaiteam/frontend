import { useState, useEffect } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/firebase";


import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { Star } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import heroBg from "@/assets/hero-bg.jpg";
import logo from "@/assets/glowvaitrans.svg";

export default function Feedback() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  /* 🔹 AUTO-FILL USER DETAILS */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setName(user.displayName || "");
        setEmail(user.email || "");
      }
    });
    return () => unsubscribe();
  }, []);

  /* 🔹 SUBMIT FEEDBACK */
  const submitFeedback = async () => {
    if (!rating || !message) {
      toast.warning("Missing details", {
        description: "Please give rating and message",
      });
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "feedbacks"), {
        userId: auth.currentUser?.uid || null,
        name,
        email,
        rating,
        message,
        createdAt: Timestamp.now(),
      });

      toast.success("Thank you ❤️", {
        description: "Your feedback has been submitted",
      });

      setRating(0);
      setMessage("");
    } catch (error) {
      toast.error("Error", {
        description: "Failed to submit feedback",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-yellow-50 via-white to-orange-100 relative"
      style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-white/60 pointer-events-none z-0" />
      <div className="relative z-10 w-full max-w-lg">
        <Card className="rounded-3xl shadow-2xl border-0 bg-white/90 backdrop-blur-md">
          <CardHeader className="flex flex-col items-center gap-2">
            <img src={logo} alt="Glowvai Logo" className="w-20 h-20 mb-2 drop-shadow-lg" />
            <CardTitle className="text-3xl font-extrabold text-orange-500 tracking-tight">We Value Your Feedback!</CardTitle>
            <CardDescription className="text-center text-base">Help us improve Glowvai by sharing your thoughts. Your feedback makes us better!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3 w-full">
                <Avatar>
                  <AvatarImage src={auth.currentUser?.photoURL || undefined} alt={name || "User"} />
                  <AvatarFallback>{name ? name[0] : "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Input value={name} disabled className="mb-2 font-semibold bg-gray-100" />
                  <Input value={email} disabled className="bg-gray-100" />
                </div>
              </div>
              <div className="w-full">
                <p className="text-sm font-medium mb-2">How would you rate your experience?</p>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={32}
                      onClick={() => setRating(star)}
                      className={`cursor-pointer transition-all duration-150 ${
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400 scale-110 drop-shadow"
                          : "text-gray-300 hover:scale-105"
                      }`}
                    />
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-xs text-muted-foreground mt-1 text-center">
                    You rated <span className="font-bold text-yellow-500">{rating} / 5</span>
                  </p>
                )}
              </div>
              <Textarea
                placeholder="Write your feedback..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-gray-50 border-2 border-orange-100 focus:border-orange-300 min-h-[100px]"
              />
              <Button
                className="w-full rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 text-white text-lg font-semibold shadow-lg hover:from-orange-500 hover:to-yellow-500 transition"
                onClick={submitFeedback}
                disabled={loading}
                size="lg"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                    Sending...
                  </span>
                ) : (
                  "Send Feedback"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
