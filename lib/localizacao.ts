/** Lê o par lat/lng enviado pelo CampoLocalizacao; null se não marcado. */
export function lerLocalizacao(formData: FormData): { lat: number; lng: number } | null {
  const lat = formData.get("lat");
  const lng = formData.get("lng");
  if (lat == null || lng == null || lat === "" || lng === "") return null;
  const coords = { lat: Number(lat), lng: Number(lng) };
  if (Number.isNaN(coords.lat) || Number.isNaN(coords.lng)) return null;
  return coords;
}
