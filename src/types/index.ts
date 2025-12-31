/**
 * Application Type Definitions
 * Domain models and business logic types
 */

import type { Database } from './database'

// Convenience type aliases
export type Task = Database['public']['Tables']['tasks']['Row']
export type TaskInsert = Database['public']['Tables']['tasks']['Insert']
export type TaskUpdate = Database['public']['Tables']['tasks']['Update']

export type AutoTag = Database['public']['Tables']['auto_tags']['Row']
export type AutoTagInsert = Database['public']['Tables']['auto_tags']['Insert']
export type AutoTagUpdate = Database['public']['Tables']['auto_tags']['Update']

export type Insight = Database['public']['Tables']['insights']['Row']
export type InsightInsert = Database['public']['Tables']['insights']['Insert']
export type InsightUpdate = Database['public']['Tables']['insights']['Update']

// Re-export enum types
export type { ActionDomain, EnergyType, TimeWeight, InsightType } from './database'

/**
 * Task with Auto Tags (joined query result)
 * This is what we typically work with in the UI
 */
export interface TaskWithTags extends Task {
  auto_tags?: AutoTag | null
}

/**
 * Auto-Tag Analysis Result
 * Output from the AI analysis function
 */
export interface AutoTagAnalysis {
  action_domain: string
  energy_type: string
  time_weight: string
  confidence_score: number
  reasoning: string
  metadata?: Record<string, unknown>
}

/**
 * Insight Generation Request
 * Parameters for generating natural language insights
 */
export interface InsightGenerationRequest {
  user_id: string
  period_start: Date
  period_end: Date
  task_count?: number
  focus_area?: 'patterns' | 'energy' | 'time' | 'balance'
}

/**
 * Insight with Context
 * Enhanced insight with additional context for display
 */
export interface InsightWithContext extends Insight {
  task_examples?: Task[]
  related_tags?: AutoTag[]
}

/**
 * Pattern Analysis Result
 * Aggregated data for pattern detection
 */
export interface PatternAnalysis {
  dominant_action_domain?: string
  dominant_energy_type?: string
  dominant_time_weight?: string
  task_distribution: {
    by_action_domain: Record<string, number>
    by_energy_type: Record<string, number>
    by_time_weight: Record<string, number>
  }
  time_patterns: {
    most_productive_hours?: number[]
    preferred_task_times?: Record<string, number[]>
  }
  completion_rate: number
  average_tasks_per_day: number
}

/**
 * AI Service Config
 * Configuration for the auto-tagging AI service
 */
export interface AIServiceConfig {
  model?: string
  temperature?: number
  max_tokens?: number
  system_prompt?: string
}

export * from './database'
