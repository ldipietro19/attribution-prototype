export type Confidence = "high" | "medium" | "low";

export type AttributeField = {
  label: string;
  key: string;
  options?: string[];
  type: "select" | "text";
  dpp?: boolean;           // EU Digital Product Passport required field
  aiInferable?: boolean;   // AI can attempt to fill; false = must come from vendor
  confidence?: Confidence; // Typical AI confidence for this field type
};

export type Category = {
  name: string;
  fields: AttributeField[];
};

// Color & fabric attributes — shared across all categories
export const colorFields: AttributeField[] = [
  { label: "Colorway Name",   key: "colorway_name",    type: "text",   confidence: "medium" },
  { label: "Color Family",    key: "color_family",     type: "select", confidence: "high",
    options: ["Neutral", "Black", "White", "Blue", "Red", "Pink", "Green", "Yellow", "Purple", "Orange", "Brown", "Multi"] },
  { label: "Primary Color",   key: "primary_color",    type: "text",   confidence: "high" },
  { label: "Secondary Color", key: "secondary_color",  type: "text",   confidence: "medium" },
  { label: "Pantone (Primary)", key: "pantone_primary", type: "text",  confidence: "low" },
  { label: "Color Count",     key: "color_count",      type: "select", confidence: "high",
    options: ["Solid", "2-tone", "3-tone", "Multi"] },
];

// EU Digital Product Passport — mandatory for all textiles sold in EU by 2027
export const dppFields: AttributeField[] = [
  { label: "Fiber Composition",          key: "dpp_fiber_composition", type: "text",   dpp: true, aiInferable: true,  confidence: "medium" },
  { label: "Country of Origin",          key: "dpp_country_of_origin", type: "text",   dpp: true, aiInferable: true,  confidence: "medium" },
  { label: "Care / Recycling",           key: "dpp_care_recycling",    type: "select", dpp: true, aiInferable: true,  confidence: "medium",
    options: ["Machine Wash Cold — Recyclable", "Hand Wash Only — Recyclable", "Dry Clean Only — Check local recycling", "Machine Wash Warm — Recyclable", "Hand Wash — Not Recyclable"] },
  { label: "Carbon Footprint (kg CO₂e)", key: "dpp_carbon_footprint",  type: "text",   dpp: true, aiInferable: false },
  { label: "Repairability (1–10)",       key: "dpp_repairability",     type: "text",   dpp: true, aiInferable: false },
  { label: "Hazardous Substances",       key: "dpp_hazardous",         type: "select", dpp: true, aiInferable: false,
    options: ["REACH Compliant — None detected", "Under review", "Contains restricted substances"] },
  { label: "Tier 1 Supplier",            key: "dpp_supplier",          type: "text",   dpp: true, aiInferable: false },
  { label: "Water Consumption (L/unit)", key: "dpp_water",             type: "text",   dpp: true, aiInferable: false },
];

export const taxonomy: Record<string, Category> = {
  dress: {
    name: "Dress",
    fields: [
      { label: "Silhouette",   key: "silhouette",  type: "select", confidence: "high",   options: ["A-Line", "Bodycon", "Shift", "Wrap", "Maxi", "Mini", "Midi", "Fit & Flare", "Slip"] },
      { label: "Neckline",     key: "neckline",    type: "select", confidence: "high",   options: ["Crew", "V-Neck", "Scoop", "Square", "Halter", "Off-Shoulder", "Strapless", "Cowl", "Turtleneck"] },
      { label: "Sleeve Type",  key: "sleeve_type", type: "select", confidence: "high",   options: ["Sleeveless", "Short Sleeve", "Long Sleeve", "3/4 Sleeve", "Cap Sleeve", "Puff Sleeve", "Spaghetti Strap"] },
      { label: "Length",       key: "length",      type: "select", confidence: "high",   options: ["Mini", "Knee-Length", "Midi", "Maxi", "Floor-Length"] },
      { label: "Fit",          key: "fit",         type: "select", confidence: "medium", options: ["Slim", "Regular", "Relaxed", "Oversized"] },
      { label: "Occasion",     key: "occasion",    type: "select", confidence: "medium", options: ["Casual", "Work", "Evening", "Formal", "Beach", "Bridal", "Cocktail"] },
      { label: "Closure",      key: "closure",     type: "select", confidence: "medium", options: ["Pull-On", "Zip Back", "Zip Side", "Button Front", "Tie", "Hook & Eye"] },
      { label: "Lining",       key: "lining",      type: "select", confidence: "low",    options: ["Lined", "Unlined", "Partially Lined"] },
      { label: "Care",         key: "care",        type: "select", confidence: "low",    options: ["Machine Wash Cold", "Hand Wash Only", "Dry Clean Only", "Machine Wash Warm"] },
      { label: "Style Notes",  key: "style_notes", type: "text",   confidence: "high" },
    ],
  },
  top: {
    name: "Top",
    fields: [
      { label: "Style",        key: "style",       type: "select", confidence: "high",   options: ["Blouse", "T-Shirt", "Tank", "Bodysuit", "Crop Top", "Tunic", "Button-Down", "Polo"] },
      { label: "Neckline",     key: "neckline",    type: "select", confidence: "high",   options: ["Crew", "V-Neck", "Scoop", "Square", "Halter", "Off-Shoulder", "Cowl", "Turtleneck"] },
      { label: "Sleeve Type",  key: "sleeve_type", type: "select", confidence: "high",   options: ["Sleeveless", "Short Sleeve", "Long Sleeve", "3/4 Sleeve", "Cap Sleeve", "Puff Sleeve"] },
      { label: "Fit",          key: "fit",         type: "select", confidence: "medium", options: ["Slim", "Regular", "Relaxed", "Oversized", "Cropped"] },
      { label: "Occasion",     key: "occasion",    type: "select", confidence: "medium", options: ["Casual", "Work", "Evening", "Formal", "Beach", "Active"] },
      { label: "Closure",      key: "closure",     type: "select", confidence: "medium", options: ["Pull-On", "Button Front", "Zip", "Tie", "Hook & Eye"] },
      { label: "Care",         key: "care",        type: "select", confidence: "low",    options: ["Machine Wash Cold", "Hand Wash Only", "Dry Clean Only", "Machine Wash Warm"] },
      { label: "Style Notes",  key: "style_notes", type: "text",   confidence: "high" },
    ],
  },
  pant: {
    name: "Pant",
    fields: [
      { label: "Style",        key: "style",        type: "select", confidence: "high",   options: ["Trouser", "Jogger", "Legging", "Wide Leg", "Straight Leg", "Skinny", "Flare", "Cargo", "Cropped"] },
      { label: "Rise",         key: "rise",         type: "select", confidence: "high",   options: ["Low Rise", "Mid Rise", "High Rise"] },
      { label: "Leg Opening",  key: "leg_opening",  type: "select", confidence: "high",   options: ["Slim", "Straight", "Wide", "Flared", "Tapered"] },
      { label: "Fit",          key: "fit",          type: "select", confidence: "medium", options: ["Slim", "Regular", "Relaxed", "Oversized"] },
      { label: "Occasion",     key: "occasion",     type: "select", confidence: "medium", options: ["Casual", "Work", "Evening", "Formal", "Active", "Beach"] },
      { label: "Closure",      key: "closure",      type: "select", confidence: "medium", options: ["Pull-On", "Zip Fly", "Button Fly", "Elastic Waist", "Drawstring"] },
      { label: "Care",         key: "care",         type: "select", confidence: "low",    options: ["Machine Wash Cold", "Hand Wash Only", "Dry Clean Only", "Machine Wash Warm"] },
      { label: "Style Notes",  key: "style_notes",  type: "text",   confidence: "high" },
    ],
  },
};
