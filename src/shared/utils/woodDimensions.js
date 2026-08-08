export const MIN_WOOD_DIMENSION_MM = 300;
export const isValidWoodDimension = (value) => {
  const num = Number(value);
  return Number.isFinite(num) && num >= MIN_WOOD_DIMENSION_MM;
};
