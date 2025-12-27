import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function AnalysisDetail() {
  const { analysisId } = useParams();
  const [user, setUser] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u) {
        navigate("/login");
      } else {
        setUser(u);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user && analysisId) {
      fetchAnalysisDetail();
    }
  }, [user, analysisId]);

  const fetchAnalysisDetail = async () => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await axios.get(`http://127.0.0.1:8000/api/ml/analysis/${analysisId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Analysis detail:", response.data);
      setAnalysis(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching analysis detail:", error.response?.data || error.message);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 md:py-16 flex items-center justify-center">
        <p className="text-muted-foreground">Loading analysis...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen py-8 md:py-16">
        <div className="container px-4 md:px-6 max-w-2xl mx-auto">
          <Button onClick={() => navigate(-1)} variant="outline" className="gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <p className="text-muted-foreground">Analysis not found</p>
        </div>
      </div>
    );
  }

  const report = analysis.report || {};
  const portraitScore = report.portrait_score || 0;
  const snapshotOverview = report.snapshot_overview || {};
  const featureAnalysis = report.feature_analysis || {};
  const recommendations = report.personalized_recommendations || [];
  const products = report.recommended_products || [];

  // Format date properly
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen py-8 md:py-16 bg-gradient-to-b from-yellow-50 to-transparent">
      <div className="container px-4 md:px-6 max-w-2xl mx-auto">
        {/* Back Button */}
        <Button onClick={() => navigate(-1)} variant="outline" className="gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </Button>

        {/* Analysis Date and ID */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Face Analysis Results</h1>
          <p className="text-muted-foreground">
            {analysis.date && formatDate(analysis.date)}
          </p>
        </div>

        {/* Image */}
        {analysis.image_url && (
          <Card className="mb-8 overflow-hidden">
            <img
              src={analysis.image_url}
              alt="Analysis"
              className="w-full h-auto max-h-96 object-cover"
            />
          </Card>
        )}

        {/* Portrait Score */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Portrait Score
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-4xl font-bold text-primary">{portraitScore}</div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Overall</p>
                <p className="text-xs text-muted-foreground">Skin Health Score</p>
              </div>
            </div>
            <Progress value={portraitScore} max={100} className="h-2" />
            <p className="text-sm text-muted-foreground">
              Overall portrait score combining symmetry, clarity, texture, and skin health detected by GlowvAI.
            </p>
          </CardContent>
        </Card>

        {/* Snapshot Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Snapshot Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(snapshotOverview).map(([key, value]) => (
                <div key={key} className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-xs text-muted-foreground capitalize mb-1">
                    {key.replace(/_/g, " ")}
                  </p>
                  <p className="font-semibold capitalize">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Feature Analysis */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Feature Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(featureAnalysis).map(([feature, rating]) => (
                <div key={feature} className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-xs text-muted-foreground capitalize mb-1">
                    {feature.replace(/_/g, " ")}
                  </p>
                  <p className="font-semibold capitalize">{rating}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Personalized Recommendations */}
        {recommendations.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Personalized Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      ✓
                    </span>
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Recommended Products */}
        {products.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Recommended Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {products.map((product, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-yellow-50 border border-yellow-200 text-center"
                  >
                    <div className="w-12 h-12 rounded-lg bg-yellow-200 flex items-center justify-center mx-auto mb-2">
                      📦
                    </div>
                    <p className="text-sm font-medium text-gray-900">{product}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metadata */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-sm">Analysis Information</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>ID: {analysis.id}</p>
            <p>Date: {formatDate(analysis.date)}</p>
            {analysis.email && <p>User: {analysis.email}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
