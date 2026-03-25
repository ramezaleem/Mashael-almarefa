# PostgreSQL Database Schema - Mashael Al-Ma'refa (مشاعل المعرفة)

This document provides a comprehensive database schema designed for the **Mashael Al-Ma'refa** platform. The schema is optimized for **PostgreSQL** and covers users, roles (Students/Teachers/Admins), courses, sessions, and academic progress tracking based on a deep analysis of the application files.

---

## 1. Core Identity & Authentication

### `users` Table
The central table for all account types.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Unique identifier for every user. |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Primary login identifier. |
| `password_hash` | VARCHAR(512) | NOT NULL | Bcrypt/Argon2 hashed password. |
| `full_name` | VARCHAR(255) | NOT NULL | User's full name (e.g., "أحمد محمود"). |
| `role` | role_type (ENUM) | NOT NULL | Enum: 'student', 'teacher', 'admin'. |
| `image_url` | TEXT | NULL | Profile picture path/URL. |
| `is_active` | BOOLEAN | DEFAULT TRUE | Account state (Active/Suspended). |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Account creation time. |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update time. |

---

## 2. Specialized User Profiles

### `students` Table
Stores student-specific metadata.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `user_id` | UUID | PK, FK -> `users(id)` | Linked user account. |
| `student_code` | VARCHAR(50) | UNIQUE | e.g., 'STD-24017'. |
| `department_id` | INTEGER | FK -> `departments(id)` | Main department/track. |
| `age` | INTEGER | NULL | Student's age. |
| `country` | VARCHAR(100) | NULL | e.g., 'مصر', 'السعودية'. |
| `guardian_name` | VARCHAR(255) | NULL | Parent/Guardian name. |
| `guardian_phone`| VARCHAR(20) | NULL | Contact mobile. |
| `current_level` | VARCHAR(255) | NULL | e.g., 'المستوى الثاني'. |
| `general_notes` | TEXT | NULL | Admin notes about the student. |

### `teachers` Table
Stores teacher-specific metadata.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `user_id` | UUID | PK, FK -> `users(id)` | Linked user account. |
| `teacher_code` | VARCHAR(50) | UNIQUE | e.g., 'QUR-T-001'. |
| `specialization`| VARCHAR(255) | NULL | e.g., 'حفظ ومراجعة تجويد'. |
| `availability`  | TEXT | NULL | Text description of available hours. |
| `phone_whatsapp`| VARCHAR(20) | NULL | Direct WhatsApp number. |
| `average_rating`| NUMERIC(3,2) | DEFAULT 5.0 | Rating based on student feedback. |
| `bio`           | TEXT | NULL | Professional biography. |
| `rate_per_session`| NUMERIC(10,2) | DEFAULT 0 | Payment rate per hour/session. |
| `status`        | VARCHAR(20) | DEFAULT 'active' | active, on_leave, inactive. |

---

## 3. Academic Structure

### `departments` Table
The main categories seen in the sidebar.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PK | Unique identifier. |
| `name` | VARCHAR(100) | UNIQUE | e.g., 'ركن القرآن', 'المناهج'. |
| `slug` | VARCHAR(100) | UNIQUE | e.g., 'quran-and-sciences'. |

### `courses` Table
Specific educational programs or subjects.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PK | Unique identifier. |
| `department_id` | INTEGER | FK -> `departments(id)` | Parent department. |
| `title` | VARCHAR(255) | NOT NULL | e.g., 'النحو: تأسيس وتوظيف'. |
| `description` | TEXT | NULL | Detailed course info. |
| `icon` | VARCHAR(10) | NULL | Emoji or icon identifier. |
| `video_url` | TEXT | NULL | Link to recorded lessons if any. |

### `teacher_subjects` (Many-to-Many)
Links teachers to the subjects they are capable of teaching.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `teacher_id` | UUID | FK -> `teachers(user_id)` | The teacher profile. |
| `subject_name` | VARCHAR(100) | NOT NULL | e.g., 'Arabic', 'Math'. |
| *Primary Key* | (`teacher_id`, `subject_name`) | |复合主键. |

---

## 4. Relationship & Progress Tracking

### `enrollments` Table
Links students to specific courses (Access Control).
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PK | Enrollment ID. |
| `student_id` | UUID | FK -> `students(user_id)` | Enrolled student. |
| `course_id` | INTEGER | FK -> `courses(id)` | Targeted course. |
| `enrolled_at` | TIMESTAMP | DEFAULT NOW() | Enrollment date. |
| `status` | VARCHAR(20) | DEFAULT 'active' | active, expired, pending. |

### `student_progress` Table
Historical and live tracking of a student's performance in a course.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PK | Progress record ID. |
| `student_id` | UUID | FK -> `students(user_id)` | |
| `course_id` | INTEGER | FK -> `courses(id)` | |
| `attendance_pct`| INTEGER | DEFAULT 100 | Attendance percentage. |
| `avg_rating` | NUMERIC(3,2) | NULL | Performance rating (0-10). |
| `hours_done` | INTEGER | DEFAULT 0 | Completed study hours. |
| `skill_reading` | INTEGER | CHECK (0-100) | Score in Reading. |
| `skill_writing` | INTEGER | CHECK (0-100) | Score in Writing. |
| `skill_listening`| INTEGER | CHECK (0-100) | Score in Listening. |
| `skill_speech` | INTEGER | CHECK (0-100) | Score in Conversation. |
| `achievements` | TEXT | NULL | List of awards/milestones. |
| `teacher_notes` | TEXT | NULL | Remarks from the educator. |

---

## 5. Scheduling & Communication

### `sessions` Table
Live classes scheduled between a teacher and a student.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PK | Session ID. |
| `teacher_id` | UUID | FK -> `teachers(user_id)` | Instructor. |
| `student_id` | UUID | FK -> `students(user_id)` | Attendee student. |
| `course_id` | INTEGER | FK -> `courses(id)` | Related course. |
| `scheduled_at` | TIMESTAMP | NOT NULL | Date and time (Meet link active). |
| `duration` | INTEGER | DEFAULT 60 | Minutes. |
| `meet_link` | TEXT | NULL | Google Meet / Zoom link. |
| `status` | session_status | Enum: 'upcoming', 'done', 'cancelled'. |

---

## 6. Relationships (Foreign Keys Summary)

1.  **Users ↔ Roles**: `students` and `teachers` reference `users(id)` via `user_id`. (1:1 relation)
2.  **Courses ↔ Departments**: `courses.department_id` references `departments.id`. (M:1 relation)
3.  **Enrollments ↔ Academics**: `enrollments` references `students` and `courses`. (M:N relation handled via joining table)
4.  **Progress ↔ Students**: `student_progress` references `students` and `courses` to track specific performance per course.
5.  **Sessions ↔ All**: `sessions` references `teachers`, `students`, and `courses` to form the triangle of a live class.

---

## 7. Useful SQL Enums (PostgreSQL)

```sql
CREATE TYPE role_type AS ENUM ('student', 'teacher', 'admin');
CREATE TYPE session_status AS ENUM ('upcoming', 'completed', 'cancelled');
```
