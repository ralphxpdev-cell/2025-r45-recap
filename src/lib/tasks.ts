/**
 * Task Management Functions
 * Handles all task-related database operations with auto-tagging
 */

import { supabase, getCurrentUser } from './supabase'
import { analyzeTask } from './autoTagging'
import type {
  Task,
  TaskInsert,
  TaskUpdate,
  TaskWithTags,
  AutoTagInsert,
} from '../types'

/**
 * Create a new task with automatic tag analysis
 * This is the primary way users create tasks - tags are assigned invisibly
 *
 * @param title - Task title
 * @param description - Optional task description
 * @returns The created task with auto-generated tags
 */
export async function createTask(
  title: string,
  description?: string
): Promise<TaskWithTags> {
  const user = await getCurrentUser()
  if (!user) throw new Error('User not authenticated')

  // Step 1: Create the task
  const taskData: TaskInsert = {
    user_id: user.id,
    title,
    description: description || null,
  }

  const { data: task, error: taskError } = await supabase
    .from('tasks')
    .insert(taskData)
    .select()
    .single()

  if (taskError) throw taskError

  // Step 2: Analyze the task and create auto-tags (background process)
  // This happens automatically - user never sees this
  try {
    const analysis = await analyzeTask(title, description)

    const autoTagData: AutoTagInsert = {
      task_id: task.id,
      action_domain: analysis.action_domain,
      energy_type: analysis.energy_type,
      time_weight: analysis.time_weight,
      confidence_score: analysis.confidence_score,
      analysis_data: {
        reasoning: analysis.reasoning,
        metadata: analysis.metadata,
      },
    }

    const { data: autoTag, error: tagError } = await supabase
      .from('auto_tags')
      .insert(autoTagData)
      .select()
      .single()

    if (tagError) {
      console.error('Failed to create auto-tags:', tagError)
      // Don't fail the task creation, just log the error
    }

    return {
      ...task,
      auto_tags: autoTag || null,
    }
  } catch (error) {
    console.error('Auto-tagging analysis failed:', error)
    // Return task without tags if analysis fails
    return {
      ...task,
      auto_tags: null,
    }
  }
}

/**
 * Get all tasks for the current user
 * Optionally include auto-tags (for internal analysis, not UI display)
 *
 * @param includeTags - Whether to include auto-tags in the result
 * @returns Array of tasks
 */
export async function getTasks(
  includeTags: boolean = false
): Promise<TaskWithTags[]> {
  const user = await getCurrentUser()
  if (!user) throw new Error('User not authenticated')

  let query = supabase
    .from('tasks')
    .select(includeTags ? '*, auto_tags(*)' : '*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { data, error } = await query

  if (error) throw error

  if (includeTags) {
    return data.map((task: any) => ({
      ...task,
      auto_tags: task.auto_tags?.[0] || null,
    }))
  }

  return data
}

/**
 * Get tasks for a specific date range
 * Useful for generating insights
 */
export async function getTasksByDateRange(
  startDate: Date,
  endDate: Date,
  includeTags: boolean = true
): Promise<TaskWithTags[]> {
  const user = await getCurrentUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('tasks')
    .select(includeTags ? '*, auto_tags(*)' : '*')
    .eq('user_id', user.id)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .order('created_at', { ascending: false })

  if (error) throw error

  if (includeTags && data) {
    return data.map((task: any) => ({
      ...task,
      auto_tags: task.auto_tags?.[0] || null,
    }))
  }

  return data || []
}

/**
 * Update a task
 * If title or description changes, re-analyze and update tags
 */
export async function updateTask(
  taskId: string,
  updates: TaskUpdate
): Promise<TaskWithTags> {
  const user = await getCurrentUser()
  if (!user) throw new Error('User not authenticated')

  // Update the task
  const { data: task, error: taskError } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .eq('user_id', user.id)
    .select()
    .single()

  if (taskError) throw taskError

  // If title or description changed, re-analyze tags
  if (updates.title || updates.description !== undefined) {
    try {
      const analysis = await analyzeTask(
        updates.title || task.title,
        updates.description !== undefined ? updates.description : task.description
      )

      // Update or create auto-tags
      const { data: existingTag } = await supabase
        .from('auto_tags')
        .select()
        .eq('task_id', taskId)
        .single()

      if (existingTag) {
        const { data: autoTag } = await supabase
          .from('auto_tags')
          .update({
            action_domain: analysis.action_domain,
            energy_type: analysis.energy_type,
            time_weight: analysis.time_weight,
            confidence_score: analysis.confidence_score,
            analysis_data: {
              reasoning: analysis.reasoning,
              metadata: analysis.metadata,
            },
          })
          .eq('task_id', taskId)
          .select()
          .single()

        return {
          ...task,
          auto_tags: autoTag || null,
        }
      }
    } catch (error) {
      console.error('Failed to update auto-tags:', error)
    }
  }

  return task
}

/**
 * Delete a task
 * Auto-tags will be automatically deleted via CASCADE
 */
export async function deleteTask(taskId: string): Promise<void> {
  const user = await getCurrentUser()
  if (!user) throw new Error('User not authenticated')

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)
    .eq('user_id', user.id)

  if (error) throw error
}

/**
 * Mark a task as completed
 */
export async function completeTask(taskId: string): Promise<Task> {
  const user = await getCurrentUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('tasks')
    .update({
      completed: true,
      completed_at: new Date().toISOString(),
    })
    .eq('id', taskId)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Mark a task as incomplete
 */
export async function uncompleteTask(taskId: string): Promise<Task> {
  const user = await getCurrentUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('tasks')
    .update({
      completed: false,
      completed_at: null,
    })
    .eq('id', taskId)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) throw error
  return data
}
