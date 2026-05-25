import ListUser from '@/components/admin/ListUser'
import SkeletonMember from '@/components/SkeletonListMember'
import { Suspense } from 'react'

export default function ListUserPage() {
  return (
    <Suspense fallback={<SkeletonMember/>}>
      <ListUser/>
    </Suspense>
  )
}
