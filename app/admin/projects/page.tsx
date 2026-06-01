import { getPortfolioData } from '@/lib/data'
import ProjectsEditor from './ProjectsEditor'

export default async function ProjectsAdminPage() {
  const portfolio = await getPortfolioData()

  return (
    <ProjectsEditor
      initialData={portfolio?.projects ?? []}
    />
  )
}