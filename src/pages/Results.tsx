import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Save, BarChart3, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const Results = () => {
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState<any>(null);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("currentProject");
    if (!saved) {
      toast.error("Please complete the estimation first");
      navigate("/project-details");
      return;
    }
    const data = JSON.parse(saved);
    setProjectData(data);
    const total = (data.materialsTotal || 0) + (data.laborTotal || 0);
    setGrandTotal(total);
  }, [navigate]);

  const handleSave = () => {
    const projects = JSON.parse(localStorage.getItem("savedProjects") || "[]");
    const newProject = {
      ...projectData,
      id: Date.now(),
      name: `${projectData.location} Project`,
      date: new Date().toLocaleDateString(),
      total: grandTotal,
    };
    projects.push(newProject);
    localStorage.setItem("savedProjects", JSON.stringify(projects));
    toast.success("Project saved successfully!");
    navigate("/projects");
  };

  const handleExport = () => {
    toast.success("PDF export feature coming soon!");
  };

  if (!projectData) return null;

  const materialsTotal = projectData.materialsTotal || 0;
  const laborTotal = projectData.laborTotal || 0;
  const materialsPercent = (materialsTotal / grandTotal) * 100;
  const laborPercent = (laborTotal / grandTotal) * 100;

  const pieData = [
    { name: "Materials", value: materialsTotal, color: "hsl(217, 91%, 60%)" },
    { name: "Labor & Finishing", value: laborTotal, color: "hsl(45, 95%, 54%)" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground py-8 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Complete Cost Breakdown</h1>
          </div>
          
          {/* Grand Total Card */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 animate-bounce-in">
            <p className="text-sm opacity-90 mb-2">Estimated Total Cost</p>
            <p className="text-5xl font-bold mb-2">₹{(grandTotal / 100000).toFixed(2)} Lakh</p>
            <p className="text-sm opacity-75">
              {projectData.area} sq.ft • {projectData.location} • {projectData.quality} quality
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Quick Summary Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="card-soft bg-gradient-to-br from-primary/10 to-primary/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Materials Cost</p>
                  <p className="text-3xl font-bold text-primary">
                    ₹{(materialsTotal / 100000).toFixed(2)}L
                  </p>
                  <Progress value={materialsPercent} className="mt-3 h-2" />
                  <p className="text-sm text-muted-foreground mt-2">{materialsPercent.toFixed(0)}% of total</p>
                </div>
                <div className="text-5xl">🏗️</div>
              </div>
            </Card>

            <Card className="card-soft bg-gradient-to-br from-secondary/10 to-secondary/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Labor & Finishing</p>
                  <p className="text-3xl font-bold text-secondary">
                    ₹{(laborTotal / 100000).toFixed(2)}L
                  </p>
                  <Progress value={laborPercent} className="mt-3 h-2 [&>div]:bg-secondary" />
                  <p className="text-sm text-muted-foreground mt-2">{laborPercent.toFixed(0)}% of total</p>
                </div>
                <div className="text-5xl">👷</div>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="breakdown" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="labor">Labor</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="breakdown" className="space-y-6">
              <Card className="card-soft">
                <h3 className="text-lg font-semibold mb-4">Cost Distribution</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="materials" className="space-y-4">
              {projectData.materials && Object.entries(projectData.materials).map(([key, material]: [string, any]) => (
                <Card key={key} className="card-soft">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold capitalize">{key}</h4>
                      <p className="text-sm text-muted-foreground">
                        {material.quantity} × ₹{material.rate}
                      </p>
                    </div>
                    <p className="text-xl font-bold text-primary">
                      ₹{material.cost.toLocaleString('en-IN')}
                    </p>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="labor" className="space-y-4">
              {projectData.laborCosts && Object.entries(projectData.laborCosts).map(([key, rate]: [string, any]) => {
                const cost = rate[0] * projectData.area;
                return (
                  <Card key={key} className="card-soft">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                        <p className="text-sm text-muted-foreground">
                          ₹{rate[0]}/sq.ft × {projectData.area} sq.ft
                        </p>
                      </div>
                      <p className="text-xl font-bold text-secondary">
                        ₹{cost.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <Card className="card-soft bg-gradient-to-br from-construction-green/10 to-construction-green/5">
                <div className="flex gap-3">
                  <div className="text-3xl">💡</div>
                  <div>
                    <h4 className="font-semibold mb-2">Cost-Saving Tips</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Consider fly-ash bricks to save 10-15% on materials</li>
                      <li>• Buy materials in bulk during off-season (May-July) for better rates</li>
                      <li>• Local materials can reduce transportation costs by 8-12%</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="card-soft bg-gradient-to-br from-primary/10 to-primary/5">
                <div className="flex gap-3">
                  <div className="text-3xl">📊</div>
                  <div>
                    <h4 className="font-semibold mb-2">Market Comparison</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Your estimate: ₹{(grandTotal / projectData.area).toFixed(0)}/sq.ft
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Average market rate in {projectData.location}: ₹1,400-1,800/sq.ft
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="card-soft bg-gradient-to-br from-secondary/10 to-secondary/5">
                <div className="flex gap-3">
                  <div className="text-3xl">⏱️</div>
                  <div>
                    <h4 className="font-semibold mb-2">Timeline Estimate</h4>
                    <p className="text-sm text-muted-foreground">
                      Expected completion: {Math.ceil((projectData.area / 100) * 1.5)} months
                      <br />
                      (Based on {projectData.area} sq.ft and standard construction pace)
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleSave} className="flex-1 btn-hero h-12 group">
              <Save className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              Save Estimate
            </Button>
            <Button onClick={handleExport} variant="outline" className="flex-1 btn-secondary h-12">
              <Download className="mr-2 w-5 h-5" />
              Export as PDF
            </Button>
          </div>

          <Button variant="ghost" onClick={() => navigate("/")} className="w-full">
            <Home className="mr-2 w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;
