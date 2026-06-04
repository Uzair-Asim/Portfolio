import { getPortfolioData } from '@/lib/data'
import AchievementsEditor from './AchievementsEditor'

export default async function AchievementsAdminPage() {
  const portfolio = await getPortfolioData()

  return (
    <AchievementsEditor
      initialAchievements={portfolio?.achievements  ?? []}
      initialCertifications={portfolio?.certifications ?? []}
    />
  )
}