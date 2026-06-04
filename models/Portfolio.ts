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

/**
 * WHY type field with enum:
 * Achievements and certifications render differently —
 * certifications show a Verify link when a URL is present.
 * The type field drives this distinction without needing
 * two separate schemas or sections.
 */
export interface IAchievement {
  icon:        string
  title:       string
  description: string
  issuer:      string
  date:        string
  order:       number
}

export interface ICertification {
  icon:   string
  title:  string
  issuer: string
  date:   string
  url:    string
  order:  number
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

/**
 * WHY IContact as a top-level schema:
 * Contact details appear in multiple places — Contact section,
 * footer, Projects GitHub button, meta tags. Storing them once
 * in the DB and reading them everywhere means you update your
 * email in one place and it propagates across the entire site.
 *
 * WHY website is optional:
 * Not everyone has a personal website. Making it optional
 * means the schema doesn't enforce a field that might be
 * empty for a long time. The UI simply hides it when empty.
 */
export interface IContact {
  email:    string
  phone:    string
  linkedin: string
  github:   string
  website?: string
  location: string
}

export interface IPortfolio extends Document {
  hero:             IHero
  skills:           ISkillCategory[]
  experience:       IExperience[]
  projects:         IProject[]
  achievements:     IAchievement[]
  certifications:   ICertification[]
  contact:          IContact
  updatedAt:        Date
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
  location: { type: String, default: ''    },
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

const AchievementSchema = new Schema<IAchievement>({
  icon:        { type: String, required: true },
  title:       { type: String, required: true },
  description: { type: String, default: ''    },
  issuer:      { type: String, default: ''    },
  date:        { type: String, default: ''    },
  order:       { type: Number, default: 0     },
})

const CertificationSchema = new Schema<ICertification>({
  icon:   { type: String, required: true },
  title:  { type: String, required: true },
  issuer: { type: String, default: ''    },
  date:   { type: String, default: ''    },
  url:    { type: String, default: ''    },
  order:  { type: Number, default: 0     },
})

const ContactSchema = new Schema<IContact>({
  email:    { type: String, required: true },
  phone:    { type: String, required: true },
  linkedin: { type: String, required: true },
  github:   { type: String, required: true },
  website:  { type: String, default: ''    },
  location: { type: String, required: true },
})

const PortfolioSchema = new Schema<IPortfolio>(
  {
    hero:           { type: HeroSchema,              required: true },
    skills:         { type: [SkillCategorySchema],   default: []    },
    experience:     { type: [ExperienceSchema],       default: []    },
    projects:       { type: [ProjectSchema],          default: []    },
    achievements:   { type: [AchievementSchema],      default: []    },
    certifications: { type: [CertificationSchema],    default: []    },
    contact:        { type: ContactSchema,            required: true },
  },
  { timestamps: true }
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