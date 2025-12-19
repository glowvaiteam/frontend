import { Bell, Shield, Palette, Moon, Sun, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

export default function Settings({ isDark, toggleDark }) {
  return (
    <div className="min-h-screen py-8 md:py-16">
      <div className="container px-4 md:px-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        {/* Appearance */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                {isDark ? (
                  <Moon className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Sun className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">
                    {isDark ? "Currently using dark theme" : "Currently using light theme"}
                  </p>
                </div>
              </div>
              <Switch checked={isDark} onCheckedChange={toggleDark} />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl hover:bg-secondary/50 transition-colors">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Receive alerts about new features</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between p-4 rounded-xl hover:bg-secondary/50 transition-colors">
              <div>
                <p className="font-medium">Email Updates</p>
                <p className="text-sm text-muted-foreground">Weekly skincare tips and insights</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between p-4 rounded-xl hover:bg-secondary/50 transition-colors">
              <div>
                <p className="font-medium">Analysis Reminders</p>
                <p className="text-sm text-muted-foreground">Get reminded to track your progress</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl hover:bg-secondary/50 transition-colors">
              <div>
                <p className="font-medium">Data Processing</p>
                <p className="text-sm text-muted-foreground">Process images on device when possible</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between p-4 rounded-xl hover:bg-secondary/50 transition-colors">
              <div>
                <p className="font-medium">Save Analysis History</p>
                <p className="text-sm text-muted-foreground">Store past analyses for tracking</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-secondary/50 transition-colors text-left">
              <div>
                <p className="font-medium">Delete All Data</p>
                <p className="text-sm text-muted-foreground">Remove all stored information</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          </CardContent>
        </Card>

        {/* About Link */}
        <Link
          to="/about"
          className="flex items-center justify-between p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/20 transition-all"
        >
          <div>
            <p className="font-medium">About GLOWVAI</p>
            <p className="text-sm text-muted-foreground">Learn more about our mission</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Link>
      </div>
    </div>
  );
}
