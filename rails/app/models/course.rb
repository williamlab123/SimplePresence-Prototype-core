class Course < ApplicationRecord
  has_many :students
  has_many :class_sessions
end
