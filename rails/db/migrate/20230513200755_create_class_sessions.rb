class CreateClassSessions < ActiveRecord::Migration[7.0]
  def change
    create_table :class_sessions do |t|
      t.references :teacher
      t.references :course

      t.boolean :active

      t.timestamps
    end
  end
end
