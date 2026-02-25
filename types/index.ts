export type UserRole = 'teacher' | 'student'

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  created_at: string
}

export interface Classroom {
  id: string
  name: string
  description: string | null
  subject: string | null
  section: string | null
  room: string | null
  cover_color: string
  invite_code: string
  teacher_id: string
  created_at: string
  teacher?: Profile
  member_count?: number
}

export interface ClassroomMember {
  id: string
  classroom_id: string
  student_id: string
  joined_at: string
  profile?: Profile
}

export interface Announcement {
  id: string
  classroom_id: string
  author_id: string
  content: string
  created_at: string
  updated_at: string
  author?: Profile
  comments?: Comment[]
}

export interface Comment {
  id: string
  announcement_id: string
  author_id: string
  content: string
  created_at: string
  author?: Profile
}

export interface AttendanceSession {
  id: string
  classroom_id: string
  created_by: string
  date: string
  title: string | null
  is_open: boolean
  created_at: string
  records?: AttendanceRecord[]
}

export interface AttendanceRecord {
  id: string
  session_id: string
  student_id: string
  status: 'present' | 'absent' | 'late'
  profile?: Profile
}

export interface Notification {
  id: string
  user_id: string
  title: string
  body: string
  link: string | null
  is_read: boolean
  created_at: string
}

export interface PendingInvite {
  id: string
  email: string
  classroom_id: string
  invited_by: string
  created_at: string
}
