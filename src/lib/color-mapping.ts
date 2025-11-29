export const COLOR_MAPPING: Record<string, string[]> = {
  black: ["đen", "black", "đen nhám", "đen bóng", "huyền bí"],
  white: ["trắng", "white", "trắng tinh", "trắng sữa"],
  gray: ["xám", "gray", "ghi", "bạc", "silver"],
  navy: ["xanh than", "navy", "xanh dương đậm", "dark blue"],
  beige: ["be", "beige", "kem", "cream"],
  brown: ["nâu", "brown", "cà phê"],
  green: ["xanh lá", "green", "rêu", "xanh lục"],
  blue: ["xanh dương", "blue", "xanh", "xanh da trời"],
  red: ["đỏ", "red", "đỏ đô", "hồng"],
  pink: ["hồng", "pink"],
  yellow: ["vàng", "yellow"],
  purple: ["tím", "purple"],
  orange: ["cam", "orange"],
};

export const isColorMatch = (filterColor: string, productColor: string): boolean => {
  if (!filterColor || !productColor) return false;

  const normalizedFilter = filterColor.toLowerCase().trim();
  const normalizedProduct = productColor.toLowerCase().trim();

  // Direct match
  if (normalizedFilter === normalizedProduct) return true;

  // Check mapping
  const mappedColors = COLOR_MAPPING[normalizedFilter];
  if (mappedColors) {
    return mappedColors.some(mapped => normalizedProduct.includes(mapped));
  }

  return false;
};
