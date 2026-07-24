'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function NewsletterForm() {
  const [email, setEmail] = useState('')

  function subscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    toast.success('You\u2019re on the list. Watch for the next drop.')
    setEmail('')
  }

  return (
    <form onSubmit={subscribe} className="flex max-w-sm gap-2">
      <Input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email for the newsletter"
        aria-label="Email address"
      />
      <Button type="submit">Join</Button>
    </form>
  )
}
