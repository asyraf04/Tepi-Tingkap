import React from 'react'
import { LucideIcon } from 'lucide-react'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon
}

const FormInput: React.FC<FormInputProps> = ({ icon: Icon, ...props }) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className="w-5 h-5 text-white/50" />
      </div>
      <input
        {...props}
        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
      />
    </div>
  )
}

export default FormInput
