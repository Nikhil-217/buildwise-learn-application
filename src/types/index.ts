// Core project data types
export interface ProjectData {
  id?: number;
  name?: string;
  date?: string;
  location: string;
  area: number;
  floors: number;
  floorData: FloorData[];
  quality: 'basic' | 'standard' | 'premium';
  materials?: MaterialsData;
  materialsTotal?: number;
  laborWages?: LaborWagesData;
  serviceCosts?: ServiceCostsData;
  laborMaterials?: LaborMaterialsData;
  laborTotal?: number;
  total?: number;

  // Enhanced accuracy fields
  cementGrade?: 'OPC43' | 'OPC53' | 'PPC' | 'SRC';
  steelGrade?: 'Fe500' | 'Fe550';
  brickType?: 'red_clay' | 'fly_ash' | 'aac_blocks';
  seasonalMultiplier?: number;
  wasteFactors?: WasteFactors;
  equipmentCosts?: EquipmentCosts;
}

export interface FloorData {
  bedrooms: number;
  bathrooms: number;
  kitchens: number;
  halls: number;
}

export interface MaterialsData {
  cement: MaterialItem;
  steel: MaterialItem;
  sand: MaterialItem;
  bricks: MaterialItem;
  aggregate: MaterialItem;
}

export interface MaterialItem {
  quantity: number;
  rate: number;
  cost: number;
  wastePercentage?: number;
}

export interface LaborWagesData {
  mason: number[];
  helper: number[];
  carpenter: number[];
  electrician: number[];
  plumber: number[];
  days: number;
}

export interface ServiceCostsData {
  electricalPerFloor: number[];
  plumbingPerUnit: number[];
  paintingPerFloor: number[];
}

export interface LaborMaterialsData {
  electricalWire: MaterialItem;
  electricalSwitches: MaterialItem;
  pipes: MaterialItem;
  sanitaryFittings: MaterialItem;
  paintBuckets: MaterialItem;
  tileAdhesive: MaterialItem;
  tileGrout: MaterialItem;
}

// Enhanced accuracy types
export interface WasteFactors {
  cement: number; // 0.02-0.03 (2-3%)
  steel: number; // 0.03-0.05 (3-5%)
  sand: number; // 0.05-0.08 (5-8%)
  aggregate: number; // 0.05-0.08 (5-8%)
  bricks: number; // 0.02-0.03 (2-3%)
  contingency: number; // 0.03-0.05 (3-5%)
}

export interface EquipmentCosts {
  concreteMixer: number; // Daily rental
  scaffolding: number; // Per sq.ft
  crane: number; // Per day
  transportation: number; // Per trip
}

export interface SeasonalMultipliers {
  peakSeason: number; // Mar-May: 1.15-1.20 (+15-20%)
  monsoon: number; // Jun-Sep: 0.90-0.95 (-5-10%)
  normal: number; // Oct-Feb: 1.0 (baseline)
}

export interface QualityMultipliers {
  cement: {
    OPC43: number;
    OPC53: number;
    PPC: number;
    SRC: number;
  };
  steel: {
    Fe500: number;
    Fe550: number;
  };
  bricks: {
    red_clay: number;
    fly_ash: number;
    aac_blocks: number;
  };
}

// Form state types
export interface ProjectDetailsForm {
  location: string;
  area: string;
  floors: number[];
  floorData: FloorData[];
  quality: 'basic' | 'standard' | 'premium';
  cementGrade: 'OPC43' | 'OPC53' | 'PPC' | 'SRC';
  steelGrade: 'Fe500' | 'Fe550';
  brickType: 'red_clay' | 'fly_ash' | 'aac_blocks';
}

export interface MaterialsForm {
  cement: MaterialItem;
  steel: MaterialItem;
  sand: MaterialItem;
  bricks: MaterialItem;
  aggregate: MaterialItem;
}

export interface LaborForm {
  laborWages: LaborWagesData;
  serviceCosts: ServiceCostsData;
  materials: LaborMaterialsData;
}

// Component prop types
export interface EducationalTooltipProps {
  content: string;
}

export interface MaterialCardProps {
  title: string;
  icon: string;
  description: string;
  educational: string;
  quantity: number;
  rate: number;
  cost: number;
  onQuantityChange: (value: number) => void;
  onRateChange: (value: number) => void;
  unit: string;
  rateUnit: string;
  wastePercentage?: number;
}

export interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

// Project templates
export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  floors: number;
  floorData: FloorData[];
  area: number;
  quality: 'basic' | 'standard' | 'premium';
}

// Utility types
export type QualityType = 'basic' | 'standard' | 'premium';
export type LocationType = 'hyderabad' | 'bangalore' | 'chennai' | 'mumbai' | 'delhi' | 'pune';
export type CementGrade = 'OPC43' | 'OPC53' | 'PPC' | 'SRC';
export type SteelGrade = 'Fe500' | 'Fe550';
export type BrickType = 'red_clay' | 'fly_ash' | 'aac_blocks';
export type SeasonType = 'peak' | 'monsoon' | 'normal';
