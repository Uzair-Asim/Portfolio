import { getPortfolioData } from '@/lib/data'
import HeroEditor from './HeroEditor'

export default async function HeroAdminPage() {
  const portfolio = await getPortfolioData()

  return (
    <HeroEditor
      initialData={portfolio?.hero ?? {
        name:        '',
        title:       '',
        location:    '',
        description: '',
        available:   true,
        stats:       [],
      }}
    />
  )
}