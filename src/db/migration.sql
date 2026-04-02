[
  {
    "table_name": "attendance_sessions",
    "column_name": "id",
    "data_type": "integer"
  },
  {
    "table_name": "attendance_sessions",
    "column_name": "teacher_email",
    "data_type": "character varying"
  },
  {
    "table_name": "attendance_sessions",
    "column_name": "student_name",
    "data_type": "character varying"
  },
  {
    "table_name": "attendance_sessions",
    "column_name": "course_name",
    "data_type": "character varying"
  },
  {
    "table_name": "attendance_sessions",
    "column_name": "session_date",
    "data_type": "date"
  },
  {
    "table_name": "attendance_sessions",
    "column_name": "session_time",
    "data_type": "time without time zone"
  },
  {
    "table_name": "attendance_sessions",
    "column_name": "duration",
    "data_type": "integer"
  },
  {
    "table_name": "attendance_sessions",
    "column_name": "notes",
    "data_type": "text"
  },
  {
    "table_name": "attendance_sessions",
    "column_name": "created_at",
    "data_type": "timestamp without time zone"
  },
  {
    "table_name": "course_assignments",
    "column_name": "id",
    "data_type": "integer"
  },
  {
    "table_name": "course_assignments",
    "column_name": "student_email",
    "data_type": "character varying"
  },
  {
    "table_name": "course_assignments",
    "column_name": "course_title",
    "data_type": "character varying"
  },
  {
    "table_name": "course_assignments",
    "column_name": "assigned_at",
    "data_type": "timestamp without time zone"
  },
  {
    "table_name": "course_videos",
    "column_name": "id",
    "data_type": "integer"
  },
  {
    "table_name": "course_videos",
    "column_name": "course_title",
    "data_type": "character varying"
  },
  {
    "table_name": "course_videos",
    "column_name": "video_url",
    "data_type": "text"
  },
  {
    "table_name": "course_videos",
    "column_name": "thumbnail_url",
    "data_type": "text"
  },
  {
    "table_name": "course_videos",
    "column_name": "notes",
    "data_type": "text"
  },
  {
    "table_name": "course_videos",
    "column_name": "upload_date",
    "data_type": "timestamp without time zone"
  },
  {
    "table_name": "courses",
    "column_name": "id",
    "data_type": "integer"
  },
  {
    "table_name": "courses",
    "column_name": "title",
    "data_type": "character varying"
  },
  {
    "table_name": "courses",
    "column_name": "category",
    "data_type": "character varying"
  },
  {
    "table_name": "courses",
    "column_name": "created_at",
    "data_type": "timestamp without time zone"
  },
  {
    "table_name": "students_profile",
    "column_name": "user_id",
    "data_type": "uuid"
  },
  {
    "table_name": "students_profile",
    "column_name": "student_code",
    "data_type": "character varying"
  },
  {
    "table_name": "students_profile",
    "column_name": "guardian_name",
    "data_type": "character varying"
  },
  {
    "table_name": "students_profile",
    "column_name": "guardian_phone",
    "data_type": "character varying"
  },
  {
    "table_name": "students_profile",
    "column_name": "department",
    "data_type": "character varying"
  },
  {
    "table_name": "students_profile",
    "column_name": "registered_subjects",
    "data_type": "jsonb"
  },
  {
    "table_name": "students_profile",
    "column_name": "country",
    "data_type": "character varying"
  },
  {
    "table_name": "teacher_finances",
    "column_name": "id",
    "data_type": "integer"
  },
  {
    "table_name": "teacher_finances",
    "column_name": "teacher_email",
    "data_type": "character varying"
  },
  {
    "table_name": "teacher_finances",
    "column_name": "total_sessions",
    "data_type": "integer"
  },
  {
    "table_name": "teacher_finances",
    "column_name": "total_due",
    "data_type": "numeric"
  },
  {
    "table_name": "teacher_finances",
    "column_name": "total_paid",
    "data_type": "numeric"
  },
  {
    "table_name": "teacher_finances",
    "column_name": "last_payment_date",
    "data_type": "timestamp without time zone"
  },
  {
    "table_name": "teachers_profile",
    "column_name": "user_id",
    "data_type": "uuid"
  },
  {
    "table_name": "teachers_profile",
    "column_name": "specialization",
    "data_type": "text"
  },
  {
    "table_name": "teachers_profile",
    "column_name": "bio",
    "data_type": "text"
  },
  {
    "table_name": "teachers_profile",
    "column_name": "is_on_leave",
    "data_type": "boolean"
  },
  {
    "table_name": "teachers_profile",
    "column_name": "rating",
    "data_type": "numeric"
  },
  {
    "table_name": "teachers_profile",
    "column_name": "rate_per_session",
    "data_type": "numeric"
  },
  {
    "table_name": "users",
    "column_name": "id",
    "data_type": "uuid"
  },
  {
    "table_name": "users",
    "column_name": "email",
    "data_type": "character varying"
  },
  {
    "table_name": "users",
    "column_name": "password",
    "data_type": "character varying"
  },
  {
    "table_name": "users",
    "column_name": "name",
    "data_type": "character varying"
  },
  {
    "table_name": "users",
    "column_name": "role",
    "data_type": "USER-DEFINED"
  },
  {
    "table_name": "users",
    "column_name": "course",
    "data_type": "character varying"
  },
  {
    "table_name": "users",
    "column_name": "phone",
    "data_type": "character varying"
  },
  {
    "table_name": "users",
    "column_name": "age",
    "data_type": "integer"
  },
  {
    "table_name": "users",
    "column_name": "level",
    "data_type": "character varying"
  },
  {
    "table_name": "users",
    "column_name": "photo_url",
    "data_type": "text"
  },
  {
    "table_name": "users",
    "column_name": "status",
    "data_type": "character varying"
  },
  {
    "table_name": "users",
    "column_name": "join_date",
    "data_type": "timestamp without time zone"
  },
  {
    "table_name": "users",
    "column_name": "last_login",
    "data_type": "timestamp without time zone"
  },
  {
    "table_name": "users",
    "column_name": "redirect_url",
    "data_type": "character varying"
  }
]