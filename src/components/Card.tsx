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
      className={`bg-card rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow duration-300 ${className}`}
    >
      {title && (
        <div className="px-6 py-3 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
          {headerAction}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  )
}

export default Card
