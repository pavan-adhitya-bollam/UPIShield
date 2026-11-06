import { motion } from 'framer-motion'
import Card from '../Card'

const LoadingState = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-white/10 rounded-lg animate-pulse" />
          <div className="h-4 w-64 bg-white/5 rounded-lg animate-pulse" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-white/10 rounded-lg animate-pulse" />
          <div className="h-10 w-32 bg-white/10 rounded-lg animate-pulse" />
          <div className="h-10 w-24 bg-white/10 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
                <div className="h-8 w-20 bg-white/10 rounded animate-pulse" />
                <div className="h-4 w-16 bg-white/5 rounded animate-pulse" />
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-xl animate-pulse" />
            </div>
          </Card>
        ))}
      </div>

      {/* Filters Skeleton */}
      <Card className="mb-6">
        <div className="h-12 bg-white/10 rounded-xl animate-pulse mb-4" />
        <div className="space-y-4">
          <div className="h-10 bg-white/5 rounded-lg animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="h-10 bg-white/5 rounded-lg animate-pulse" />
            <div className="h-10 bg-white/5 rounded-lg animate-pulse" />
            <div className="h-10 bg-white/5 rounded-lg animate-pulse" />
          </div>
        </div>
      </Card>

      {/* Table Skeleton */}
      <Card>
        <div className="space-y-3">
          {/* Table Header */}
          <div className="h-12 bg-white/10 rounded-lg animate-pulse" />
          
          {/* Table Rows */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
          <div className="h-6 w-48 bg-white/5 rounded animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-white/10 rounded-lg animate-pulse" />
            <div className="h-8 w-8 bg-white/10 rounded-lg animate-pulse" />
            <div className="h-8 w-8 bg-white/10 rounded-lg animate-pulse" />
          </div>
        </div>
      </Card>
    </div>
  )
}

export default LoadingState
