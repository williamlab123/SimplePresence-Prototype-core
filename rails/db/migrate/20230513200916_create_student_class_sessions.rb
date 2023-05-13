class CreateStudentClassSessions < ActiveRecord::Migration[7.0]
  def change
    create_table :student_class_sessions do |t|
      t.references :class_session
      t.references :student

      t.timestamps
    end
  end
end
