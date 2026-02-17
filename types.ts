
export interface ModuleDetail {
  id: string;
  title: string;
  category: 'Gestão' | 'Social' | 'Financeiro' | 'Inovação';
  description: string;
  features: string[];
  benefits: string[];
  icon: string;
}

export interface SurveyResponse {
  usageLikelihood: number;
  valuableModules: string[];
  feedback: string;
  contactEmail?: string;
}
