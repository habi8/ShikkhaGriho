import {
  Megaphone,
  ClipboardCheck,
  Users,
  KeyRound,
  Bell,
  ShieldCheck,
} from 'lucide-react'

const features = [
  {
    icon: <Megaphone className="h-6 w-6" />,
    title: 'Announcements',
    description:
      'Post updates, homework, and class notes. Students can reply with comments in real time.',
  },
  {
    icon: <ClipboardCheck className="h-6 w-6" />,
    title: 'Attendance Tracking',
    description:
      'Create attendance sessions, mark students present, absent, or late, and keep detailed records.',
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Member Management',
    description:
      'See who is in your classroom, remove students when needed, and keep rosters up to date.',
  },
  {
    icon: <KeyRound className="h-6 w-6" />,
    title: 'Easy Join Codes',
    description:
      'Share a unique 7-character code with students. They join in seconds — no email invites needed.',
  },
  {
    icon: <Bell className="h-6 w-6" />,
    title: 'Notifications',
    description:
      'Students and teachers are notified of new announcements, replies, and classroom activity.',
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: 'Role-based Access',
    description:
      'Teachers have full control. Students see only what they need. Secure by design with Supabase RLS.',
  },
]

export function Features() {
  return (
    <section className="py-20 sm:py-28 bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">
            Everything you need to run your classroom
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-pretty leading-relaxed">
            Designed for teachers and students in Bangladesh, ShikkhaGriho provides all the tools
            for a smooth digital classroom experience.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-sm transition-all"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {feature.icon}
              </div>
              <h3 className="mb-2 font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
