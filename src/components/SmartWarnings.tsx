import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SmartWarningsProps {
  materials: any;
  projectArea: number;
}

export const SmartWarnings = ({ materials, projectArea }: SmartWarningsProps) => {
  const warnings = [];
  
  // Check cement quantity
  const cementPerSqft = materials.cement.quantity / projectArea;
  if (cementPerSqft < 0.3) {
    warnings.push({
      type: 'warning',
      message: 'Cement quantity seems low. Consider increasing for better strength.',
      icon: AlertTriangle
    });
  } else if (cementPerSqft > 0.6) {
    warnings.push({
      type: 'info',
      message: 'High cement quantity detected. This will increase strength but also cost.',
      icon: Info
    });
  }
  
  // Check steel quantity
  const steelPerSqft = materials.steel.quantity / projectArea;
  if (steelPerSqft < 3) {
    warnings.push({
      type: 'warning',
      message: 'Steel quantity is below recommended minimum (3kg/sq.ft).',
      icon: AlertTriangle
    });
  }
  
  // Check if quantities are reasonable
  if (materials.bricks.quantity < 0.01) {
    warnings.push({
      type: 'warning',
      message: 'Very low brick quantity. Check if this is correct for your project.',
      icon: AlertTriangle
    });
  }
  
  if (warnings.length === 0) {
    warnings.push({
      type: 'success',
      message: 'All material quantities look good! ✅',
      icon: CheckCircle
    });
  }
  
  return (
    <div className="space-y-2">
      {warnings.map((warning, index) => (
        <Alert 
          key={index} 
          className={`${
            warning.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
            warning.type === 'success' ? 'border-green-200 bg-green-50' :
            'border-blue-200 bg-blue-50'
          }`}
        >
          <warning.icon className={`h-4 w-4 ${
            warning.type === 'warning' ? 'text-yellow-600' :
            warning.type === 'success' ? 'text-green-600' :
            'text-blue-600'
          }`} />
          <AlertDescription className={`${
            warning.type === 'warning' ? 'text-yellow-800' :
            warning.type === 'success' ? 'text-green-800' :
            'text-blue-800'
          }`}>
            {warning.message}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};