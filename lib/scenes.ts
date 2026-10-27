export const SCENES = [
  { id: "top", label: "The hall" },
  { id: "collection", label: "Collection" },
  { id: "seal", label: "The seal" },
  { id: "learning", label: "Learning" },
  { id: "warnings", label: "The record" },
  { id: "thesis", label: "Thesis" },
  { id: "inquiry", label: "Viewing" },
] as const;

export function sceneById(id: string) {
  return SCENES.find((scene) => scene.id === id);
}
