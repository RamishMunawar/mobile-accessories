import { useTheme } from '../../theme/useTheme'
import { IconMonitor, IconMoon, IconSun } from './Icons'

const titles = {
  system: 'Theme: match system (click to use light)',
  light: 'Theme: light (click to use dark)',
  dark: 'Theme: dark (click to match system)',
}

export default function ThemeToggle() {
  const { theme, cycleTheme } = useTheme()
  const Icon = theme === 'system' ? IconMonitor : theme === 'dark' ? IconMoon : IconSun

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-exclusive-dark transition hover:bg-app-muted"
      aria-label={titles[theme]}
      title={titles[theme]}
    >
      <Icon className="h-[22px] w-[22px]" />
    </button>
  )
}
