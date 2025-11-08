import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FolderOpen, Home, FileText, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedProjects") || "[]");
    setProjects(saved);
  }, []);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: number) => {
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    localStorage.setItem("savedProjects", JSON.stringify(updated));
    toast.success("Project deleted");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground py-6 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FolderOpen className="w-6 h-6" />
              <h1 className="text-2xl font-bold">Saved Projects</h1>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate("/")}
              className="bg-white/20 hover:bg-white/30"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search projects by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          {/* Projects List */}
          {filteredProjects.length === 0 ? (
            <Card className="card-soft text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <FolderOpen className="w-16 h-16 text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">No projects found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? "Try a different search term" : "Start by creating your first estimate"}
                  </p>
                  <Button onClick={() => navigate("/project-details")} className="btn-hero">
                    Create New Estimate
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="card-soft hover:shadow-lg transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 rounded-lg p-3">
                        <Home className="w-6 h-6 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold">{project.name}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span>📍 {project.location}</span>
                          <span>📐 {project.area} sq.ft</span>
                          <span>📅 {project.date}</span>
                        </div>
                        <p className="text-xl font-bold text-primary mt-2">
                          ₹{(project.total / 100000).toFixed(2)} Lakh
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          localStorage.setItem("currentProject", JSON.stringify(project));
                          navigate("/results");
                        }}
                        className="flex-1 md:flex-none"
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          toast.info("Edit feature coming soon!");
                        }}
                        className="flex-1 md:flex-none"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(project.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
