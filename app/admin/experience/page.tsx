import { getPortfolioData } from '@/lib/data'
import ExperienceEditor from './ExperienceEditor'

export default async function ExperienceAdminPage() {
  const portfolio = await getPortfolioData()

  return (
    <ExperienceEditor
      initialData={portfolio?.experience ?? []}
    />
  )
}