import {
  profiles,
  education,
  skills,
  experience,
  projects,
  certifications,
  externalLinks,
  resumeFiles,
  type Profile,
  type InsertProfile,
  type Education,
  type InsertEducation,
  type Skill,
  type InsertSkill,
  type Experience,
  type InsertExperience,
  type Project,
  type InsertProject,
  type Certification,
  type InsertCertification,
  type ExternalLink,
  type InsertExternalLink,
  type ResumeFile,
  type InsertResumeFile,
  type CompleteProfile,
} from "@shared/schema";

export interface IStorage {
  // Profile methods
  getProfile(id: number): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: number, profile: Partial<InsertProfile>): Promise<Profile | undefined>;
  
  // Education methods
  getEducationByProfileId(profileId: number): Promise<Education[]>;
  createEducation(education: InsertEducation): Promise<Education>;
  updateEducation(id: number, education: Partial<InsertEducation>): Promise<Education | undefined>;
  deleteEducation(id: number): Promise<boolean>;
  
  // Skills methods
  getSkillsByProfileId(profileId: number): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill | undefined>;
  deleteSkill(id: number): Promise<boolean>;
  
  // Experience methods
  getExperienceByProfileId(profileId: number): Promise<Experience[]>;
  createExperience(experience: InsertExperience): Promise<Experience>;
  updateExperience(id: number, experience: Partial<InsertExperience>): Promise<Experience | undefined>;
  deleteExperience(id: number): Promise<boolean>;
  
  // Projects methods
  getProjectsByProfileId(profileId: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Certifications methods
  getCertificationsByProfileId(profileId: number): Promise<Certification[]>;
  createCertification(certification: InsertCertification): Promise<Certification>;
  updateCertification(id: number, certification: Partial<InsertCertification>): Promise<Certification | undefined>;
  deleteCertification(id: number): Promise<boolean>;
  
  // External Links methods
  getExternalLinksByProfileId(profileId: number): Promise<ExternalLink[]>;
  createExternalLink(link: InsertExternalLink): Promise<ExternalLink>;
  updateExternalLink(id: number, link: Partial<InsertExternalLink>): Promise<ExternalLink | undefined>;
  deleteExternalLink(id: number): Promise<boolean>;
  
  // Resume Files methods
  getResumeFilesByProfileId(profileId: number): Promise<ResumeFile[]>;
  createResumeFile(resumeFile: InsertResumeFile): Promise<ResumeFile>;
  deleteResumeFile(id: number): Promise<boolean>;
  
  // Complete profile
  getCompleteProfile(profileId: number): Promise<CompleteProfile | undefined>;
}

export class MemStorage implements IStorage {
  private profiles: Map<number, Profile> = new Map();
  private education: Map<number, Education> = new Map();
  private skills: Map<number, Skill> = new Map();
  private experience: Map<number, Experience> = new Map();
  private projects: Map<number, Project> = new Map();
  private certifications: Map<number, Certification> = new Map();
  private externalLinks: Map<number, ExternalLink> = new Map();
  private resumeFiles: Map<number, ResumeFile> = new Map();
  
  private currentProfileId = 1;
  private currentEducationId = 1;
  private currentSkillId = 1;
  private currentExperienceId = 1;
  private currentProjectId = 1;
  private currentCertificationId = 1;
  private currentExternalLinkId = 1;
  private currentResumeFileId = 1;

  constructor() {
    // Initialize with a default profile
    this.createProfile({
      fullName: "",
      email: "",
      phone: "",
      location: "",
      title: "",
      summary: "",
      profilePhoto: "",
      publicUrl: "",
    });
  }

  // Profile methods
  async getProfile(id: number): Promise<Profile | undefined> {
    return this.profiles.get(id);
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const id = this.currentProfileId++;
    const now = new Date();
    const newProfile: Profile = {
      ...profile,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.profiles.set(id, newProfile);
    return newProfile;
  }

  async updateProfile(id: number, profile: Partial<InsertProfile>): Promise<Profile | undefined> {
    const existing = this.profiles.get(id);
    if (!existing) return undefined;
    
    const updated: Profile = {
      ...existing,
      ...profile,
      updatedAt: new Date(),
    };
    this.profiles.set(id, updated);
    return updated;
  }

  // Education methods
  async getEducationByProfileId(profileId: number): Promise<Education[]> {
    return Array.from(this.education.values()).filter(edu => edu.profileId === profileId);
  }

  async createEducation(education: InsertEducation): Promise<Education> {
    const id = this.currentEducationId++;
    const newEducation: Education = { ...education, id };
    this.education.set(id, newEducation);
    return newEducation;
  }

  async updateEducation(id: number, education: Partial<InsertEducation>): Promise<Education | undefined> {
    const existing = this.education.get(id);
    if (!existing) return undefined;
    
    const updated: Education = { ...existing, ...education };
    this.education.set(id, updated);
    return updated;
  }

  async deleteEducation(id: number): Promise<boolean> {
    return this.education.delete(id);
  }

  // Skills methods
  async getSkillsByProfileId(profileId: number): Promise<Skill[]> {
    return Array.from(this.skills.values()).filter(skill => skill.profileId === profileId);
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const id = this.currentSkillId++;
    const newSkill: Skill = { ...skill, id };
    this.skills.set(id, newSkill);
    return newSkill;
  }

  async updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill | undefined> {
    const existing = this.skills.get(id);
    if (!existing) return undefined;
    
    const updated: Skill = { ...existing, ...skill };
    this.skills.set(id, updated);
    return updated;
  }

  async deleteSkill(id: number): Promise<boolean> {
    return this.skills.delete(id);
  }

  // Experience methods
  async getExperienceByProfileId(profileId: number): Promise<Experience[]> {
    return Array.from(this.experience.values()).filter(exp => exp.profileId === profileId);
  }

  async createExperience(experience: InsertExperience): Promise<Experience> {
    const id = this.currentExperienceId++;
    const newExperience: Experience = { ...experience, id };
    this.experience.set(id, newExperience);
    return newExperience;
  }

  async updateExperience(id: number, experience: Partial<InsertExperience>): Promise<Experience | undefined> {
    const existing = this.experience.get(id);
    if (!existing) return undefined;
    
    const updated: Experience = { ...existing, ...experience };
    this.experience.set(id, updated);
    return updated;
  }

  async deleteExperience(id: number): Promise<boolean> {
    return this.experience.delete(id);
  }

  // Projects methods
  async getProjectsByProfileId(profileId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(project => project.profileId === profileId);
  }

  async createProject(project: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const newProject: Project = { ...project, id };
    this.projects.set(id, newProject);
    return newProject;
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined> {
    const existing = this.projects.get(id);
    if (!existing) return undefined;
    
    const updated: Project = { ...existing, ...project };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Certifications methods
  async getCertificationsByProfileId(profileId: number): Promise<Certification[]> {
    return Array.from(this.certifications.values()).filter(cert => cert.profileId === profileId);
  }

  async createCertification(certification: InsertCertification): Promise<Certification> {
    const id = this.currentCertificationId++;
    const newCertification: Certification = { ...certification, id };
    this.certifications.set(id, newCertification);
    return newCertification;
  }

  async updateCertification(id: number, certification: Partial<InsertCertification>): Promise<Certification | undefined> {
    const existing = this.certifications.get(id);
    if (!existing) return undefined;
    
    const updated: Certification = { ...existing, ...certification };
    this.certifications.set(id, updated);
    return updated;
  }

  async deleteCertification(id: number): Promise<boolean> {
    return this.certifications.delete(id);
  }

  // External Links methods
  async getExternalLinksByProfileId(profileId: number): Promise<ExternalLink[]> {
    return Array.from(this.externalLinks.values()).filter(link => link.profileId === profileId);
  }

  async createExternalLink(link: InsertExternalLink): Promise<ExternalLink> {
    const id = this.currentExternalLinkId++;
    const newLink: ExternalLink = { ...link, id };
    this.externalLinks.set(id, newLink);
    return newLink;
  }

  async updateExternalLink(id: number, link: Partial<InsertExternalLink>): Promise<ExternalLink | undefined> {
    const existing = this.externalLinks.get(id);
    if (!existing) return undefined;
    
    const updated: ExternalLink = { ...existing, ...link };
    this.externalLinks.set(id, updated);
    return updated;
  }

  async deleteExternalLink(id: number): Promise<boolean> {
    return this.externalLinks.delete(id);
  }

  // Resume Files methods
  async getResumeFilesByProfileId(profileId: number): Promise<ResumeFile[]> {
    return Array.from(this.resumeFiles.values()).filter(file => file.profileId === profileId);
  }

  async createResumeFile(resumeFile: InsertResumeFile): Promise<ResumeFile> {
    const id = this.currentResumeFileId++;
    const newResumeFile: ResumeFile = {
      ...resumeFile,
      id,
      uploadedAt: new Date(),
    };
    this.resumeFiles.set(id, newResumeFile);
    return newResumeFile;
  }

  async deleteResumeFile(id: number): Promise<boolean> {
    return this.resumeFiles.delete(id);
  }

  // Complete profile
  async getCompleteProfile(profileId: number): Promise<CompleteProfile | undefined> {
    const profile = await this.getProfile(profileId);
    if (!profile) return undefined;

    const [
      educationList,
      skillsList,
      experienceList,
      projectsList,
      certificationsList,
      externalLinksList,
      resumeFilesList,
    ] = await Promise.all([
      this.getEducationByProfileId(profileId),
      this.getSkillsByProfileId(profileId),
      this.getExperienceByProfileId(profileId),
      this.getProjectsByProfileId(profileId),
      this.getCertificationsByProfileId(profileId),
      this.getExternalLinksByProfileId(profileId),
      this.getResumeFilesByProfileId(profileId),
    ]);

    return {
      profile,
      education: educationList,
      skills: skillsList,
      experience: experienceList,
      projects: projectsList,
      certifications: certificationsList,
      externalLinks: externalLinksList,
      resumeFiles: resumeFilesList,
    };
  }
}

export const storage = new MemStorage();
