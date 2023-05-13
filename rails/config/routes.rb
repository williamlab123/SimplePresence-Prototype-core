Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
  namespace :student do
    get 'me', controller: '/students'
    get 'active_classes', controller: '/students'
    post 'participate/:id', controller: '/students', action: :participate
  end

  namespace :teacher do
    get 'me', controller: '/teachers'
    get 'students_in_session/:id', controller: '/teachers', action: :students_in_session
    post 'create_session/:id', controller: '/teachers', action: :create_session
    post 'close_session/:id', controller: '/teachers', action: :close_session
  end
end
