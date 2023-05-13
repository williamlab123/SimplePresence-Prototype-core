class StudentsController < ApplicationController
  def me
    render(json: current_student)
  end

  def active_classes
    render(json: current_student.course.class_sessions)
  end

  def participate
    return render(json: { message: 'Already finished' }, status: 422) unless current_class_session.active

    student_session = current_class_session.student_class_sessions.find_by(student: current_student)
    return render(json: { message: 'Already registered' }, status: 422) if student_session

    render(json: current_class_session.student_class_sessions.create!(student: current_student))
  end

  private

  def current_class_session
    @current_class_session ||= current_student.course.class_sessions.find(params[:id])
  end

  def current_student
    @current_student ||= Student.find(request.headers['Id'])
  end
end
