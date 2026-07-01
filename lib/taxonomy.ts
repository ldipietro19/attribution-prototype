export type Confidence = "high" | "medium" | "low";
export type FieldSource = "plm" | "ai" | "vendor";

export type AttributeField = {
  label: string;
  key: string;
  options?: string[];
  type: "select" | "text";
  source: FieldSource;    // where the value comes from
  dpp?: boolean;
  confidence?: Confidence; // only relevant for source="ai"
};

export type Category = {
  name: string;
  fields: AttributeField[];
};

// Color & fabric attributes — AI-attributed from image/description
export const colorFields: AttributeField[] = [
  { label: "Colorway Name",     key: "colorway_name",    type: "text",   source: "ai", confidence: "medium" },
  { label: "Color Family",      key: "color_family",     type: "select", source: "ai", confidence: "high",
    options: ["Neutral", "Black", "White", "Blue", "Red", "Pink", "Green", "Yellow", "Purple", "Orange", "Brown", "Multi"] },
  { label: "Primary Color",     key: "primary_color",    type: "text",   source: "ai", confidence: "high" },
  { label: "Secondary Color",   key: "secondary_color",  type: "text",   source: "ai", confidence: "medium" },
  { label: "Pantone (Primary)", key: "pantone_primary",  type: "text",   source: "ai", confidence: "low" },
  { label: "Color Count",       key: "color_count",      type: "select", source: "ai", confidence: "high",
    options: ["Solid", "2-tone", "3-tone", "Multi"] },
];

// EU Digital Product Passport fields
// fiber/origin/care = AI can infer; rest = must come from vendor
export const dppFields: AttributeField[] = [
  { label: "Fiber Composition",          key: "dpp_fiber_composition", type: "text",   source: "ai",     dpp: true, confidence: "medium" },
  { label: "Country of Origin",          key: "dpp_country_of_origin", type: "text",   source: "ai",     dpp: true, confidence: "medium" },
  { label: "Care / Recycling",           key: "dpp_care_recycling",    type: "select", source: "ai",     dpp: true, confidence: "medium",
    options: ["Machine Wash Cold — Recyclable", "Hand Wash Only — Recyclable", "Dry Clean Only — Check local recycling", "Machine Wash Warm — Recyclable", "Hand Wash — Not Recyclable"] },
  { label: "Carbon Footprint (kg CO₂e)", key: "dpp_carbon_footprint",  type: "text",   source: "vendor", dpp: true },
  { label: "Repairability (1–10)",       key: "dpp_repairability",     type: "text",   source: "vendor", dpp: true },
  { label: "Hazardous Substances",       key: "dpp_hazardous",         type: "select", source: "vendor", dpp: true,
    options: ["REACH Compliant — None detected", "Under review", "Contains restricted substances"] },
  { label: "Tier 1 Supplier",            key: "dpp_supplier",          type: "text",   source: "vendor", dpp: true },
  { label: "Water Consumption (L/unit)", key: "dpp_water",             type: "text",   source: "vendor", dpp: true },
];

export const taxonomy: Record<string, Category> = {
  dress: {
    name: "Dress",
    fields: [
      { label: "Silhouette",  key: "silhouette",  type: "select", source: "ai", confidence: "high",   options: ["A-Line", "Bodycon", "Shift", "Wrap", "Maxi", "Mini", "Midi", "Fit & Flare", "Slip"] },
      { label: "Neckline",    key: "neckline",    type: "select", source: "ai", confidence: "high",   options: ["Crew", "V-Neck", "Scoop", "Square", "Halter", "Off-Shoulder", "Strapless", "Cowl", "Turtleneck"] },
      { label: "Sleeve Type", key: "sleeve_type", type: "select", source: "ai", confidence: "high",   options: ["Sleeveless", "Short Sleeve", "Long Sleeve", "3/4 Sleeve", "Cap Sleeve", "Puff Sleeve", "Spaghetti Strap"] },
      { label: "Length",      key: "length",      type: "select", source: "ai", confidence: "high",   options: ["Mini", "Knee-Length", "Midi", "Maxi", "Floor-Length"] },
      { label: "Fit",         key: "fit",         type: "select", source: "ai", confidence: "medium", options: ["Slim", "Regular", "Relaxed", "Oversized"] },
      { label: "Occasion",    key: "occasion",    type: "select", source: "ai", confidence: "medium", options: ["Casual", "Work", "Evening", "Formal", "Beach", "Bridal", "Cocktail"] },
      { label: "Closure",     key: "closure",     type: "select", source: "ai", confidence: "medium", options: ["Pull-On", "Zip Back", "Zip Side", "Button Front", "Tie", "Hook & Eye"] },
      { label: "Lining",      key: "lining",      type: "select", source: "ai", confidence: "low",    options: ["Lined", "Unlined", "Partially Lined"] },
      { label: "Care",        key: "care",        type: "select", source: "vendor", options: ["Machine Wash Cold", "Hand Wash Only", "Dry Clean Only", "Machine Wash Warm"] },
      { label: "Style Notes", key: "style_notes", type: "text",   source: "ai", confidence: "high" },
    ],
  },
  top: {
    name: "Top",
    fields: [
      { label: "Style",       key: "style",       type: "select", source: "ai", confidence: "high",   options: ["Blouse", "T-Shirt", "Tank", "Bodysuit", "Crop Top", "Tunic", "Button-Down", "Polo"] },
      { label: "Neckline",    key: "neckline",    type: "select", source: "ai", confidence: "high",   options: ["Crew", "V-Neck", "Scoop", "Square", "Halter", "Off-Shoulder", "Cowl", "Turtleneck"] },
      { label: "Sleeve Type", key: "sleeve_type", type: "select", source: "ai", confidence: "high",   options: ["Sleeveless", "Short Sleeve", "Long Sleeve", "3/4 Sleeve", "Cap Sleeve", "Puff Sleeve"] },
      { label: "Fit",         key: "fit",         type: "select", source: "ai", confidence: "medium", options: ["Slim", "Regular", "Relaxed", "Oversized", "Cropped"] },
      { label: "Occasion",    key: "occasion",    type: "select", source: "ai", confidence: "medium", options: ["Casual", "Work", "Evening", "Formal", "Beach", "Active"] },
      { label: "Closure",     key: "closure",     type: "select", source: "ai", confidence: "medium", options: ["Pull-On", "Button Front", "Zip", "Tie", "Hook & Eye"] },
      { label: "Care",        key: "care",        type: "select", source: "vendor", options: ["Machine Wash Cold", "Hand Wash Only", "Dry Clean Only", "Machine Wash Warm"] },
      { label: "Style Notes", key: "style_notes", type: "text",   source: "ai", confidence: "high" },
    ],
  },
  pant: {
    name: "Pant",
    fields: [
      { label: "Style",       key: "style",       type: "select", source: "ai", confidence: "high",   options: ["Trouser", "Jogger", "Legging", "Wide Leg", "Straight Leg", "Skinny", "Flare", "Cargo", "Cropped"] },
      { label: "Rise",        key: "rise",        type: "select", source: "ai", confidence: "high",   options: ["Low Rise", "Mid Rise", "High Rise"] },
      { label: "Leg Opening", key: "leg_opening", type: "select", source: "ai", confidence: "high",   options: ["Slim", "Straight", "Wide", "Flared", "Tapered"] },
      { label: "Fit",         key: "fit",         type: "select", source: "ai", confidence: "medium", options: ["Slim", "Regular", "Relaxed", "Oversized"] },
      { label: "Occasion",    key: "occasion",    type: "select", source: "ai", confidence: "medium", options: ["Casual", "Work", "Evening", "Formal", "Active", "Beach"] },
      { label: "Closure",     key: "closure",     type: "select", source: "ai", confidence: "medium", options: ["Pull-On", "Zip Fly", "Button Fly", "Elastic Waist", "Drawstring"] },
      { label: "Care",        key: "care",        type: "select", source: "vendor", options: ["Machine Wash Cold", "Hand Wash Only", "Dry Clean Only", "Machine Wash Warm"] },
      { label: "Style Notes", key: "style_notes", type: "text",   source: "ai", confidence: "high" },
    ],
  },
};

// PLM fields — read-only, sourced directly from Centric/Flex
export const plmFields: { label: string; key: string }[] = [
  { label: "Season",        key: "plm_season" },
  { label: "Department",    key: "plm_department" },
  { label: "Colorway Code", key: "plm_colorway_code" },
  { label: "PLM Status",    key: "plm_status" },
  { label: "Created",       key: "plm_created" },
];
