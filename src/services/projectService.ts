import { Project } from '../types';
import { projectsData as ANUBAMA_INITIAL_PROJECTS } from '../data/portfolioData';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import { storageService } from './storageService';

const STORAGE_KEY = 'anubama_portfolio_projects_v2';

// Helper to initialize local storage strictly with verified Anubama projects
const getStoredProjects = (): Project[] => {
  try {
    // Purge any legacy key to avoid old data contamination
    localStorage.removeItem('sakura_portfolio_projects');

    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading projects from local storage:', e);
  }
  // Initialize with verified Anubama default projects
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ANUBAMA_INITIAL_PROJECTS));
  return ANUBAMA_INITIAL_PROJECTS;
};

const saveStoredProjects = (projects: Project[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    window.dispatchEvent(new CustomEvent('anubama-projects-changed', { detail: projects }));
  } catch (e) {
    console.error('Error saving projects to local storage:', e);
  }
};

export const projectService = {
  /**
   * Fetch projects following strict fallback logic:
   * 1. If dedicated Anubama Supabase is NOT configured -> load ANUBAMA_INITIAL_PROJECTS
   * 2. If dedicated Anubama Supabase IS configured but returns 0 projects -> load ANUBAMA_INITIAL_PROJECTS
   * 3. If dedicated Anubama Supabase IS configured and contains projects -> load projects from Supabase
   */
  async getProjects(includeAllStatus: boolean = false): Promise<Project[]> {
    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        let query = client.from('projects').select('*').order('created_at', { ascending: false });
        if (!includeAllStatus) {
          query = query.or('status.eq.published,status.is.null');
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((item: any) => ({
            id: item.id || item.slug,
            title: item.title,
            year: item.year || '2026',
            category: item.category || 'Full Stack',
            shortDescription: item.short_description || item.description?.slice(0, 140) || '',
            description: item.description || '',
            keyFeatures: item.key_features || item.features || [],
            technologies: item.technologies || item.tech_stack || [],
            githubUrl: item.github_url,
            liveUrl: item.live_url,
            imageUrl: item.image_url || item.thumbnail_url,
            thumbnailUrl: item.thumbnail_url || item.image_url,
            images: item.images || (item.image_url ? [item.image_url] : []),
            featured: Boolean(item.featured),
            status: item.status || 'published',
            views: item.views || 0,
            badges: item.badges || item.technologies?.slice(0, 3) || []
          }));
        }
      } catch (err) {
        console.warn('Dedicated Anubama Supabase getProjects error, using local fallback:', err);
      }
    }

    // Isolated Local Fallback Dataset
    const local = getStoredProjects();
    if (!includeAllStatus) {
      return local.filter((p) => p.status !== 'archived' && p.status !== 'draft');
    }
    return local;
  },

  /**
   * Get single project by ID
   */
  async getProjectById(id: string): Promise<Project | null> {
    const all = await this.getProjects(true);
    return all.find((p) => p.id === id) || null;
  },

  /**
   * Create a new project
   */
  async createProject(project: Omit<Project, 'id'> & { id?: string }): Promise<Project> {
    const newId = project.id || `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const fullProject: Project = {
      ...project,
      id: newId,
      category: project.category?.trim() || 'Other',
      status: project.status || 'published',
      featured: project.featured ?? false,
      imageUrl: project.imageUrl || project.thumbnailUrl,
      thumbnailUrl: project.thumbnailUrl || project.imageUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        await client.from('projects').insert([{
          id: fullProject.id,
          title: fullProject.title,
          year: fullProject.year,
          category: fullProject.category,
          short_description: fullProject.shortDescription,
          description: fullProject.description,
          key_features: fullProject.keyFeatures,
          technologies: fullProject.technologies,
          github_url: fullProject.githubUrl,
          live_url: fullProject.liveUrl,
          image_url: fullProject.imageUrl,
          thumbnail_url: fullProject.thumbnailUrl,
          images: fullProject.images || (fullProject.imageUrl ? [fullProject.imageUrl] : []),
          featured: fullProject.featured,
          status: fullProject.status
        }]);
      } catch (err) {
        console.warn('Supabase createProject warning:', err);
      }
    }

    const current = getStoredProjects();
    const updated = [fullProject, ...current];
    saveStoredProjects(updated);
    return fullProject;
  },

  /**
   * Update existing project
   */
  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    const current = getStoredProjects();
    const index = current.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const existing = current[index];
    const updatedProject: Project = {
      ...existing,
      ...updates,
      category: updates.category !== undefined ? (updates.category.trim() || 'Other') : existing.category,
      imageUrl: updates.imageUrl !== undefined ? updates.imageUrl : existing.imageUrl,
      thumbnailUrl: updates.thumbnailUrl !== undefined ? updates.thumbnailUrl : (updates.imageUrl || existing.thumbnailUrl),
      updatedAt: new Date().toISOString()
    };

    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        await client.from('projects').update({
          title: updatedProject.title,
          year: updatedProject.year,
          category: updatedProject.category,
          short_description: updatedProject.shortDescription,
          description: updatedProject.description,
          key_features: updatedProject.keyFeatures,
          technologies: updatedProject.technologies,
          github_url: updatedProject.githubUrl,
          live_url: updatedProject.liveUrl,
          image_url: updatedProject.imageUrl,
          thumbnail_url: updatedProject.thumbnailUrl,
          images: updatedProject.images,
          featured: updatedProject.featured,
          status: updatedProject.status
        }).eq('id', id);
      } catch (err) {
        console.warn('Supabase updateProject warning:', err);
      }
    }

    current[index] = updatedProject;
    saveStoredProjects(current);
    return updatedProject;
  },

  /**
   * Delete project
   */
  async deleteProject(id: string): Promise<boolean> {
    const current = getStoredProjects();
    const target = current.find((p) => p.id === id);

    if (target?.imageUrl) {
      try {
        await storageService.deleteProjectImage(target.imageUrl);
      } catch (e) {
        console.warn('Error removing project image during delete:', e);
      }
    }

    const client = getSupabaseClient();
    if (client && isSupabaseConfigured()) {
      try {
        await client.from('projects').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteProject warning:', err);
      }
    }

    const filtered = current.filter((p) => p.id !== id);
    saveStoredProjects(filtered);
    return true;
  },

  /**
   * Reset all projects strictly to Anubama's verified fallback dataset
   */
  resetToDefault(): Project[] {
    saveStoredProjects(ANUBAMA_INITIAL_PROJECTS);
    return ANUBAMA_INITIAL_PROJECTS;
  }
};
