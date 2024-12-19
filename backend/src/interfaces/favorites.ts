export interface Favorite {
  userId: string; // Kopplat till användaren
  id: string; // Kopplat till ett menyobjekt
  name: string; // Namnet på favoriten (valfritt)
  addedAt: string; // Datum då den sparades (kan vara nyttigt)
}