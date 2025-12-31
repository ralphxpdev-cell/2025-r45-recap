# 2025 R45 Recap - Auto-Tagging Task System

An intelligent task management system with **invisible auto-tagging**. Users never select categories—the system automatically analyzes every task and assigns hidden tags for background pattern analysis.

## 🎯 Design Philosophy

**Data Strategy:**
- User never selects categories
- Every task text is automatically analyzed
- System assigns hidden tags:
  - **Action Domain** - What area of life/work
  - **Energy Type** - What kind of energy required
  - **Time Weight** - Time/effort significance

**Rules:**
- No category UI on the daily screen
- Categories are only used for background analysis
- User sees insights as **natural language summaries**, not charts

**Purpose:**
- Avoid cognitive load
- Preserve long-term pattern tracking
- Make reflection feel like realization, not analysis

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL migration in the Supabase SQL editor:
   - Copy contents from `supabase/migrations/001_init_schema.sql`
   - Execute in your Supabase project

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Development Server

```bash
npm run dev
```

## 📊 SQL Schema Overview

### What to Input in Supabase

Copy the entire contents of `supabase/migrations/001_init_schema.sql` and paste it into your Supabase SQL editor. This will create:

**Tables:**
- `tasks` - User's daily tasks (no manual categorization)
- `auto_tags` - Automatically analyzed hidden tags
- `insights` - Natural language pattern summaries

**Key Features:**
- Row Level Security (RLS) enabled
- Automatic timestamp updates
- Cascade deletes for data consistency
- Indexes for fast queries

The schema is designed to **hide all categorization from the user interface** while preserving rich data for pattern analysis.

## 🏗️ Architecture

### Core Libraries

```typescript
// Auto-Tagging Service
import { analyzeTask } from './lib/autoTagging'

// Task Management (auto-tags invisibly)
import { createTask, getTasks } from './lib/tasks'

// Natural Language Insights
import { createInsightsForPeriod, getUnviewedInsights } from './lib/insights'
```

### How It Works

1. **User creates a task** → System analyzes text
2. **Hidden tags assigned** → Action Domain, Energy Type, Time Weight
3. **Background analysis** → Patterns detected over time
4. **Natural language insights** → "You've been focusing heavily on deep work this week"

### Tag Categories

**Action Domain:**
- `work_project` - Professional work, meetings
- `personal_admin` - Errands, paperwork
- `health_wellness` - Exercise, doctor visits
- `learning_growth` - Study, skill development
- `social_connection` - Friends, family time
- `creative_expression` - Art, writing, hobbies
- `home_maintenance` - Cleaning, repairs
- `financial_planning` - Budget, bills

**Energy Type:**
- `deep_focus` - Sustained concentration
- `light_activity` - Low cognitive load
- `social_energy` - Interaction with others
- `creative_flow` - Generative thinking
- `routine_execution` - Familiar patterns
- `physical_activity` - Body movement

**Time Weight:**
- `quick_win` - < 15 minutes
- `moderate_effort` - 15-60 minutes
- `deep_work` - 1-3 hours
- `ongoing_commitment` - Multi-day/week
- `waiting_on_others` - Blocked time

## 🔧 API Usage Examples

### Create a Task (Auto-Tagged)

```typescript
import { createTask } from './lib/tasks'

// User just enters a task - tagging happens invisibly
const task = await createTask(
  "Finish quarterly report",
  "Need to compile data and write executive summary"
)

// Behind the scenes:
// - Action Domain: work_project
// - Energy Type: deep_focus
// - Time Weight: deep_work
```

### Get Insights

```typescript
import { createInsightsForPeriod } from './lib/insights'

const startDate = new Date('2025-01-01')
const endDate = new Date('2025-01-07')

const insights = await createInsightsForPeriod(startDate, endDate)

// Returns natural language like:
// "You've been focusing heavily on work projects, which makes up about 65% of your activities."
// "Most of your tasks require deep focus. Schedule these during your peak concentration hours."
```

### Analyze Patterns (Internal Only)

```typescript
import { analyzePatterns } from './lib/insights'

const analysis = await analyzePatterns(startDate, endDate)

// Returns structured data (not shown to user):
// {
//   dominant_action_domain: 'work_project',
//   dominant_energy_type: 'deep_focus',
//   completion_rate: 0.82,
//   average_tasks_per_day: 5.3
// }
```

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Auto-tags managed by service role
- Environment variables for sensitive credentials

## 🚧 Upgrading to AI-Powered Analysis

The current implementation uses keyword-based heuristics. To upgrade to AI:

1. Uncomment `analyzeTaskWithAI()` in `src/lib/autoTagging.ts`
2. Add your OpenAI/Anthropic API key to `.env`
3. Configure the AI model and prompts

```typescript
// In autoTagging.ts
export const analyzeTask = analyzeTaskWithAI // Switch to AI
```

## 📝 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Database:** Supabase (PostgreSQL)
- **UI Components:** Radix UI + Tailwind CSS
- **Auto-Tagging:** Keyword heuristics (upgradeable to AI)

## 📖 Original Project

This project is based on the [Survey Page Design](https://www.figma.com/design/we151RcC2Um88I33j6eA2v/Survey-Page-Design) Figma template, enhanced with intelligent auto-tagging capabilities.

## 🤝 Contributing

This is an experimental project exploring invisible categorization and natural language insights. Contributions welcome!

## 📄 License

MIT
