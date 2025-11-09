import { JobRepository } from "../repository/JobRepository";
import { CreateJobSchema } from "../schemas/JobSchema";
import { IJobFilters } from '../@types/job.types';

export class JobService {
    constructor(private repository: JobRepository) {}

    async createJob(jobData: CreateJobSchema) {
        const createdJob = await this.repository.createJob(jobData);
        return createdJob.toJSON();
    }

    async getJobById(jobId: number) {
        const job = await this.repository.getJobById(jobId);
        return job ? job.toJSON() : null;
    }

    async getAllJobs(filters: IJobFilters) {
        const jobs = await this.repository.getAllJobs(filters);
        return jobs.map(job => job.toJSON());
    }

    async getJobsByCompanyId(filters: IJobFilters, companyId: number) {
        const jobs = await this.repository.getJobsByCompany(filters, companyId);
        return jobs.map(job => job.toJSON());
    }

    async updateJob(jobData: CreateJobSchema, idJob: number) {
        const updatedJob = await this.repository.updateJob(jobData, idJob);
        return updatedJob.toJSON();
    }

    async deleteJob(jobId: number) {
        const message = await this.repository.deleteJob(jobId);
        return message;
    }
}