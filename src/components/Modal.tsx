import React, { useEffect } from "react"
import { XIcon } from "lucide-react"
import Button from "./Button"

type Size = "sm" | "md" | "lg" | "xl"

interface ModalProps {
  isOpen: boolean
  children: React.ReactNode
  onClose: () => void
  title?: string
  size?: Size
  showCloseButton?: boolean
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizes: Record<Size, string> = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>

        <div
          className={`relative bg-white rounded-xl shadow-2xl w-full ${sizes[size]} transform transition-all`}
        >
          {title && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              {showCloseButton && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onClose}
                  className="p-2"
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}

          <div className="px-6 py-4">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default Modal
