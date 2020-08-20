# GETjob 

## Description

Wondering what type of skills you need for landing a job in the tech industry? Wonder no more!  

With us, at GETjob you can know exactly what skills do you need for an specific job opening connect them with your own projects which you can add to the app, and if you don't have any, get recommendations in relevant e-learning courses that will help you build projects which you can use to link to the relevant skills in the job you're applying. 

## User Stories

- **404:** As an anon/user I can see a 404 page if I try to reach a page that does not exist so that I know it's my fault
- **Signup:** As an anon I can sign up in the platform so that I can start searching for a job opening.
- **Login:** As a user I can login to the platform so that I can search for a job opening.
- **Logout:** As a user I can logout from the platform so no one else can use it.
- **Check my profile:** As a user I want to see my profile and also access to the pending applications, completed applications and portfolio.
- **Edit my Profile** As a user I can edit my profile.
- **Search jobs ** As a user I can search for jobs listing by two different choices, and select a maximum of three skills.
- **List of Jobs** As a user I can see the list of all jobs that you already filtered.

## Backlog

###### Admin features:

- have an admin who can administrate all the applications from different users, and personalize the courses. 

###### User features:

- have the possibility to choose more than three categories (skills) 
- display applied jobs on a calendar, to see when you applied.

- have a chat with the admin of the app, to have feedback about the user applications.



# Client / Front-end

## Routes (React App)

| Path                           | Component      | Permissions | Behavior                                                     |
| ------------------------------ | -------------- | ----------- | ------------------------------------------------------------ |
| `/`                            | Home           | anon only   | Home page                                                    |
| `/signup`                      | Signup         | anon only   | Signup form, divided in two different views; 1.{firstname, lastname, email. password} |
| `/signup`                      | Signup         | anon only   | Signup form, divided in two different views; 2.{profile picture, city, country, phone}, navigate to search directory after do the signup. |
| `/login`                       | Login          | anon only   | Login form, link to signup, navigate to home directory after login. |
| `/logout`                      | n/a            | anon only   | Navigate to Home after logout, expire session                |
| `/search`                      | SelectJob      | user        | The user have to choose between two options, and different skills. |
| `/search-list`                 | RemoteJobList  | user        | Show  a list of  remote jobs, depending of the parameters that you chose previously. |
| `/search-list`                 | ProjectJobList | user        | Show  a list of project jobs, depending of the parameters that you chose previously. |
| `/detail-job/:id`              | RemoteDetail   | user        | Show details of the remote job previously chosen, with the technologies to complete. |
| `/detail-job/:id`              | ProjectDetail  | user        | Show details of the project job previously chosen, with the technologies to complete. |
| `/detail-job/:id/technologies` | Technologies   | user        | Shows the technology  previously chosen and space to submit the link, and to submit and comeback to detail-job. |
| `/user/:id`                    | Profile        | user        | Show details of the user content and access to other views.  |
| `/user/edit/:id`               | EditProfile    | user        | User can edit his own profile.                               |
| `/user/pending-jobs`           | PendingJobs    | user        | You can filter between remote or project jobs that you didn't complete  the apply, and access to details |
| `/user/pending-jobs`           | CompleteJobs   | user        | You can filter between remote or project jobs that you already applied, and access to details |
| `/user/portfolio`              | Portfolio      | user        | You can see the links of the user skills, edit them, and delete them |



## Components

- Home

## Services

- Auth Service
  - 
- User Service
  - 
- Job Service
  - job.getAll()
  - job.getByFilter()
  - job.getOne(id)
  - job.create(body)
  - job.updateOne(id, body)
  - job.delete(id)
  
  



# Server / Back-end

## Models

###### User model

```
{
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  city: {type: String, required: true},
  country:{type: String, required},
  phone: {type: String},
  linkedin:{type: String},
  image: {type: String},
  jobs: [{  type: mongoose.Schema.Types.ObjectId, ref: "Job"}],
  portfolio:  [{  type:    mongoose.Schema.Types.ObjectId, ref: "Portfolio"}]
  },

```

###### Job model

```
{
  userId: [{ type:mongoose.Schema.Types.ObjectId,   ref: "User" }],
  title: {type: String},  
  company_name: {type: String},
  publication_date: {type: Date},
  url: {type: String},
  tags: [{ type: String}],
  technologies: [
  { 
    name: { type: String},
    url: { type: String }
  }
]
  candidate_required_location: {type: String},
  isApplication: {type:Boolean, default:false},
  ??jobType: {type:String, enum:['remote', 'project']},
  category: {type:String}
},  
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
```

###### 

```

```

###### Portfolio model

```
{
   userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    technologies: [{ 
    name: { type: String},
    url: { type: String }
  }],
}, 
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
}
```

###### 

```

```



## API Endpoints (back-end routes)

| HTTP Method | URL                              | Request Body                                                 | Success status | Error Status | Description                                                  |
| ----------- | -------------------------------- | ------------------------------------------------------------ | -------------- | ------------ | ------------------------------------------------------------ |
| GET         | `/auth/me`                       | Saved session                                                | 200            | 404          | Check if user is logged in and return profile page           |
| POST        | `/auth/signup`                   | {firstName,lastName,email,password,country, city, image, phone, linkedIn} | 201            | 404          | Checks if fields not empty (422) and user not exists (409), then create user with encrypted password, and store user in session |
| POST        | `/auth/login`                    | {username, password}                                         | 200            | 401          | Checks if fields not empty (422), if user exists (404), and if password matches (404), then stores user in session |
| POST        | `/auth/logout`                   | (empty)                                                      | 204            | 400          | Logs out the user                                            |
| GET         | /job-list                        | [{list of jobs}]                                             | 200            | 400          |                                                              |
| GET         | `/job-detail/remote`             | {name, links}                                                | 200            | 400          | Shows technology tags associated to job from API             |
| GET         | `/job-detail/project`            | {name, links}                                                | 200            | 400          | Shows technology tags associated to job from API             |
| POST        | `/job-detail/remote`             | {title, company_name, publication_date, url, candidate_required_location, job_type } | 200            | 400          | Creates a remote job document                                |
| POST        | `/job-detail/project`            | {title, publication_date, url, budget, snippet, job-type }   | 200            | 400          | Creates a freelance job document                             |
| POST        | `/job-detail/job/technology`     | {title, company_name, publication_date, url, candidate_required_location, job_type } | 200            | 400          | Creates a remote job document                                |
|             |                                  |                                                              |                |              |                                                              |
| POST        | `/job-detail/job/technology`     | {technology._id, user._id}                                   | 200            | 400          | Creates a portfolio document                                 |
| GET         | `/user/:id`                      | {id}                                                         | 200            | 400          | Show profile                                                 |
| PUT         | `/user/edit/:id`                 | {id,firstName,lastName,phone,image,city, country ,linkedin}  | 200            | 400          | Edit user profile                                            |
| GET         | `/jobs/:id`                      | {id}                                                         |                |              | Shows specific saved job                                     |
| DELETE      | `/user/jobs/:id`                 | {id}                                                         | 200            | 400          | Delete saved jobs                                            |
| GET         | `/user/portfolio/technology/:id` | {items}                                                      | 200            | 400          | Shows portfolio items                                        |
| PUT         | `/user/portfolio/technology/:id` | {items}                                                      | 200            | 400          | Edit portfolio items                                         |
| DELETE      | `/user/portfolio/technology/:id` | {items}                                                      | 200            | 400          | Delete portfolio items                                       |
|             |                                  |                                                              |                |              |                                                              |



## Links

### Trello

[Link to your trello board](https://trello.com/b/dwTDxbb8/getjob) or picture of your physical board

### Git

The url to your repository and to your deployed project

[Client repository Link](https://github.com/alejandrocolorado/getjob-client)   [Server repository Link](https://github.com/alejandrocolorado/getjob-server)

[Deploy Link](http://heroku.com/)

### Wireframes

The url to your presentation slides

[Balsamiq Link](https://balsamiq.cloud/scuxklk/popvaag)

