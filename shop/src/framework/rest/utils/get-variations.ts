import groupBy from "lodash/groupBy";

export function getVariations(variations: object | undefined) {
  
  if (!variations) return {};
  let groups = groupBy(variations, "attribute.slug");
  return groups;
}
