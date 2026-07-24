import { getSiteSetting } from '@/lib/data'

export async function AnnouncementBar() {
  const announcement = await getSiteSetting<{ text: string; enabled: boolean }>('announcement')
  if (!announcement?.enabled || !announcement.text) return null
  return (
    <div className="bg-foreground text-background">
      <p className="mx-auto max-w-7xl px-4 py-2 text-center text-xs font-medium tracking-wide lg:px-8">
        {announcement.text}
      </p>
    </div>
  )
}
