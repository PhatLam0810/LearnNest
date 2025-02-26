export interface UpdateLibraryData {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  type: string;
  tags: string[];
}

export interface UpdateLibraryFormData {
  title: string;
  description: string;
  url: string;
  type: string;
  tag: string[];
  text: string;
}
