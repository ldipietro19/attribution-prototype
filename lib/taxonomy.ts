export type AttributeField = {
  label: string;
  key: string;
  options?: string[];
  type: "select" | "text";
};

export type Category = {
  name: string;
  fields: AttributeField[];
};

export const taxonomy: Record<string, Category> = {
  dress: {
    name: "Dress",
    fields: [
      { label: "Silhouette", key: "silhouette", type: "select", options: ["A-Line", "Bodycon", "Shift", "Wrap", "Maxi", "Mini", "Midi", "Fit & Flare", "Slip"] },
      { label: "Neckline", key: "neckline", type: "select", options: ["Crew", "V-Neck", "Scoop", "Square", "Halter", "Off-Shoulder", "Strapless", "Cowl", "Turtleneck"] },
      { label: "Sleeve Type", key: "sleeve_type", type: "select", options: ["Sleeveless", "Short Sleeve", "Long Sleeve", "3/4 Sleeve", "Cap Sleeve", "Puff Sleeve", "Spaghetti Strap"] },
      { label: "Length", key: "length", type: "select", options: ["Mini", "Knee-Length", "Midi", "Maxi", "Floor-Length"] },
      { label: "Fabric", key: "fabric", type: "select", options: ["Cotton", "Polyester", "Silk", "Linen", "Jersey", "Chiffon", "Satin", "Velvet", "Denim", "Lace", "Knit"] },
      { label: "Pattern", key: "pattern", type: "select", options: ["Solid", "Stripe", "Floral", "Plaid", "Animal Print", "Abstract", "Geometric", "Polka Dot"] },
      { label: "Fit", key: "fit", type: "select", options: ["Slim", "Regular", "Relaxed", "Oversized"] },
      { label: "Occasion", key: "occasion", type: "select", options: ["Casual", "Work", "Evening", "Formal", "Beach", "Bridal", "Cocktail"] },
      { label: "Care Instructions", key: "care", type: "select", options: ["Machine Wash Cold", "Hand Wash Only", "Dry Clean Only", "Machine Wash Warm"] },
      { label: "Closure", key: "closure", type: "select", options: ["Pull-On", "Zip Back", "Zip Side", "Button Front", "Tie", "Hook & Eye"] },
      { label: "Lining", key: "lining", type: "select", options: ["Lined", "Unlined", "Partially Lined"] },
      { label: "Style Notes", key: "style_notes", type: "text" },
    ],
  },
  top: {
    name: "Top",
    fields: [
      { label: "Style", key: "style", type: "select", options: ["Blouse", "T-Shirt", "Tank", "Bodysuit", "Crop Top", "Tunic", "Button-Down", "Polo"] },
      { label: "Neckline", key: "neckline", type: "select", options: ["Crew", "V-Neck", "Scoop", "Square", "Halter", "Off-Shoulder", "Cowl", "Turtleneck"] },
      { label: "Sleeve Type", key: "sleeve_type", type: "select", options: ["Sleeveless", "Short Sleeve", "Long Sleeve", "3/4 Sleeve", "Cap Sleeve", "Puff Sleeve"] },
      { label: "Fabric", key: "fabric", type: "select", options: ["Cotton", "Polyester", "Silk", "Linen", "Jersey", "Chiffon", "Satin", "Knit", "Lace"] },
      { label: "Pattern", key: "pattern", type: "select", options: ["Solid", "Stripe", "Floral", "Plaid", "Animal Print", "Abstract", "Geometric", "Polka Dot"] },
      { label: "Fit", key: "fit", type: "select", options: ["Slim", "Regular", "Relaxed", "Oversized", "Cropped"] },
      { label: "Occasion", key: "occasion", type: "select", options: ["Casual", "Work", "Evening", "Formal", "Beach", "Active"] },
      { label: "Care Instructions", key: "care", type: "select", options: ["Machine Wash Cold", "Hand Wash Only", "Dry Clean Only", "Machine Wash Warm"] },
      { label: "Closure", key: "closure", type: "select", options: ["Pull-On", "Button Front", "Zip", "Tie", "Hook & Eye"] },
      { label: "Style Notes", key: "style_notes", type: "text" },
    ],
  },
  pant: {
    name: "Pant",
    fields: [
      { label: "Style", key: "style", type: "select", options: ["Trouser", "Jogger", "Legging", "Wide Leg", "Straight Leg", "Skinny", "Flare", "Cargo", "Cropped"] },
      { label: "Rise", key: "rise", type: "select", options: ["Low Rise", "Mid Rise", "High Rise"] },
      { label: "Leg Opening", key: "leg_opening", type: "select", options: ["Slim", "Straight", "Wide", "Flared", "Tapered"] },
      { label: "Fabric", key: "fabric", type: "select", options: ["Cotton", "Polyester", "Denim", "Linen", "Wool", "Jersey", "Velvet", "Leather", "Twill"] },
      { label: "Pattern", key: "pattern", type: "select", options: ["Solid", "Stripe", "Plaid", "Animal Print", "Abstract", "Geometric"] },
      { label: "Fit", key: "fit", type: "select", options: ["Slim", "Regular", "Relaxed", "Oversized"] },
      { label: "Occasion", key: "occasion", type: "select", options: ["Casual", "Work", "Evening", "Formal", "Active", "Beach"] },
      { label: "Closure", key: "closure", type: "select", options: ["Pull-On", "Zip Fly", "Button Fly", "Elastic Waist", "Drawstring"] },
      { label: "Care Instructions", key: "care", type: "select", options: ["Machine Wash Cold", "Hand Wash Only", "Dry Clean Only", "Machine Wash Warm"] },
      { label: "Style Notes", key: "style_notes", type: "text" },
    ],
  },
};
