import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Profile table
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  location: text("location"),
  title: text("title"),
  summary: text("summary"),
  profilePhoto: text("profile_photo"),
  publicUrl: text("public_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Education table
export const education = pgTable("education", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull(),
  institution: text("institution").notNull(),
  degree: text("degree").notNull(),
  fieldOfStudy: text("field_of_study"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  isCurrentlyStudying: boolean("is_currently_studying").default(false),
  description: text("description"),
});

// Skills table
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull(),
  name: text("name").notNull(),
  category: text("category").notNull(), // Technical, Soft Skills, etc.
  level: text("level"), // Beginner, Intermediate, Advanced, Expert
});

// Experience table
export const experience = pgTable("experience", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull(),
  jobTitle: text("job_title").notNull(),
  company: text("company").notNull(),
  location: text("location"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  isCurrentJob: boolean("is_current_job").default(false),
  description: text("description"),
});

// Projects table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  technologies: text("technologies").array(),
  projectUrl: text("project_url"),
  repositoryUrl: text("repository_url"),
  startDate: text("start_date"),
  endDate: text("end_date"),
});

// Certifications table
export const certifications = pgTable("certifications", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull(),
  name: text("name").notNull(),
  issuer: text("issuer").notNull(),
  issueDate: text("issue_date"),
  expiryDate: text("expiry_date"),
  credentialId: text("credential_id"),
  credentialUrl: text("credential_url"),
  isBlockchainVerified: boolean("is_blockchain_verified").default(false),
});

// External Links table
export const externalLinks = pgTable("external_links", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull(),
  platform: text("platform").notNull(), // LinkedIn, GitHub, Portfolio, etc.
  url: text("url").notNull(),
  displayText: text("display_text"),
});

// Resume Files table
export const resumeFiles = pgTable("resume_files", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: text("mime_type").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  parsedData: text("parsed_data"), // JSON string of parsed resume data
  parsingAccuracy: integer("parsing_accuracy"), // Percentage
});

// Insert schemas
export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEducationSchema = createInsertSchema(education).omit({
  id: true,
});

export const insertSkillSchema = createInsertSchema(skills).omit({
  id: true,
});

export const insertExperienceSchema = createInsertSchema(experience).omit({
  id: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
});

export const insertCertificationSchema = createInsertSchema(certifications).omit({
  id: true,
});

export const insertExternalLinkSchema = createInsertSchema(externalLinks).omit({
  id: true,
});

export const insertResumeFileSchema = createInsertSchema(resumeFiles).omit({
  id: true,
  uploadedAt: true,
});

// Types
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;

export type Education = typeof education.$inferSelect;
export type InsertEducation = z.infer<typeof insertEducationSchema>;

export type Skill = typeof skills.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;

export type Experience = typeof experience.$inferSelect;
export type InsertExperience = z.infer<typeof insertExperienceSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Certification = typeof certifications.$inferSelect;
export type InsertCertification = z.infer<typeof insertCertificationSchema>;

export type ExternalLink = typeof externalLinks.$inferSelect;
export type InsertExternalLink = z.infer<typeof insertExternalLinkSchema>;

export type ResumeFile = typeof resumeFiles.$inferSelect;
export type InsertResumeFile = z.infer<typeof insertResumeFileSchema>;

// Complete profile type for API responses
export type CompleteProfile = {
  profile: Profile;
  education: Education[];
  skills: Skill[];
  experience: Experience[];
  projects: Project[];
  certifications: Certification[];
  externalLinks: ExternalLink[];
  resumeFiles: ResumeFile[];
};
