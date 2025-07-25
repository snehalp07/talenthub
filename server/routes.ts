import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertProfileSchema,
  insertEducationSchema,
  insertSkillSchema,
  insertExperienceSchema,
  insertProjectSchema,
  insertCertificationSchema,
  insertExternalLinkSchema,
  insertResumeFileSchema,
} from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Profile routes
  app.get("/api/profile/:id", async (req, res) => {
    try {
      const profileId = parseInt(req.params.id);
      const profile = await storage.getProfile(profileId);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.get("/api/profile/:id/complete", async (req, res) => {
    try {
      const profileId = parseInt(req.params.id);
      const completeProfile = await storage.getCompleteProfile(profileId);
      
      if (!completeProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(completeProfile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch complete profile" });
    }
  });

  app.post("/api/profile", async (req, res) => {
    try {
      const validatedData = insertProfileSchema.parse(req.body);
      const profile = await storage.createProfile(validatedData);
      res.status(201).json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create profile" });
    }
  });

  app.put("/api/profile/:id", async (req, res) => {
    try {
      const profileId = parseInt(req.params.id);
      const validatedData = insertProfileSchema.partial().parse(req.body);
      const profile = await storage.updateProfile(profileId, validatedData);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Education routes
  app.get("/api/profile/:id/education", async (req, res) => {
    try {
      const profileId = parseInt(req.params.id);
      const education = await storage.getEducationByProfileId(profileId);
      res.json(education);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch education" });
    }
  });

  app.post("/api/education", async (req, res) => {
    try {
      const validatedData = insertEducationSchema.parse(req.body);
      const education = await storage.createEducation(validatedData);
      res.status(201).json(education);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create education" });
    }
  });

  app.put("/api/education/:id", async (req, res) => {
    try {
      const educationId = parseInt(req.params.id);
      const validatedData = insertEducationSchema.partial().parse(req.body);
      const education = await storage.updateEducation(educationId, validatedData);
      
      if (!education) {
        return res.status(404).json({ message: "Education not found" });
      }
      
      res.json(education);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update education" });
    }
  });

  app.delete("/api/education/:id", async (req, res) => {
    try {
      const educationId = parseInt(req.params.id);
      const deleted = await storage.deleteEducation(educationId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Education not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete education" });
    }
  });

  // Skills routes
  app.get("/api/profile/:id/skills", async (req, res) => {
    try {
      const profileId = parseInt(req.params.id);
      const skills = await storage.getSkillsByProfileId(profileId);
      res.json(skills);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch skills" });
    }
  });

  app.post("/api/skills", async (req, res) => {
    try {
      const validatedData = insertSkillSchema.parse(req.body);
      const skill = await storage.createSkill(validatedData);
      res.status(201).json(skill);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create skill" });
    }
  });

  app.put("/api/skills/:id", async (req, res) => {
    try {
      const skillId = parseInt(req.params.id);
      const validatedData = insertSkillSchema.partial().parse(req.body);
      const skill = await storage.updateSkill(skillId, validatedData);
      
      if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
      }
      
      res.json(skill);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update skill" });
    }
  });

  app.delete("/api/skills/:id", async (req, res) => {
    try {
      const skillId = parseInt(req.params.id);
      const deleted = await storage.deleteSkill(skillId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Skill not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete skill" });
    }
  });

  // Experience routes
  app.get("/api/profile/:id/experience", async (req, res) => {
    try {
      const profileId = parseInt(req.params.id);
      const experience = await storage.getExperienceByProfileId(profileId);
      res.json(experience);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch experience" });
    }
  });

  app.post("/api/experience", async (req, res) => {
    try {
      const validatedData = insertExperienceSchema.parse(req.body);
      const experience = await storage.createExperience(validatedData);
      res.status(201).json(experience);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create experience" });
    }
  });

  app.put("/api/experience/:id", async (req, res) => {
    try {
      const experienceId = parseInt(req.params.id);
      const validatedData = insertExperienceSchema.partial().parse(req.body);
      const experience = await storage.updateExperience(experienceId, validatedData);
      
      if (!experience) {
        return res.status(404).json({ message: "Experience not found" });
      }
      
      res.json(experience);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update experience" });
    }
  });

  app.delete("/api/experience/:id", async (req, res) => {
    try {
      const experienceId = parseInt(req.params.id);
      const deleted = await storage.deleteExperience(experienceId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Experience not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete experience" });
    }
  });

  // Projects routes
  app.get("/api/profile/:id/projects", async (req, res) => {
    try {
      const profileId = parseInt(req.params.id);
      const projects = await storage.getProjectsByProfileId(profileId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(projectId, validatedData);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const deleted = await storage.deleteProject(projectId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Certifications routes
  app.get("/api/profile/:id/certifications", async (req, res) => {
    try {
      const profileId = parseInt(req.params.id);
      const certifications = await storage.getCertificationsByProfileId(profileId);
      res.json(certifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch certifications" });
    }
  });

  app.post("/api/certifications", async (req, res) => {
    try {
      const validatedData = insertCertificationSchema.parse(req.body);
      const certification = await storage.createCertification(validatedData);
      res.status(201).json(certification);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create certification" });
    }
  });

  app.put("/api/certifications/:id", async (req, res) => {
    try {
      const certificationId = parseInt(req.params.id);
      const validatedData = insertCertificationSchema.partial().parse(req.body);
      const certification = await storage.updateCertification(certificationId, validatedData);
      
      if (!certification) {
        return res.status(404).json({ message: "Certification not found" });
      }
      
      res.json(certification);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update certification" });
    }
  });

  app.delete("/api/certifications/:id", async (req, res) => {
    try {
      const certificationId = parseInt(req.params.id);
      const deleted = await storage.deleteCertification(certificationId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Certification not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete certification" });
    }
  });

  // External Links routes
  app.get("/api/profile/:id/external-links", async (req, res) => {
    try {
      const profileId = parseInt(req.params.id);
      const externalLinks = await storage.getExternalLinksByProfileId(profileId);
      res.json(externalLinks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch external links" });
    }
  });

  app.post("/api/external-links", async (req, res) => {
    try {
      const validatedData = insertExternalLinkSchema.parse(req.body);
      const externalLink = await storage.createExternalLink(validatedData);
      res.status(201).json(externalLink);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create external link" });
    }
  });

  app.put("/api/external-links/:id", async (req, res) => {
    try {
      const linkId = parseInt(req.params.id);
      const validatedData = insertExternalLinkSchema.partial().parse(req.body);
      const externalLink = await storage.updateExternalLink(linkId, validatedData);
      
      if (!externalLink) {
        return res.status(404).json({ message: "External link not found" });
      }
      
      res.json(externalLink);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update external link" });
    }
  });

  app.delete("/api/external-links/:id", async (req, res) => {
    try {
      const linkId = parseInt(req.params.id);
      const deleted = await storage.deleteExternalLink(linkId);
      
      if (!deleted) {
        return res.status(404).json({ message: "External link not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete external link" });
    }
  });

  // Resume file upload route
  app.post("/api/profile/:id/resume", upload.single('resume'), async (req, res) => {
    try {
      const profileId = parseInt(req.params.id);
      
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const resumeFileData = {
        profileId,
        filename: req.file.filename,
        originalName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        parsedData: null,
        parsingAccuracy: null,
      };

      const resumeFile = await storage.createResumeFile(resumeFileData);
      
      // TODO: Implement actual resume parsing logic here
      // For now, we'll simulate parsing with mock data
      
      res.status(201).json(resumeFile);
    } catch (error) {
      res.status(500).json({ message: "Failed to upload resume" });
    }
  });

  app.get("/api/profile/:id/resume", async (req, res) => {
    try {
      const profileId = parseInt(req.params.id);
      const resumeFiles = await storage.getResumeFilesByProfileId(profileId);
      res.json(resumeFiles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resume files" });
    }
  });

  app.delete("/api/resume/:id", async (req, res) => {
    try {
      const resumeId = parseInt(req.params.id);
      const deleted = await storage.deleteResumeFile(resumeId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Resume file not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete resume file" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
