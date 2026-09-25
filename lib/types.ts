export type Cocktail = {
  id: string;
  nom: string;
  description: string | null;
  prix: number;
  categorie: "avec_alcool" | "sans_alcool" | "offert";
  parfums: string[];
  note_speciale: string | null;
  photo_url: string | null;
  mis_en_avant: boolean;
  position: number;
  actif: boolean;
};

export type Evenement = {
  id: string;
  titre: string;
  date_evenement: string | null;
  lieu: string | null;
  flyer_url: string | null;
  position: number;
  actif: boolean;
};

export type AlbumPhoto = {
  id: string;
  photo_url: string;
  position: number;
};

export type Avis = {
  id?: string;
  note: number;
  commentaire: string | null;
  created_at: string;
};
