import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { projectTemplates } from '@/data/projectTemplates';
import { ProjectTemplate } from '@/types';

interface ProjectTemplateSelectorProps {
  onSelectTemplate: (template: ProjectTemplate) => void;
  selectedTemplateId?: string;
}

export const ProjectTemplateSelector = ({
  onSelectTemplate,
  selectedTemplateId
}: ProjectTemplateSelectorProps) => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | undefined>(selectedTemplateId);

  const handleTemplateSelect = (template: ProjectTemplate) => {
    setSelectedId(template.id);
    onSelectTemplate(template);
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'basic': return 'bg-gray-100 text-gray-800';
      case 'standard': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Choose a Project Template</h2>
        <p className="text-muted-foreground">
          Start with a pre-configured template or create your own custom project
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projectTemplates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedId === template.id
                ? 'ring-2 ring-primary border-primary'
                : 'hover:border-primary/50'
            }`}
            onClick={() => handleTemplateSelect(template)}
          >
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">{template.name}</h3>
                </div>
                {selectedId === template.id && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </div>

              <p className="text-sm text-muted-foreground">
                {template.description}
              </p>

              <div className="flex items-center justify-between">
                <Badge className={getQualityColor(template.quality)}>
                  {template.quality}
                </Badge>
                <span className="text-sm font-medium">
                  {template.area} sq.ft
                </span>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <div>Floors: {template.floors}</div>
                <div>Bedrooms: {template.floorData.reduce((sum, f) => sum + f.bedrooms, 0)}</div>
                <div>Bathrooms: {template.floorData.reduce((sum, f) => sum + f.bathrooms, 0)}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
        <Button
          onClick={() => navigate('/project-details')}
          disabled={!selectedId}
        >
          Continue with Template
        </Button>
      </div>
    </div>
  );
};
