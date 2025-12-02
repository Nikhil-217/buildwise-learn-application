import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { ProjectData } from '@/types'

export const useSupabaseProjects = (userId?: string) => {
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = async () => {
    if (!userId) {
      setProjects([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      if (error) throw error

      setProjects(data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }

  const saveProject = async (projectData: Omit<ProjectData, 'id'>) => {
    if (!userId) return { error: 'User not authenticated' }

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: userId,
          name: projectData.name || `${projectData.location} Project`,
          location: projectData.location,
          area: projectData.area,
          floors: projectData.floors,
          quality: projectData.quality,
          project_data: projectData,
          materials_total: projectData.materialsTotal || 0,
          labor_total: projectData.laborTotal || 0,
          total_cost: (projectData.materialsTotal || 0) + (projectData.laborTotal || 0),
        })
        .select()
        .single()

      if (error) throw error

      // Refresh projects list
      await fetchProjects()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Failed to save project' }
    }
  }

  const updateProject = async (id: string, updates: Partial<ProjectData>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          project_data: updates,
          materials_total: updates.materialsTotal || 0,
          labor_total: updates.laborTotal || 0,
          total_cost: (updates.materialsTotal || 0) + (updates.laborTotal || 0),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Refresh projects list
      await fetchProjects()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Failed to update project' }
    }
  }

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Refresh projects list
      await fetchProjects()
      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to delete project' }
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [userId])

  return {
    projects,
    loading,
    error,
    fetchProjects,
    saveProject,
    updateProject,
    deleteProject,
  }
}
