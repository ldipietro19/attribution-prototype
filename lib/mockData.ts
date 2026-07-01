export type DppGap = {
  field: string;
  reason: string;
};

export type MockStyle = {
  id: string;
  styleNumber: string;
  name: string;
  category: "dress" | "top" | "pant";
  vendor: string;
  attributed: boolean;
  dppComplete: boolean;
  dppGaps: DppGap[];
  attributes: Record<string, string>;
  reviewStatus: "pending" | "reviewed" | "needs_input";
};

export type MockRun = {
  id: string;
  timestamp: string;
  stylesProcessed: number;
  attributed: number;
  dppGaps: number;
  newStyles: number;
  updatedStyles: number;
  source: string;
};

export const mockRuns: MockRun[] = [
  { id: "r1", timestamp: "2025-06-27T02:00:00Z", stylesProcessed: 12, attributed: 8, dppGaps: 4, newStyles: 12, updatedStyles: 0, source: "Centric PLM sync" },
  { id: "r2", timestamp: "2025-06-26T02:00:00Z", stylesProcessed: 3, attributed: 3, dppGaps: 0, newStyles: 2, updatedStyles: 1, source: "Centric PLM sync" },
  { id: "r3", timestamp: "2025-06-25T02:00:00Z", stylesProcessed: 7, attributed: 6, dppGaps: 2, newStyles: 5, updatedStyles: 2, source: "Centric PLM sync" },
  { id: "r4", timestamp: "2025-06-24T02:00:00Z", stylesProcessed: 0, attributed: 0, dppGaps: 0, newStyles: 0, updatedStyles: 0, source: "Centric PLM sync" },
  { id: "r5", timestamp: "2025-06-23T02:00:00Z", stylesProcessed: 18, attributed: 15, dppGaps: 6, newStyles: 14, updatedStyles: 4, source: "Centric PLM sync" },
];

export const mockRunDate = "2025-06-27T02:00:00Z"; // last nightly run

export const mockStyles: MockStyle[] = [
  {
    id: "1",
    styleNumber: "SS25-DR-001",
    name: "Riviera Wrap Midi",
    category: "dress",
    vendor: "Atelier Moreau",
    attributed: true,
    dppComplete: true,
    dppGaps: [],
    reviewStatus: "reviewed",
    attributes: {
      silhouette: "Wrap", neckline: "V-Neck", sleeve_type: "Short Sleeve", length: "Midi",
      fabric: "Silk", pattern: "Floral", fit: "Regular", occasion: "Evening",
      care: "Hand Wash Only", closure: "Tie", lining: "Lined",
      dpp_fiber_composition: "100% Silk", dpp_country_of_origin: "FR",
      dpp_care_recycling: "Hand Wash Only — Recyclable", dpp_carbon_footprint: "3.2",
      dpp_repairability: "7", dpp_hazardous: "REACH Compliant — None detected",
      dpp_supplier: "Maison Soie, Lyon FR", dpp_water: "420",
    },
  },
  {
    id: "2",
    styleNumber: "SS25-DR-002",
    name: "Capri Shift Mini",
    category: "dress",
    vendor: "Atelier Moreau",
    attributed: true,
    dppComplete: true,
    dppGaps: [],
    reviewStatus: "pending",
    attributes: {
      silhouette: "Shift", neckline: "Square", sleeve_type: "Sleeveless", length: "Mini",
      fabric: "Linen", pattern: "Solid", fit: "Regular", occasion: "Casual",
      care: "Machine Wash Cold", closure: "Pull-On", lining: "Unlined",
      dpp_fiber_composition: "100% Linen", dpp_country_of_origin: "IT",
      dpp_care_recycling: "Machine Wash Cold — Recyclable", dpp_carbon_footprint: "2.1",
      dpp_repairability: "8", dpp_hazardous: "REACH Compliant — None detected",
      dpp_supplier: "Tessuti Nord, Milan IT", dpp_water: "180",
    },
  },
  {
    id: "3",
    styleNumber: "SS25-DR-003",
    name: "Sorrento Bodycon",
    category: "dress",
    vendor: "Atelier Moreau",
    attributed: true,
    dppComplete: false,
    dppGaps: [
      { field: "Carbon Footprint", reason: "Vendor has not submitted lifecycle assessment" },
      { field: "Tier 1 Supplier", reason: "New factory — onboarding not complete" },
    ],
    reviewStatus: "needs_input",
    attributes: {
      silhouette: "Bodycon", neckline: "Scoop", sleeve_type: "Sleeveless", length: "Midi",
      fabric: "Jersey", pattern: "Solid", fit: "Slim", occasion: "Cocktail",
      care: "Machine Wash Cold", closure: "Pull-On", lining: "Unlined",
      dpp_fiber_composition: "92% Polyester, 8% Elastane", dpp_country_of_origin: "TR",
      dpp_care_recycling: "Machine Wash Cold — Recyclable",
      dpp_repairability: "5", dpp_hazardous: "REACH Compliant — None detected",
      dpp_supplier: "", dpp_carbon_footprint: "", dpp_water: "",
    },
  },
  {
    id: "4",
    styleNumber: "SS25-TP-001",
    name: "Marseille Button-Down",
    category: "top",
    vendor: "Numéro Blanc",
    attributed: true,
    dppComplete: true,
    dppGaps: [],
    reviewStatus: "reviewed",
    attributes: {
      style: "Button-Down", neckline: "Crew", sleeve_type: "Long Sleeve",
      fabric: "Cotton", pattern: "Stripe", fit: "Regular", occasion: "Work",
      care: "Machine Wash Cold", closure: "Button Front",
      dpp_fiber_composition: "100% Cotton", dpp_country_of_origin: "PT",
      dpp_care_recycling: "Machine Wash Cold — Recyclable", dpp_carbon_footprint: "1.8",
      dpp_repairability: "9", dpp_hazardous: "REACH Compliant — None detected",
      dpp_supplier: "Algodão Porto, Porto PT", dpp_water: "215",
    },
  },
  {
    id: "5",
    styleNumber: "SS25-TP-002",
    name: "Côte Halter",
    category: "top",
    vendor: "Numéro Blanc",
    attributed: true,
    dppComplete: true,
    dppGaps: [],
    reviewStatus: "pending",
    attributes: {
      style: "Tank", neckline: "Halter", sleeve_type: "Sleeveless",
      fabric: "Satin", pattern: "Solid", fit: "Slim", occasion: "Evening",
      care: "Hand Wash Only", closure: "Tie",
      dpp_fiber_composition: "100% Polyester", dpp_country_of_origin: "CN",
      dpp_care_recycling: "Hand Wash Only — Recyclable", dpp_carbon_footprint: "2.6",
      dpp_repairability: "5", dpp_hazardous: "REACH Compliant — None detected",
      dpp_supplier: "Zhejiang Silk & Weave Co., Hangzhou CN", dpp_water: "310",
    },
  },
  {
    id: "6",
    styleNumber: "SS25-TP-003",
    name: "Biarritz Crop",
    category: "top",
    vendor: "Numéro Blanc",
    attributed: true,
    dppComplete: false,
    dppGaps: [
      { field: "Carbon Footprint", reason: "Vendor has not submitted lifecycle assessment" },
      { field: "Water Consumption", reason: "Pending factory audit" },
      { field: "Hazardous Substances", reason: "New dye batch — REACH testing in progress" },
    ],
    reviewStatus: "needs_input",
    attributes: {
      style: "Crop Top", neckline: "Off-Shoulder", sleeve_type: "Puff Sleeve",
      fabric: "Cotton", pattern: "Floral", fit: "Cropped", occasion: "Casual",
      care: "Machine Wash Cold", closure: "Pull-On",
      dpp_fiber_composition: "100% Cotton", dpp_country_of_origin: "IN",
      dpp_care_recycling: "Machine Wash Cold — Recyclable",
      dpp_repairability: "8", dpp_hazardous: "Under review",
      dpp_supplier: "Rajasthan Textiles, Jaipur IN",
      dpp_carbon_footprint: "", dpp_water: "",
    },
  },
  {
    id: "7",
    styleNumber: "SS25-PT-001",
    name: "Monaco Wide Leg",
    category: "pant",
    vendor: "Atelier Moreau",
    attributed: true,
    dppComplete: true,
    dppGaps: [],
    reviewStatus: "reviewed",
    attributes: {
      style: "Wide Leg", rise: "High Rise", leg_opening: "Wide",
      fabric: "Linen", pattern: "Solid", fit: "Relaxed", occasion: "Work",
      closure: "Zip Fly", care: "Machine Wash Cold",
      dpp_fiber_composition: "55% Linen, 45% Cotton", dpp_country_of_origin: "IT",
      dpp_care_recycling: "Machine Wash Cold — Recyclable", dpp_carbon_footprint: "2.4",
      dpp_repairability: "8", dpp_hazardous: "REACH Compliant — None detected",
      dpp_supplier: "Tessuti Nord, Milan IT", dpp_water: "195",
    },
  },
  {
    id: "8",
    styleNumber: "SS25-PT-002",
    name: "Antibes Trouser",
    category: "pant",
    vendor: "Atelier Moreau",
    attributed: true,
    dppComplete: true,
    dppGaps: [],
    reviewStatus: "pending",
    attributes: {
      style: "Trouser", rise: "Mid Rise", leg_opening: "Straight",
      fabric: "Wool", pattern: "Plaid", fit: "Regular", occasion: "Work",
      closure: "Zip Fly", care: "Dry Clean Only",
      dpp_fiber_composition: "80% Wool, 20% Polyester", dpp_country_of_origin: "GB",
      dpp_care_recycling: "Dry Clean Only — Check local recycling", dpp_carbon_footprint: "4.1",
      dpp_repairability: "7", dpp_hazardous: "REACH Compliant — None detected",
      dpp_supplier: "Harris Tweed Authority, Isle of Harris GB", dpp_water: "890",
    },
  },
  {
    id: "9",
    styleNumber: "SS25-PT-003",
    name: "Cannes Jogger",
    category: "pant",
    vendor: "Numéro Blanc",
    attributed: true,
    dppComplete: true,
    dppGaps: [],
    reviewStatus: "reviewed",
    attributes: {
      style: "Jogger", rise: "Mid Rise", leg_opening: "Tapered",
      fabric: "Jersey", pattern: "Solid", fit: "Regular", occasion: "Casual",
      closure: "Drawstring", care: "Machine Wash Cold",
      dpp_fiber_composition: "60% Cotton, 40% Polyester", dpp_country_of_origin: "TR",
      dpp_care_recycling: "Machine Wash Cold — Recyclable", dpp_carbon_footprint: "2.0",
      dpp_repairability: "7", dpp_hazardous: "REACH Compliant — None detected",
      dpp_supplier: "Istanbul Active Wear, Istanbul TR", dpp_water: "240",
    },
  },
  {
    id: "10",
    styleNumber: "SS25-DR-004",
    name: "Nice Slip Maxi",
    category: "dress",
    vendor: "Maison Éclat",
    attributed: true,
    dppComplete: false,
    dppGaps: [
      { field: "Carbon Footprint", reason: "Vendor has not submitted lifecycle assessment" },
      { field: "Tier 1 Supplier", reason: "Supplier not yet registered in compliance portal" },
      { field: "Repairability Index", reason: "Assessment not submitted" },
    ],
    reviewStatus: "needs_input",
    attributes: {
      silhouette: "Slip", neckline: "Cowl", sleeve_type: "Spaghetti Strap", length: "Maxi",
      fabric: "Satin", pattern: "Solid", fit: "Relaxed", occasion: "Evening",
      care: "Hand Wash Only", closure: "Pull-On", lining: "Lined",
      dpp_fiber_composition: "100% Polyester", dpp_country_of_origin: "CN",
      dpp_care_recycling: "Hand Wash Only — Recyclable",
      dpp_hazardous: "REACH Compliant — None detected",
      dpp_supplier: "", dpp_carbon_footprint: "", dpp_repairability: "", dpp_water: "",
    },
  },
  {
    id: "11",
    styleNumber: "SS25-TP-004",
    name: "Provence Tunic",
    category: "top",
    vendor: "Maison Éclat",
    attributed: true,
    dppComplete: true,
    dppGaps: [],
    reviewStatus: "pending",
    attributes: {
      style: "Tunic", neckline: "V-Neck", sleeve_type: "3/4 Sleeve",
      fabric: "Linen", pattern: "Geometric", fit: "Relaxed", occasion: "Casual",
      care: "Machine Wash Cold", closure: "Pull-On",
      dpp_fiber_composition: "100% Linen", dpp_country_of_origin: "FR",
      dpp_care_recycling: "Machine Wash Cold — Recyclable", dpp_carbon_footprint: "1.9",
      dpp_repairability: "9", dpp_hazardous: "REACH Compliant — None detected",
      dpp_supplier: "Lin de France, Rouen FR", dpp_water: "170",
    },
  },
  {
    id: "12",
    styleNumber: "SS25-PT-004",
    name: "Éze Flare",
    category: "pant",
    vendor: "Maison Éclat",
    attributed: true,
    dppComplete: true,
    dppGaps: [],
    reviewStatus: "reviewed",
    attributes: {
      style: "Flare", rise: "High Rise", leg_opening: "Flared",
      fabric: "Denim", pattern: "Solid", fit: "Slim", occasion: "Casual",
      closure: "Zip Fly", care: "Machine Wash Cold",
      dpp_fiber_composition: "98% Cotton, 2% Elastane", dpp_country_of_origin: "TR",
      dpp_care_recycling: "Machine Wash Cold — Recyclable", dpp_carbon_footprint: "3.8",
      dpp_repairability: "8", dpp_hazardous: "REACH Compliant — None detected",
      dpp_supplier: "Denim House Bursa, Bursa TR", dpp_water: "680",
    },
  },
];
