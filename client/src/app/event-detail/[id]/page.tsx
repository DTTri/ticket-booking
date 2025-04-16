import DetailNavigator from '@/components/event-detail/DetailNavigator'
import React from 'react'

export default function page() {
  return (
    <div style={{ height: 'calc(100vh - 70px)' }} className='w-full overflow-hidden'>
        <DetailNavigator />
    </div>
  )
}
