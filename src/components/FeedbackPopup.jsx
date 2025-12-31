import { useState, useEffect } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db, auth } from "@/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function FeedbackPopup({ open, onOpenChange }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth.currentUser) {
      setName(auth.currentUser.displayName || "");
      setEmail(auth.currentUser.email || "");
    }
  }, [open]);

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
      onOpenChange(false);
    } catch (error) {
      toast.error("Error", {
        description: "Failed to submit feedback",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rate Your Experience</DialogTitle>
          <DialogDescription>We'd love to hear your feedback!</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <Input value={name} disabled placeholder="Name" />
          <Input value={email} disabled placeholder="Email" />
          <div>
            <p className="text-sm font-medium mb-1">Rating</p>
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={24}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer transition ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                />
              ))}
            </div>
            {rating > 0 && (
              <p className="text-xs text-muted-foreground">You rated {rating} / 5</p>
            )}
          </div>
          <Textarea
            placeholder="Write your feedback..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[70px]"
          />
          <Button
            className="w-full rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-semibold"
            onClick={submitFeedback}
            disabled={loading}
          >
            {loading ? "Sending..." : "Save Feedback"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
