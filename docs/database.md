### user-table

| attribute  | type | function       |
| ---------- | ---- | -------------- |
| first_name | Text |                |
| last_name  | Text |                |
| username   | Text | Primary key    |
| password   | Text | Hashed         |
| email      | Text | unique         |
| phone      | Text | unique         |
| birth_year | Text |                |
| gender     | Text |                |
| role       | json | {public: true} |
| verified   | bool |                |
### event-table

| attribute      | type | function               |
| -------------- | ---- | ---------------------- |
| event_id       | Int  | Primary key            |
| title          | Text |                        |
| description    | Text |                        |
| category       | Text |                        |
| status         | Text |                        |
| start_time     | Date |                        |
| end_time       | Date |                        |
| venue          | Text |                        |
| address        | Text |                        |
| organizer_type | Text | custom/group/user      |
| organizers     | JSON | {name:"", username:""} |
| guests         | JSON | {name:"", username:""} |
| capacity       | int  |                        |
| follower_count | int  |                        |
| created_at     | Date |                        |
| updated_at     | Date |                        |
| img_url        | Text |                        |
### user-event-table

| attribute | type | function    |
| --------- | ---- | ----------- |
| username  | Text | Foreign key |
| event_id  | int  | Foreign key |
### group-table

| attribute     | type | function    |
| ------------- | ---- | ----------- |
| group_id      | int  | Primary key |
| group_name    | Text |             |
| total_members | int  |             |
| total_events  | int  |             |
### group-event-table

| attribute | type | function    |
| --------- | ---- | ----------- |
| group_id  | int  | Foreign key |
| event_id  | int  | Foreign key |
