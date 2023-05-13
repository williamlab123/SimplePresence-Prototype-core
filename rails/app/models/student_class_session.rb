class StudentClassSession < ApplicationRecord
  belongs_to :student
  belongs_to :class_session
end
