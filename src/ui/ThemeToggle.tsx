'use client'

import * as React from 'react'
import { MoonIcon, SunIcon, DesktopIcon } from '@radix-ui/react-icons'
import { useTheme } from '../providers/ThemeProvider'
import { Button } from './Button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    if (!mounted) {
      return <SunIcon className="h-4 w-4" />
    }

    if (theme === 'light') {
      return <SunIcon className="h-4 w-4" />
    } else if (theme === 'dark') {
      return <MoonIcon className="h-4 w-4" />
    } else {
      // system theme
      return <DesktopIcon className="h-4 w-4" />
    }
  }

  const getLabel = () => {
    if (theme === 'light') return 'Light'
    if (theme === 'dark') return 'Dark'
    return 'System'
  }

  const getNextTheme = () => {
    if (theme === 'light') return 'Dark'
    if (theme === 'dark') return 'System'
    return 'Light'
  }

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" className="gap-2" disabled>
        <SunIcon className="h-4 w-4" />
        <span className="sr-only">Loading theme toggle</span>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="gap-2 min-w-[80px]"
      title={`Current theme: ${getLabel()}. Click to switch to ${getNextTheme()}.`}
    >
      {getIcon()}
      <span className="text-xs font-medium">{getLabel()}</span>
      <span className="sr-only">
        Switch from {getLabel()} to {getNextTheme()} theme
      </span>
    </Button>
  )
}
