import { User, History, Settings, LogOut, ChevronRight, Camera, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

const analysisHistory = [
  { id: 1, date: "Dec 1, 2025", skinScore: 85, concerns: ["Mild acne", "Dehydration"] },
  { id: 2, date: "Nov 25, 2025", skinScore: 78, concerns: ["Dark circles", "Texture"] },
  { id: 3, date: "Nov 18, 2025", skinScore: 72, concerns: ["Acne", "Oiliness"] },
];

export default function Profile() {
  return (
    <div className="min-h-screen py-8 md:py-16">
      <div className="container px-4 md:px-6 max-w-2xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-8 overflow-hidden">
          <div className="h-24 gradient-primary" />
          <CardContent className="relative pt-0 pb-6">
            <div className="flex flex-col items-center -mt-12">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-background">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=glowvai" />
                  <AvatarFallback>GV</AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <h2 className="text-xl font-bold mt-4">Beauty Enthusiast</h2>
              <p className="text-sm text-muted-foreground">Member since Nov 2025</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-3 rounded-xl bg-secondary/50">
                <p className="text-2xl font-bold text-primary">3</p>
                <p className="text-xs text-muted-foreground">Analyses</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-secondary/50">
                <p className="text-2xl font-bold text-primary">78</p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-secondary/50">
                <p className="text-2xl font-bold text-primary">+10%</p>
                <p className="text-xs text-muted-foreground">Improvement</p>
              </div>
            </div>
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
            {analysisHistory.map((analysis, index) => (
              <div key={analysis.id}>
                <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-secondary/50 transition-colors text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{analysis.date}</p>
                      <p className="text-sm text-muted-foreground">
                        {analysis.concerns.join(" · ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{analysis.skinScore}</p>
                      <p className="text-xs text-muted-foreground">Score</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </button>
                {index < analysisHistory.length - 1 && <Separator className="my-2" />}
              </div>
            ))}
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
            <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-destructive/10 transition-colors text-destructive">
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
