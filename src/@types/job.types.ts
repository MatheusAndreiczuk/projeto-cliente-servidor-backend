export interface ISalaryRange {
  min?: number;
  max?: number;
}

export interface IJobFilters {
  title?: string;
  area?: string;
  description?: string;
  location?: string;
  company?: string; 
  salary_range?: ISalaryRange;
}