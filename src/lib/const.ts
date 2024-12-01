export const BRANDS = [
  { label: "NIKE", value: "Nike" },
  { label: "Adidas", value: "Adidas" },
];

export const MATERIALS = [
  { label: "Leather", value: "Leather" },
  { label: "Fabric", value: "Fabric" },
];

export const GENDERS = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Unisex", value: "Unisex" },
];

export const COLORS = [
  { label: "Red", hexValue: "#ff0000", value: "Red" },
  { label: "White", hexValue: "#ffffff", value: "White" },
  { label: "Black", hexValue: "#000000", value: "Black" },
];

export const CATEGORIES = [
  { label: "Boots", value: "Boots" },
  { label: "Sneakers", value: "Sneakers" },
  { label: "Dress Shoes", value: "Dress Shoes" },
  { label: "High-Top Sneakers", value: "High-Top Sneakers" },
  { label: "Slip-Ons", value: "Slip-Ons" },
  { label: "For Sports", value: "For Sports" },
];

export const ORDER_STATUSES = (status: 0 | 1 | 2 | -1) => {
  switch (status) {
    case 0:
      return "New";
    case 1:
      return "Processing";
    case 2:
      return "Finished";
    case -1:
      return "Canceled";
  }
};

export const SERVER_BASE_URL = "http://localhost:5000";
export const API_BASE_URL = "http://0.0.0.0:5000/api";
