import React from 'react'
interface CardProps {
  title?: string
  children: React.ReactNode
  headerAction?: React.ReactNode
  className?: string
}
const Card: React.FC<CardProps> = ({
  title = '',
  children,
  className = '',
  headerAction = '',
}) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 ${className}`}
    >
      {title && (
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          {headerAction}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  )
}

export default Card
