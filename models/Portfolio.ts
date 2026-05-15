import mongoose, { Schema, Document, Model } from 'mongoose'

/**
 * WHY TypeScript interfaces for each section:
 * These give us autocomplete and type safety everywhere
 * we use portfolio data — in API routes, in components,
 * in the admin panel. If we rename a field here TypeScript
 * immediately shows every place that needs updating.
 */

export interface ISkillCategory {
  icon:   string
  title:  string
  skills: string[]
  order:  number
}

export interface IExperience {
  company:  string
  role:     string
  type:     string
  period:   string
  location: string
  current:  boolean
  tech:     string[]
  bullets:  string[]
  order:    number
}

export interface IProject {
  title:       string
  emoji:       string
  description: string
  tech:        string[]
  features:    string[]
  liveUrl:     string
  githubUrl:   string
  featured:    boolean
  order:       number
}

export interface IEducation {
  degree:     string
  school:     string
  period:     string
  location:   string
  highlights: string[]
}

export interface IAchievement {
  icon: string
  text: string
}

export interface IHero {
  name:        string
  title:       string
  location:    string
  description: string
  available:   boolean
  stats: {
    number: string
    label:  string
  }[]
}

export interface IPortfolio extends Document {
  hero:         IHero
  skills:       ISkillCategory[]
  experience:   IExperience[]
  projects:     IProject[]
  education:    IEducation[]
  achievements: IAchievement[]
  updatedAt:    Date
}

/**
 * WHY nested schemas:
 * Mongoose validates nested objects too, not just top-level
 * fields. Defining sub-schemas means every nested field
 * gets validated before saving to the database.
 */

const HeroSchema = new Schema<IHero>({
  name:        { type: String, required: true },
  title:       { type: String, required: true },
  location:    { type: String, required: true },
  description: { type: String, required: true },
  available:   { type: Boolean, default: true  },
  stats: [{
    number: { type: String, required: true },
    label:  { type: String, required: true },
  }],
})

const SkillCategorySchema = new Schema<ISkillCategory>({
  icon:   { type: String, required: true },
  title:  { type: String, required: true },
  skills: [{ type: String }],
  order:  { type: Number, default: 0 },
})

const ExperienceSchema = new Schema<IExperience>({
  company:  { type: String, required: true },
  role:     { type: String, required: true },
  type:     { type: String, required: true },
  period:   { type: String, required: true },
  location: { type: String, required: true },
  current:  { type: Boolean, default: false },
  tech:     [{ type: String }],
  bullets:  [{ type: String }],
  order:    { type: Number, default: 0 },
})

const ProjectSchema = new Schema<IProject>({
  title:       { type: String, required: true },
  emoji:       { type: String, required: true },
  description: { type: String, required: true },
  tech:        [{ type: String }],
  features:    [{ type: String }],
  liveUrl:     { type: String, default: '#'   },
  githubUrl:   { type: String, default: '#'   },
  featured:    { type: Boolean, default: false },
  order:       { type: Number, default: 0 },
})

const EducationSchema = new Schema<IEducation>({
  degree:     { type: String, required: true },
  school:     { type: String, required: true },
  period:     { type: String, required: true },
  location:   { type: String, required: true },
  highlights: [{ type: String }],
})

const AchievementSchema = new Schema<IAchievement>({
  icon: { type: String, required: true },
  text: { type: String, required: true },
})

const PortfolioSchema = new Schema<IPortfolio>(
  {
    hero:         { type: HeroSchema,                  required: true },
    skills:       { type: [SkillCategorySchema],       default: []    },
    experience:   { type: [ExperienceSchema],          default: []    },
    projects:     { type: [ProjectSchema],             default: []    },
    education:    { type: [EducationSchema],           default: []    },
    achievements: { type: [AchievementSchema],         default: []    },
  },
  {
    /**
     * WHY timestamps: true:
     * Automatically adds createdAt and updatedAt fields.
     * updatedAt tells you when the portfolio was last edited
     * which is useful for cache invalidation later.
     */
    timestamps: true,
  }
)

/**
 * WHY this pattern for model creation:
 * In Next.js development, hot reload re-runs this file
 * multiple times. mongoose.models.Portfolio checks if the
 * model already exists before creating a new one.
 * Without this check you'd get a
 * "Cannot overwrite model once compiled" error on hot reload.
 */
const Portfolio: Model<IPortfolio> =
  mongoose.models.Portfolio ||
  mongoose.model<IPortfolio>('Portfolio', PortfolioSchema)

export default Portfolio