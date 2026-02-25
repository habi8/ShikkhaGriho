import { Library, Megaphone, Users, ClipboardCheck, Bell, Globe } from 'lucide-react'

const features = [
  {
    icon: <Library className="h-7 w-7" />,
    title: 'Classroom Management',
    description: 'Create and manage multiple classrooms with ease.',
  },
  {
    icon: <Megaphone className="h-7 w-7" />,
    title: 'Announcements & Resources',
    description: 'Share updates, meeting links, and downloadable files.',
  },
  {
    icon: <Users className="h-7 w-7" />,
    title: 'Smart Member System',
    description: 'Add students via email, username, or invitation link.',
  },
  {
    icon: <ClipboardCheck className="h-7 w-7" />,
    title: 'Attendance Tracking',
    description: 'Open attendance, let students mark presence, verify instantly.',
  },
  {
    icon: <Bell className="h-7 w-7" />,
    title: 'Real-Time Notifications',
    description: 'Stay updated on comments, announcements, and invites.',
  },
  {
    icon: <Globe className="h-7 w-7" />,
    title: 'Dual Language Support',
    description: 'Seamless English & Bangla experience.',
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-24 bg-[#F8FAFC]">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold text-[#2E8B57] sm:text-4xl mb-12">
          Powerful Classroom Tools
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-[#E2E8F0] bg-white p-6 hover:shadow-md transition-shadow"
            >
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E6F4EA] text-[#2E8B57] shrink-0">
                  {feature.icon}
                </div>
                <h3 className="text-base font-bold text-[#0F172A] leading-snug">{feature.title}</h3>
              </div>
              <p className="text-sm text-[#475569] leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
