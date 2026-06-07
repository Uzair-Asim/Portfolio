/**
 * WHY a separate seed file:
 * This runs once to populate the database with your initial
 * hardcoded data. After seeding you edit data through the
 * admin panel - never by running this script again unless
 * you want to reset everything.
 *
 * Run with: npx tsx lib/seed.ts
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

import mongoose from 'mongoose'
import Portfolio from '@/models/Portfolio'

const MONGODB_URI = process.env.MONGODB_URI!

const seedData = {
  hero: {
    name:        'Uzair Asim',
    title:       'Full Stack Engineer .NET · Azure · React',
    location:    'Islamabad, Pakistan',
    description: 'I build scalable full-stack applications with .NET and Azure, and craft intuitive user experiences with modern JS frameworks. Currently at XtremeLabs LLC, automating cloud infrastructure and shipping AI-powered tools.',
    available:   true,
    chatEnabled: true,
    stats: [
      { number: '3+',  label: 'Years Exp'   },
      { number: '80%', label: 'Efficiency↑' },
      { number: '40%', label: 'DB Gain'     },
    ],
  },

  skills: [
    {
      icon: '⚙️', title: 'Backend & Languages', order: 1,
      skills: ['C#', '.NET Core', 'ASP.NET MVC', 'Entity Framework', 'REST APIs'],
    },
    {
      icon: '🎨', title: 'Frontend', order: 2,
      skills: ['React', 'Angular', 'Vue', 'TypeScript', 'JavaScript', 'Tailwind', 'Bootstrap'],
    },
    {
      icon: '☁️', title: 'Cloud & Databases', order: 3,
      skills: ['Azure Blob', 'Azure Functions', 'Cosmos DB', 'SQL Server', 'PostgreSQL', 'MongoDB'],
    },
    {
      icon: '🏗️', title: 'Architecture', order: 4,
      skills: ['Microservices', 'Event-Driven', 'RESTful API', 'Cloud Automation', 'Fault-Tolerant'],
    },
    {
      icon: '🛠️', title: 'Tools & Platforms', order: 5,
      skills: ['Git', 'GitHub', 'Azure DevOps', 'Postman', 'VS Code', 'Stripe', 'Sanity.io'],
    },
    {
      icon: '🤖', title: 'AI & Methodology', order: 6,
      skills: ['Gemini API', 'MS Copilot', 'AI Integration', 'Agile', 'Scrum', 'MVVM'],
    },
  ],

  experience: [
    {
      company:  'XtremeLabs LLC',
      role:     'Software Engineer',
      type:     'Full-Time',
      period:   'Aug 2023 - Present',
      location: 'Islamabad, Pakistan',
      current:  true,
      order:    1,
      tech:     ['.NET', 'Azure', 'Gemini AI', 'Angular', 'SQL Server'],
      bullets: [
        'Spearheaded Shopify automation eliminating manual order processing entirely, boosting efficiency by 80-90%.',
        'Designed a scalable automation system for Alibaba Cloud lab environments, account allocation, RAM provisioning, and automated cleanup, reducing operational effort by 80%.',
        'Optimized the XLabs-app to enhance security and reduce processing time by 40%.',
        'Built and deployed an AI-powered assistant using the Gemini AI API and Microsoft Copilot for enhanced user interaction.',
        'Implemented a Round Robin algorithm for load balancing 300+ lab launches per week.',
        'Managed and optimized company databases, reducing query execution time by 30-40%.',
      ],
    },
    {
      company:  'TechLions',
      role:     'Full Stack Developer',
      type:     'Contract',
      period:   'Feb 2023 - Aug 2023',
      location: 'Islamabad, Pakistan',
      current:  false,
      order:    2,
      tech:     ['Angular', '.NET', 'REST APIs', 'Chart.js'],
      bullets: [
        'Developed responsive Angular modules integrated with .NET REST APIs to build scalable front-end interfaces.',
        'Designed a dynamic homepage, enhancing UI/UX for a startup product.',
        'Built custom graphical analytics dashboards to visualize key business metrics using bar and doughnut charts.',
        'Resolved critical bugs and enhanced performance, reducing load time by 25%.',
      ],
    },
    {
      company:  'Digitise Ideas',
      role:     'Full Stack Developer',
      type:     'Internship',
      period:   'Mar 2023 - May 2023',
      location: 'Islamabad, Pakistan',
      current:  false,
      order:    3,
      tech:     ['.NET Core', 'MS SQL', 'Authorize.Net'],
      bullets: [
        'Learned and developed a dynamic authorization system utilizing Roles & Claims for robust user access control.',
        'Enhanced the Authorize.Net payment gateway improving transaction processing speed by 30% and ensuring a 99% payment success rate.',
      ],
    },
  ],

  projects: [
    {
      title:       'Picture Pulse',
      emoji:       '📌',
      description: 'A social networking web app for sharing and organizing images, Pinterest reimagined with smart recommendations.',
      tech:        ['ReactJS', 'Node.js', 'Google OAuth', 'MongoDB'],
      features: [
        'Google OAuth for secure authentication',
        'Search & filtering for content discoverability',
        'Recommendation system for similar pin suggestions',
      ],
      liveUrl:   '#',
      githubUrl: '#',
      featured:  true,
      order:     1,
    },
    {
      title:       'PRIME',
      emoji:       '🛒',
      description: 'A full-featured eCommerce platform enabling store customization, product management, and secure payments.',
      tech:        ['MongoDB', 'Express', 'React', 'Node.js', 'Stripe'],
      features: [
        'Encryption-based auth with secure token management',
        'Store customization with products, text & image support',
        'Stripe integration for seamless payment processing',
        'Responsive UI with advanced search & filtering',
      ],
      liveUrl:   '#',
      githubUrl: '#',
      featured:  true,
      order:     2,
    },
  ],

  education: [
    {
      degree:   'Bachelor of Science, Computer Science',
      school:   'International Islamic University Islamabad',
      period:   '2019 - 2023',
      location: 'Islamabad, Pakistan',
      highlights: [
        'Silver Medalist & Distinction Certificate Awardee',
        'Coursework: Algorithms, Data Structures, Operating Systems, OOP',
      ],
    },
  ],

  achievements: [
  {
    icon:        '🏅',
    title:       'Silver Medalist',
    description: 'Awarded Silver Medal and Distinction Certificate for academic excellence at graduation.',
    issuer:      'International Islamic University Islamabad',
    date:        '2023',
    order:       1,
  },
  {
    icon:        '🎓',
    title:       'BSc Computer Science — Distinction',
    description: 'Bachelor of Science in Computer Science, graduated with distinction.',
    issuer:      'International Islamic University Islamabad',
    date:        '2019 — 2023',
    order:       2,
  },
  {
    icon:        '🤖',
    title:       'Shopify Order Automation',
    description: 'Eliminated manual order processing entirely, boosting team efficiency by 80–90%.',
    issuer:      'XtremeLabs LLC',
    date:        '2024',
    order:       3,
  },
  {
    icon:        '⚡',
    title:       'Database Performance Optimization',
    description: 'Reduced query execution time by 30–40% across company databases through systematic optimization.',
    issuer:      'XtremeLabs LLC',
    date:        '2023',
    order:       4,
  },
  {
    icon:        '🧠',
    title:       'AI Assistant Development',
    description: 'Built and shipped an AI-powered assistant using Gemini API and Microsoft Copilot.',
    issuer:      'XtremeLabs LLC',
    date:        '2024',
    order:       5,
  },
  {
    icon:        '⚖️',
    title:       'Round Robin Load Balancer',
    description: 'Implemented load balancing for 300+ weekly lab launches using a Round Robin algorithm.',
    issuer:      'XtremeLabs LLC',
    date:        '2023',
    order:       6,
  },
],

certifications: [],
  contact: {
      email:    'uzairasim2001@outlook.com',
      phone:    '+92-336-508-2595',
      linkedin: 'https://www.linkedin.com/in/uzair-asim-8a2833235/',
      github:   'https://github.com/Uzair-Asim',
      website:  '',
      location: 'Islamabad, Pakistan',
    },
}

async function seed() {
  console.log('🌱 Connecting to MongoDB...')

  await mongoose.connect(MONGODB_URI, { dbName: 'uzair-portfolio' })

  console.log('✅ Connected. Seeding data...')

  // Delete existing document and replace with fresh seed
  await Portfolio.deleteMany({})
  await Portfolio.create(seedData)

  console.log('✅ Database seeded successfully!')
  console.log('   Collections populated:')
  console.log('   → hero, skills, experience, projects, education, achievements')

  await mongoose.disconnect()
  console.log('🔌 Disconnected.')
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})