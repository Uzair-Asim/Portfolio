import { getPortfolioData } from '@/lib/data'
import ContactEditor from './ContactEditor'

export default async function ContactAdminPage() {
  const portfolio = await getPortfolioData()

  return (
    <ContactEditor
      initialData={portfolio?.contact ?? {
        email:    '',
        phone:    '',
        linkedin: '',
        github:   '',
        website:  '',
        location: '',
      }}
    />
  )
}