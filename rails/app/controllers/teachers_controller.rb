class TeachersController < ApplicationController
  def me
    render(json: current_teacher)
  end

  def create_session
    active_session = current_teacher.class_sessions.find_by(active: true)
    return render(json: { message: "Session #{active_session.id} in progress", status: 422 }) if active_session

    render(json: current_teacher.class_sessions.create!(course: Course.find(params[:id]), active: true))
  end

  def close_session
    render(json: current_teacher.class_sessions.find_by(id: params[:id]).update!(active: false))
  end

  def students_in_session
    session = current_teacher.class_sessions.find(params[:id])
    students = session.student_class_sessions.map(&:student)

    render(json: students)
  end

  private

  def current_teacher
    @current_teacher ||= Teacher.find(request.headers['Id'])
  end
end
