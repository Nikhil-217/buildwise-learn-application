import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectTemplateSelector } from '@/components/ProjectTemplateSelector';
import { ProjectTemplate } from '@/types';

const ProjectTemplates = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);

  const handleTemplateSelect = (template: ProjectTemplate) => {
    setSelectedTemplate(template);
  };

  const handleContinue = () => {
    if (selectedTemplate) {
      // Save template data to localStorage for use in project details
      localStorage.setItem('selectedTemplate', JSON.stringify(selectedTemplate));
      navigate('/project-details');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground py-8 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold">Project Templates</h1>
          </div>
          <p className="text-lg opacity-90">
            Choose from pre-configured templates to get started quickly
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <ProjectTemplateSelector
            onSelectTemplate={handleTemplateSelect}
            selectedTemplateId={selectedTemplate?.id}
          />

          {selectedTemplate && (
            <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
              <h3 className="text-lg font-semibold mb-4">Selected Template: {selectedTemplate.name}</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Area:</strong> {selectedTemplate.area} sq.ft
                </div>
                <div>
                  <strong>Quality:</strong> {selectedTemplate.quality}
                </div>
                <div>
                  <strong>Floors:</strong> {selectedTemplate.floors}
                </div>
                <div>
                  <strong>Total Bedrooms:</strong> {selectedTemplate.floorData.reduce((sum, f) => sum + f.bedrooms, 0)}
                </div>
              </div>

              <Button
                onClick={handleContinue}
                className="mt-4 w-full md:w-auto"
              >
                Use This Template
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectTemplates;
