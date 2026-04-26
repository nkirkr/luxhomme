'use client'

import { useEffect, useState } from 'react'
import { fetchDashboardUser } from '@/lib/dashboard/api-client'
import { DashboardShell } from '../DashboardShell'
import { ProfileDataSection } from './ProfileDataSection'
import type { ProfileData } from './ProfileDataSection'

export default function ProfilePage() {
  const [data, setData] = useState<ProfileData | null>(null)

  useEffect(() => {
    fetchDashboardUser()
      .then((res) => {
        const u = res.user
        setData({
          name: u.display_name,
          email: u.email,
          phone: u.phone,
          address: [u.address.address_1, u.address.city, u.address.country, u.address.postcode]
            .filter(Boolean)
            .join(', '),
        })
      })
      .catch(() => {})
  }, [])

  return (
    <DashboardShell loading={!data}>
      {data && <ProfileDataSection initialData={data} />}
    </DashboardShell>
  )
}
