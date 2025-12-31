/**
 * Insight Generation Service
 * Generates natural language insights from task patterns
 *
 * Purpose:
 * - Avoid cognitive load
 * - Preserve long-term pattern tracking
 * - Make reflection feel like realization, not analysis
 */

import { supabase, getCurrentUser } from './supabase'
import { getTasksByDateRange } from './tasks'
import type {
  Insight,
  InsightInsert,
  PatternAnalysis,
  TaskWithTags,
  AutoTag,
} from '../types'

/**
 * Analyze task patterns over a time period
 * This is internal analysis - user never sees the raw data
 */
export async function analyzePatterns(
  startDate: Date,
  endDate: Date
): Promise<PatternAnalysis> {
  const tasks = await getTasksByDateRange(startDate, endDate, true)

  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.completed).length

  // Count distributions
  const actionDomainCounts: Record<string, number> = {}
  const energyTypeCounts: Record<string, number> = {}
  const timeWeightCounts: Record<string, number> = {}

  tasks.forEach(task => {
    if (task.auto_tags) {
      const tag = task.auto_tags
      if (tag.action_domain) {
        actionDomainCounts[tag.action_domain] =
          (actionDomainCounts[tag.action_domain] || 0) + 1
      }
      if (tag.energy_type) {
        energyTypeCounts[tag.energy_type] =
          (energyTypeCounts[tag.energy_type] || 0) + 1
      }
      if (tag.time_weight) {
        timeWeightCounts[tag.time_weight] =
          (timeWeightCounts[tag.time_weight] || 0) + 1
      }
    }
  })

  // Find dominant categories
  const getDominant = (counts: Record<string, number>) => {
    const entries = Object.entries(counts)
    if (entries.length === 0) return undefined
    return entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0]
  }

  // Analyze time patterns
  const tasksByHour: Record<number, number> = {}
  tasks.forEach(task => {
    const hour = new Date(task.created_at).getHours()
    tasksByHour[hour] = (tasksByHour[hour] || 0) + 1
  })

  const mostProductiveHours = Object.entries(tasksByHour)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([hour]) => parseInt(hour))

  // Calculate averages
  const daysDiff = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  )
  const averageTasksPerDay = totalTasks / Math.max(daysDiff, 1)

  return {
    dominant_action_domain: getDominant(actionDomainCounts),
    dominant_energy_type: getDominant(energyTypeCounts),
    dominant_time_weight: getDominant(timeWeightCounts),
    task_distribution: {
      by_action_domain: actionDomainCounts,
      by_energy_type: energyTypeCounts,
      by_time_weight: timeWeightCounts,
    },
    time_patterns: {
      most_productive_hours: mostProductiveHours,
    },
    completion_rate: totalTasks > 0 ? completedTasks / totalTasks : 0,
    average_tasks_per_day: averageTasksPerDay,
  }
}

/**
 * Generate natural language insights from pattern analysis
 * These are shown to users as gentle observations, not data dumps
 */
export function generateInsightText(analysis: PatternAnalysis): string[] {
  const insights: string[] = []

  // Domain focus insight
  if (analysis.dominant_action_domain) {
    const domain = analysis.dominant_action_domain.replace(/_/g, ' ')
    const percentage = Math.round(
      (analysis.task_distribution.by_action_domain[analysis.dominant_action_domain] /
        Object.values(analysis.task_distribution.by_action_domain).reduce((a, b) => a + b, 0)) * 100
    )
    insights.push(
      `You've been focusing heavily on ${domain}, which makes up about ${percentage}% of your activities.`
    )
  }

  // Energy pattern insight
  if (analysis.dominant_energy_type) {
    const energy = analysis.dominant_energy_type.replace(/_/g, ' ')
    insights.push(
      `Most of your tasks require ${energy}. ${getEnergyAdvice(analysis.dominant_energy_type)}`
    )
  }

  // Time weight insight
  if (analysis.dominant_time_weight) {
    const weight = analysis.dominant_time_weight.replace(/_/g, ' ')
    insights.push(
      `Your tasks tend to be ${weight} activities. ${getTimeWeightAdvice(analysis.dominant_time_weight)}`
    )
  }

  // Productivity time insight
  if (analysis.time_patterns.most_productive_hours &&
      analysis.time_patterns.most_productive_hours.length > 0) {
    const hours = analysis.time_patterns.most_productive_hours
      .map(h => formatHour(h))
      .join(', ')
    insights.push(
      `You're most active around ${hours}. Consider scheduling important tasks during these windows.`
    )
  }

  // Completion rate insight
  if (analysis.completion_rate > 0.8) {
    insights.push(
      `You're completing ${Math.round(analysis.completion_rate * 100)}% of your tasks—that's excellent follow-through.`
    )
  } else if (analysis.completion_rate < 0.5) {
    insights.push(
      `You're completing about ${Math.round(analysis.completion_rate * 100)}% of tasks. Consider breaking larger tasks into smaller, achievable steps.`
    )
  }

  // Task volume insight
  if (analysis.average_tasks_per_day > 10) {
    insights.push(
      `You're averaging ${Math.round(analysis.average_tasks_per_day)} tasks per day. Make sure you're not overwhelming yourself.`
    )
  } else if (analysis.average_tasks_per_day < 3) {
    insights.push(
      `You're keeping things light with around ${Math.round(analysis.average_tasks_per_day)} tasks per day.`
    )
  }

  return insights
}

/**
 * Generate and save insights for a time period
 */
export async function createInsightsForPeriod(
  startDate: Date,
  endDate: Date
): Promise<Insight[]> {
  const user = await getCurrentUser()
  if (!user) throw new Error('User not authenticated')

  const analysis = await analyzePatterns(startDate, endDate)
  const insightTexts = generateInsightText(analysis)

  const insights: Insight[] = []

  for (const text of insightTexts) {
    const insightData: InsightInsert = {
      user_id: user.id,
      period_start: startDate.toISOString(),
      period_end: endDate.toISOString(),
      insight_text: text,
      insight_type: 'observation',
      supporting_data: {
        analysis,
      },
    }

    const { data, error } = await supabase
      .from('insights')
      .insert(insightData)
      .select()
      .single()

    if (error) {
      console.error('Failed to create insight:', error)
      continue
    }

    insights.push(data)
  }

  return insights
}

/**
 * Get unviewed insights for the current user
 */
export async function getUnviewedInsights(): Promise<Insight[]> {
  const user = await getCurrentUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('insights')
    .select()
    .eq('user_id', user.id)
    .eq('viewed', false)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Mark an insight as viewed
 */
export async function markInsightViewed(insightId: string): Promise<void> {
  const { error } = await supabase
    .from('insights')
    .update({
      viewed: true,
      viewed_at: new Date().toISOString(),
    })
    .eq('id', insightId)

  if (error) throw error
}

// Helper functions

function getEnergyAdvice(energyType: string): string {
  const advice: Record<string, string> = {
    deep_focus: "Schedule these during your peak concentration hours.",
    light_activity: "These are great for filling gaps between meetings.",
    social_energy: "Make sure you're balancing this with solo recharge time.",
    creative_flow: "Protect uninterrupted blocks for these activities.",
    routine_execution: "Consider batching these together for efficiency.",
    physical_activity: "You're staying active—keep it up!",
  }
  return advice[energyType] || ""
}

function getTimeWeightAdvice(timeWeight: string): string {
  const advice: Record<string, string> = {
    quick_win: "Good for momentum when you need a boost.",
    moderate_effort: "This is a sustainable pace.",
    deep_work: "Make sure you're protecting focus time.",
    ongoing_commitment: "Track progress in small milestones.",
    waiting_on_others: "Consider what you can do while waiting.",
  }
  return advice[timeWeight] || ""
}

function formatHour(hour: number): string {
  if (hour === 0) return "midnight"
  if (hour === 12) return "noon"
  if (hour < 12) return `${hour}am`
  return `${hour - 12}pm`
}
