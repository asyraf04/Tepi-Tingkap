import React from 'react'

interface SocialButtonProps {
  icon: React.ReactNode
  label: string
  onClick?: () => void
}

const SocialButton: React.FC<SocialButtonProps> = ({ icon, label, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center space-x-2 py-3 px-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300"
    >
      {icon}
      <span className="text-white font-medium">{label}</span>
    </button>
  )
}

export default SocialButton
