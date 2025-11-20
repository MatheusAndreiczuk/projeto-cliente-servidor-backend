export interface IJobFilters {
  title?: string;
  area?: string;
  description?: string;
  company?: string; 
  state?: string;
  city?: string;
  salary_range?: { min?: number; max?: number; };
}
