import type { WasteFactors, SeasonalMultipliers, QualityMultipliers, SeasonType } from '@/types'

// Waste factors for different materials (as percentages)
export const DEFAULT_WASTE_FACTORS: WasteFactors = {
  cement: 0.025, // 2.5%
  steel: 0.04,   // 4%
  sand: 0.065,   // 6.5%
  aggregate: 0.065, // 6.5%
  bricks: 0.025, // 2.5%
  contingency: 0.04, // 4%
}

// Seasonal multipliers based on month
export const SEASONAL_MULTIPLIERS: SeasonalMultipliers = {
  peakSeason: 1.175, // Average of 15-20%
  monsoon: 0.925,    // Average of -5-10%
  normal: 1.0,       // Baseline
}

// Quality multipliers for different material grades
export const QUALITY_MULTIPLIERS: QualityMultipliers = {
  cement: {
    OPC43: 1.0,    // Baseline
    OPC53: 1.08,   // 8% premium
    PPC: 1.05,     // 5% premium
    SRC: 1.12,     // 12% premium
  },
  steel: {
    Fe500: 1.0,    // Baseline
    Fe550: 1.06,   // 6% premium
  },
  bricks: {
    red_clay: 1.0,     // Baseline
    fly_ash: 0.92,     // 8% savings
    aac_blocks: 1.15,   // 15% premium
  },
}

// Equipment rental costs (daily rates in INR)
export const EQUIPMENT_COSTS = {
  concreteMixer: 1500,   // Per day
  scaffolding: 8,        // Per sq.ft per month
  crane: 5000,          // Per day
  transportation: 2000,  // Per trip
}

// GST rates
export const GST_RATES = {
  materials: 0.18,  // 18% GST on materials
  labor: 0.18,      // 18% GST on services
  equipment: 0.18,  // 18% GST on equipment rental
}

// Location-based multipliers (Delhi = 1.0 baseline)
export const LOCATION_MULTIPLIERS = {
  delhi: 1.0,
  mumbai: 1.15,
  bangalore: 1.08,
  chennai: 0.95,
  hyderabad: 0.98,
  pune: 1.02,
  kolkata: 0.92,
  ahmedabad: 0.88,
}

// Get current season based on month
export const getCurrentSeason = (): SeasonType => {
  const month = new Date().getMonth() + 1; // 1-12

  if (month >= 3 && month <= 5) {
    return 'peak'; // Mar-May
  } else if (month >= 6 && month <= 9) {
    return 'monsoon'; // Jun-Sep
  } else {
    return 'normal'; // Oct-Feb
  }
}

// Calculate total material cost with waste and quality factors
export const calculateMaterialCost = (
  baseQuantity: number,
  baseRate: number,
  wastePercentage: number = 0,
  qualityMultiplier: number = 1.0,
  seasonalMultiplier: number = 1.0,
  locationMultiplier: number = 1.0
): number => {
  // Apply waste factor
  const quantityWithWaste = baseQuantity * (1 + wastePercentage);

  // Calculate base cost
  const baseCost = quantityWithWaste * baseRate;

  // Apply multipliers
  const adjustedCost = baseCost * qualityMultiplier * seasonalMultiplier * locationMultiplier;

  // Add GST
  const costWithGST = adjustedCost * (1 + GST_RATES.materials);

  return Math.round(costWithGST);
}

// Calculate labor cost with seasonal adjustments
export const calculateLaborCost = (
  dailyRate: number,
  days: number,
  count: number = 1,
  seasonalMultiplier: number = 1.0,
  locationMultiplier: number = 1.0
): number => {
  const baseCost = dailyRate * days * count;
  const adjustedCost = baseCost * seasonalMultiplier * locationMultiplier;
  const costWithGST = adjustedCost * (1 + GST_RATES.labor);

  return Math.round(costWithGST);
}

// Calculate equipment costs
export const calculateEquipmentCost = (
  equipmentType: keyof typeof EQUIPMENT_COSTS,
  duration: number, // in days
  quantity: number = 1
): number => {
  const dailyRate = EQUIPMENT_COSTS[equipmentType];
  const baseCost = dailyRate * duration * quantity;
  const costWithGST = baseCost * (1 + GST_RATES.equipment);

  return Math.round(costWithGST);
}

// Calculate total project cost with all factors
export const calculateTotalProjectCost = (
  materialsCost: number,
  laborCost: number,
  equipmentCost: number = 0,
  contingencyPercentage: number = DEFAULT_WASTE_FACTORS.contingency
): number => {
  const subtotal = materialsCost + laborCost + equipmentCost;
  const contingencyAmount = subtotal * contingencyPercentage;
  const total = subtotal + contingencyAmount;

  return Math.round(total);
}

// Get location multiplier
export const getLocationMultiplier = (location: string): number => {
  const normalizedLocation = location.toLowerCase().replace(/\s+/g, '');
  return LOCATION_MULTIPLIERS[normalizedLocation as keyof typeof LOCATION_MULTIPLIERS] || 1.0;
}

// Get seasonal multiplier
export const getSeasonalMultiplier = (season?: SeasonType): number => {
  if (!season) {
    season = getCurrentSeason();
  }
  return SEASONAL_MULTIPLIERS[season];
}

// Format currency in Indian Rupees
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Calculate percentage difference
export const calculatePercentageDifference = (original: number, updated: number): number => {
  if (original === 0) return 0;
  return ((updated - original) / original) * 100;
};
