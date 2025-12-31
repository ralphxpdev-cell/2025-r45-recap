/**
 * Database Type Definitions
 * Auto-generated types matching the Supabase schema
 *
 * Data Strategy:
 * - User never selects categories
 * - Every task text is automatically analyzed
 * - System assigns hidden tags: Action Domain, Energy Type, Time Weight
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          completed: boolean
          created_at: string
          updated_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          completed?: boolean
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          completed?: boolean
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
      }
      auto_tags: {
        Row: {
          id: string
          task_id: string
          action_domain: string | null
          energy_type: string | null
          time_weight: string | null
          confidence_score: number
          analysis_data: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          task_id: string
          action_domain?: string | null
          energy_type?: string | null
          time_weight?: string | null
          confidence_score?: number
          analysis_data?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          action_domain?: string | null
          energy_type?: string | null
          time_weight?: string | null
          confidence_score?: number
          analysis_data?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      insights: {
        Row: {
          id: string
          user_id: string
          period_start: string
          period_end: string
          insight_text: string
          insight_type: string | null
          supporting_data: Json | null
          viewed: boolean
          viewed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          period_start: string
          period_end: string
          insight_text: string
          insight_type?: string | null
          supporting_data?: Json | null
          viewed?: boolean
          viewed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          period_start?: string
          period_end?: string
          insight_text?: string
          insight_type?: string | null
          supporting_data?: Json | null
          viewed?: boolean
          viewed_at?: string | null
          created_at?: string
        }
      }
    }
  }
}

/**
 * Action Domain Categories
 * What area of life/work this task belongs to
 */
export type ActionDomain =
  | 'work_project'
  | 'personal_admin'
  | 'health_wellness'
  | 'learning_growth'
  | 'social_connection'
  | 'creative_expression'
  | 'home_maintenance'
  | 'financial_planning'

/**
 * Energy Type Categories
 * What kind of energy this task requires
 */
export type EnergyType =
  | 'deep_focus'        // requires sustained concentration
  | 'light_activity'    // low cognitive load
  | 'social_energy'     // interaction with others
  | 'creative_flow'     // generative thinking
  | 'routine_execution' // familiar patterns
  | 'physical_activity' // body movement

/**
 * Time Weight Categories
 * How significant this task is in terms of time/effort
 */
export type TimeWeight =
  | 'quick_win'            // < 15 minutes
  | 'moderate_effort'      // 15-60 minutes
  | 'deep_work'            // 1-3 hours
  | 'ongoing_commitment'   // multi-day/week
  | 'waiting_on_others'    // blocked time

/**
 * Insight Type Categories (internal use only)
 */
export type InsightType =
  | 'pattern'      // recurring behavior pattern
  | 'reflection'   // retrospective observation
  | 'suggestion'   // actionable recommendation
  | 'observation'  // neutral data point
