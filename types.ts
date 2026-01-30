export interface Tool {
  name: string;
  url?: string;
  group?: string; // For grouped tools like in Category 5
  description?: string; // Optional short description
  dateAdded?: string; // ISO Date string for sorting
}

export interface Feature {
  name: string;
  description?: string;
}

export interface Category {
  id: string;
  title: string;
  shortTitle?: string;
  description: string; // "Why designers care"
  tools: Tool[];
  features: string[]; // Or Feature[] if complex
  color: string;
  isDark: boolean; // Determines if white text is needed for contrast
  iconName: string;
}

export type ViewMode = 'grid' | 'detail' | 'tool-index' | 'admin';