class ClassSession < ApplicationRecord
  belongs_to :teacher
  belongs_to :course
  has_many :student_class_sessions
end
