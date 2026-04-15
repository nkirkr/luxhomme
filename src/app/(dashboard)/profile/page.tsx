import type { Metadata } from 'next'
import { DashboardShell } from '../DashboardShell'
import { ProfileDataSection } from './ProfileDataSection'

export const metadata: Metadata = {
  title: 'Данные | Luxhommè',
}

const USER_DATA = {
  name: 'Иван Иванов',
  email: 'primer@gmai.com',
  phone: '+7 (999) 999-99-99',
  address: 'ул. Профсоюзная, Москва, Россия, 117393',
}

export default function ProfilePage() {
  return (
    <DashboardShell>
      <ProfileDataSection initialData={USER_DATA} />
    </DashboardShell>
  )
}
