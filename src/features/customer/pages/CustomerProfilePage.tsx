import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Camera, Check, MapPin, Phone, Trash2, UserRound } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/shared/PageHeader'
import { SectionCard } from '@/components/shared/SectionCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { readProfilePhoto } from '@/lib/profile-photo'
import { cn } from '@/lib/utils'
import {
  useCustomerProfileStore,
  type CustomerProfile,
} from '@/stores/customer-profile-store'

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || '?'
  )
}

function withPhotoDefaults(profile: CustomerProfile): CustomerProfile {
  return { ...profile, photoUrl: profile.photoUrl ?? '' }
}

export default function CustomerProfilePage() {
  const profile = useCustomerProfileStore((s) => s.profile)
  const hasSaved = useCustomerProfileStore((s) => s.hasSaved)
  const updateProfile = useCustomerProfileStore((s) => s.updateProfile)
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<CustomerProfile>(() => withPhotoDefaults(profile))
  const [photoBusy, setPhotoBusy] = useState(false)

  useEffect(() => {
    setForm(withPhotoDefaults(profile))
  }, [profile])

  const dirty =
    form.name !== (profile.name ?? '') ||
    form.contactNumber !== (profile.contactNumber ?? '') ||
    form.deliveryAddress !== (profile.deliveryAddress ?? '') ||
    form.notes !== (profile.notes ?? '') ||
    form.photoUrl !== (profile.photoUrl ?? '')

  async function onPickPhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setPhotoBusy(true)
    try {
      const result = await readProfilePhoto(file)
      if (!result.ok) {
        toast.error(result.message)
        return
      }
      setForm((f) => ({ ...f, photoUrl: result.dataUrl }))
      toast.success('Photo ready — save your profile to keep it.')
    } finally {
      setPhotoBusy(false)
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error('Please enter your name.')
      return
    }
    if (!form.contactNumber.trim()) {
      toast.error('Please enter a contact number.')
      return
    }
    if (!form.deliveryAddress.trim()) {
      toast.error('Please enter your drop-off address.')
      return
    }
    updateProfile(form)
    toast.success('Profile saved. Checkout will use these details.')
  }

  const displayName = form.name.trim() || 'Demo shopper'

  return (
    <>
      <PageHeader
        width="default"
        eyebrow="Account"
        title="My profile"
        description="Local demo profile — edits stay in this browser and feed checkout."
      />

      <div className="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:px-6">
        <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-2">
          <SectionCard title="Shopper details" icon={UserRound}>
            <div className="mb-4 flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0">
                {form.photoUrl ? (
                  <img
                    src={form.photoUrl}
                    alt=""
                    className="h-full w-full rounded-2xl object-cover ring-2 ring-primary/15"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center rounded-2xl bg-primary-100 font-display text-2xl font-extrabold text-primary-deep">
                    {initials(displayName)}
                  </span>
                )}
                <button
                  type="button"
                  disabled={photoBusy}
                  onClick={() => fileRef.current?.click()}
                  aria-label="Upload profile photo"
                  className={cn(
                    'absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-md transition hover:bg-primary-deep',
                    photoBusy && 'opacity-60',
                  )}
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-extrabold text-primary-deep">
                  {displayName}
                </p>
                <p className="truncate text-sm text-muted">
                  Demo shopper · saved on this device
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={photoBusy}
                    onClick={() => fileRef.current?.click()}
                  >
                    <Camera className="h-3.5 w-3.5" />
                    {form.photoUrl ? 'Change' : 'Upload'}
                  </Button>
                  {form.photoUrl ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => setForm((f) => ({ ...f, photoUrl: '' }))}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </Button>
                  ) : null}
                </div>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                onChange={onPickPhoto}
              />
            </div>

            <div className="grid gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="profile-name">Full name</Label>
                <Input
                  id="profile-name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="profile-phone">
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    Contact number
                  </span>
                </Label>
                <Input
                  id="profile-phone"
                  value={form.contactNumber}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, contactNumber: e.target.value }))
                  }
                  placeholder="09XXXXXXXXX"
                  required
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Delivery details" icon={MapPin}>
            <div className="space-y-3">
              <div className="grid gap-1.5">
                <Label htmlFor="profile-address">Drop-off address *</Label>
                <Textarea
                  id="profile-address"
                  value={form.deliveryAddress}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      deliveryAddress: e.target.value,
                    }))
                  }
                  placeholder="House/unit no., street, barangay, landmark…"
                  rows={3}
                  required
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="profile-notes">Default notes (optional)</Label>
                <Textarea
                  id="profile-notes"
                  value={form.notes}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notes: e.target.value }))
                  }
                  placeholder="e.g. Leave with guard, call on arrival…"
                  rows={3}
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button type="submit" disabled={!dirty && hasSaved}>
                  <Check className="h-4 w-4" />
                  {hasSaved ? 'Save changes' : 'Save profile'}
                </Button>
                <Button asChild type="button" variant="outline">
                  <Link to="/customer/orders">View my orders</Link>
                </Button>
              </div>
            </div>
          </SectionCard>
        </form>
      </div>
    </>
  )
}
