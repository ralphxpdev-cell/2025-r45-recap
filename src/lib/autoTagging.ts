/**
 * Auto-Tagging Service
 * Analyzes task text and assigns hidden tags automatically
 *
 * Strategy:
 * - User never selects categories
 * - Every task text is automatically analyzed
 * - System assigns hidden tags: Action Domain, Energy Type, Time Weight
 */

import type {
  AutoTagAnalysis,
  ActionDomain,
  EnergyType,
  TimeWeight,
} from '../types'

/**
 * System prompt for the AI analysis
 * Defines the rules and categories for auto-tagging
 */
const SYSTEM_PROMPT = `You are an intelligent task analyzer. Analyze the given task and assign three hidden tags:

1. Action Domain (what area of life/work):
   - work_project: Professional work, projects, meetings
   - personal_admin: Errands, paperwork, scheduling
   - health_wellness: Exercise, doctor visits, mental health
   - learning_growth: Study, courses, skill development
   - social_connection: Time with friends, family, community
   - creative_expression: Art, writing, music, hobbies
   - home_maintenance: Cleaning, repairs, organization
   - financial_planning: Budget, investments, bills

2. Energy Type (what kind of energy required):
   - deep_focus: Requires sustained concentration, complex thinking
   - light_activity: Low cognitive load, routine tasks
   - social_energy: Interaction with others, communication
   - creative_flow: Generative thinking, ideation, creation
   - routine_execution: Familiar patterns, habits
   - physical_activity: Body movement, exercise

3. Time Weight (time/effort significance):
   - quick_win: < 15 minutes, easy completion
   - moderate_effort: 15-60 minutes, medium complexity
   - deep_work: 1-3 hours, requires focus blocks
   - ongoing_commitment: Multi-day/week project
   - waiting_on_others: Blocked, depends on others

Respond ONLY with valid JSON in this exact format:
{
  "action_domain": "category",
  "energy_type": "category",
  "time_weight": "category",
  "confidence_score": 0.85,
  "reasoning": "Brief explanation of why these tags were chosen"
}

Be thoughtful and nuanced. Consider context clues in the task text.`

/**
 * Analyzes a task using a simple keyword-based heuristic approach
 * In production, you would replace this with an actual AI API call (OpenAI, Anthropic, etc.)
 *
 * @param taskTitle - The task title to analyze
 * @param taskDescription - Optional task description
 * @returns AutoTagAnalysis result
 */
export async function analyzeTask(
  taskTitle: string,
  taskDescription?: string | null
): Promise<AutoTagAnalysis> {
  const text = `${taskTitle} ${taskDescription || ''}`.toLowerCase()

  // Simple keyword-based analysis (replace with actual AI in production)
  const analysis = performKeywordAnalysis(text)

  return analysis
}

/**
 * Keyword-based heuristic analysis
 * This is a fallback/demo implementation
 * Replace with actual AI API call for production
 */
function performKeywordAnalysis(text: string): AutoTagAnalysis {
  // Action Domain detection
  let action_domain: ActionDomain = 'personal_admin'
  let confidence = 0.6

  if (
    /work|meeting|project|deadline|client|business|office/.test(text)
  ) {
    action_domain = 'work_project'
    confidence = 0.8
  } else if (
    /exercise|workout|gym|run|yoga|health|doctor|therapy/.test(text)
  ) {
    action_domain = 'health_wellness'
    confidence = 0.85
  } else if (
    /learn|study|course|read|practice|skill|tutorial/.test(text)
  ) {
    action_domain = 'learning_growth'
    confidence = 0.8
  } else if (
    /friend|family|call|meet|hangout|dinner|social/.test(text)
  ) {
    action_domain = 'social_connection'
    confidence = 0.75
  } else if (
    /write|create|design|draw|music|art|creative|hobby/.test(text)
  ) {
    action_domain = 'creative_expression'
    confidence = 0.8
  } else if (
    /clean|organize|repair|fix|home|house|maintenance/.test(text)
  ) {
    action_domain = 'home_maintenance'
    confidence = 0.75
  } else if (
    /budget|money|invest|bill|pay|financial|bank/.test(text)
  ) {
    action_domain = 'financial_planning'
    confidence = 0.8
  }

  // Energy Type detection
  let energy_type: EnergyType = 'light_activity'

  if (
    /focus|think|analyze|plan|design|code|write|deep/.test(text)
  ) {
    energy_type = 'deep_focus'
  } else if (
    /call|meeting|discuss|collaborate|team|talk/.test(text)
  ) {
    energy_type = 'social_energy'
  } else if (
    /create|brainstorm|ideate|design|invent|imagine/.test(text)
  ) {
    energy_type = 'creative_flow'
  } else if (
    /routine|habit|daily|regular|usual|normal/.test(text)
  ) {
    energy_type = 'routine_execution'
  } else if (
    /exercise|workout|run|walk|gym|move|physical/.test(text)
  ) {
    energy_type = 'physical_activity'
  }

  // Time Weight detection
  let time_weight: TimeWeight = 'moderate_effort'

  if (
    /quick|fast|brief|short|5 min|10 min|few min|check/.test(text)
  ) {
    time_weight = 'quick_win'
  } else if (
    /deep work|focus|3 hour|2 hour|block|intensive/.test(text)
  ) {
    time_weight = 'deep_work'
  } else if (
    /project|long-term|ongoing|continue|multi-day|week/.test(text)
  ) {
    time_weight = 'ongoing_commitment'
  } else if (
    /wait|pending|blocked|depends on|need|waiting/.test(text)
  ) {
    time_weight = 'waiting_on_others'
  }

  return {
    action_domain,
    energy_type,
    time_weight,
    confidence_score: confidence,
    reasoning: `Keyword-based analysis detected: ${action_domain} domain, ${energy_type} energy, ${time_weight} time commitment`,
    metadata: {
      method: 'keyword_heuristic',
      text_length: text.length,
    },
  }
}

/**
 * AI-powered analysis using external API (OpenAI, Anthropic, etc.)
 * Uncomment and configure when ready to use
 */
/*
export async function analyzeTaskWithAI(
  taskTitle: string,
  taskDescription?: string | null
): Promise<AutoTagAnalysis> {
  const text = `Title: ${taskTitle}\nDescription: ${taskDescription || 'None'}`

  try {
    // Example with OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: text },
        ],
        temperature: 0.3,
        max_tokens: 200,
      }),
    })

    const data = await response.json()
    const result = JSON.parse(data.choices[0].message.content)

    return {
      action_domain: result.action_domain,
      energy_type: result.energy_type,
      time_weight: result.time_weight,
      confidence_score: result.confidence_score,
      reasoning: result.reasoning,
      metadata: {
        method: 'ai_powered',
        model: 'gpt-4',
      },
    }
  } catch (error) {
    console.error('AI analysis failed, falling back to keyword analysis:', error)
    return performKeywordAnalysis(text.toLowerCase())
  }
}
*/

/**
 * Batch analyze multiple tasks
 * Useful for analyzing historical tasks or bulk operations
 */
export async function analyzeTasksBatch(
  tasks: Array<{ title: string; description?: string | null }>
): Promise<AutoTagAnalysis[]> {
  return Promise.all(
    tasks.map(task => analyzeTask(task.title, task.description))
  )
}
