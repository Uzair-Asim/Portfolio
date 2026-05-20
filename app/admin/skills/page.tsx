import { getPortfolioData } from '@/lib/data'
import SkillsEditor from './SkillsEditor'

export default async function SkillsAdminPage() {
  const portfolio = await getPortfolioData()

  return (
    <SkillsEditor
      initialData={portfolio?.skills ?? []}
    />
  )
}