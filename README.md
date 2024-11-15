# Introduction
This repository contains the frontend code for the **HDM Todo List** project. The goal of this project is to implement a todo list using React for the frontend and NestJS for the backend. Tasks are stored in an external MySQL database, which communicates with the backend through the **Prisma ORM**.

# Implementation Details
## Task Fetching
The `handleFetchTasks` function calls `api.get('/tasks')` to retrieve all tasks from the backend. The tasks are then stored in the tasks state using `setTasks`, which renders them on the UI.

## Task Creation
The `handleAdd` function uses a **POST** request to the `/tasks` endpoint to create a new task with a default name. If successful, `handleFetchTasks` is called to update the task list. A success or error toast notification is shown to inform the user using the `useUiToast` already implemented.

> A `FieldText` could be interresting to implement to allow the user of choosing the task name before creating it in the database.

## Task Deletion
The `handleDelete` function sends a **DELETE** request to `/tasks/:id`, where id is the task’s identifier. The UI updates through `handleFetchTasks` after a successful response, and a success toast is displayed.

## Task Editing
Task editing is handled by two functions: `handleChange` and `handleSave`.
+ `handleChange` updates the name field of the task in the tasks state and sets an entry in modifiedTasks to mark the task as modified if the name differs from the original.
+ `handleSave` sends a **PATCH** request to the backend with updated task data, calling handleFetchTasks and resetting modifiedTasks on success.

# Choices and Decisions
## Notification
Success and error messages provide user feedback, improving usability and interaction clarity, enhancing the user experience. So, I decided to use the `useUiToast` class already coded and display a toast regarding the state of the action gived by the backend in response.

## Bonus
I decided to add a progress bar, which required adding a new component in the UI `LinearProgress`. I updated the UI to implement the progress bar as better as possible. I added a new method `handleProgressChange` to handle when the user desired to modifing the progress value, and update the UI to allow to save the modification.

## Sate management
Like the `tasks`, I decide to manage the state of `modifiedTasks` within the component itself, which keeps the structure straightforward.

# Challenges and Solutions
## Sate management
I experimented with several approaches to enable the save button only when a task name was modified. Finally, I decided to use an additional state, `modifiedTasks`, to track which tasks are can be saved.

Author: Antoine