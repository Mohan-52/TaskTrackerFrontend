import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import Header from "../Header";
import { ClipLoader } from "react-spinners";
import "./index.css";

const apiStatus = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  noTasks: "NO_TASKS",
  success: "SUCCESS",
  failure: "FAILURE",
};

const Tasks = () => {
  const [taskList, setTasks] = useState([]);
  const [status, setStatus] = useState(apiStatus.initial);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("Pending");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    const getTasks = async () => {
      setStatus(apiStatus.inProgress); // Set status to in progress before fetching
      const jwtToken = Cookies.get("jwt_token");
      const apiUrl = "https://tasktrackerbackend-x03u.onrender.com/tasks";
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      };

      try {
        const response = await fetch(apiUrl, options);

        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.length === 0) {
          setStatus(apiStatus.noTasks); // No tasks available
          return;
        }

        // Transform API response data
        const updatedData = data.map((eachTask) => ({
          id: eachTask.id,
          createdAt: eachTask.created_at,
          description: eachTask.description,
          dueDate: eachTask.due_date,
          status: eachTask.status,
          title: eachTask.title,
          userId: eachTask.user_id,
        }));

        setTasks(updatedData);
        setStatus(apiStatus.success); // Mark as success
      } catch (err) {
        setStatus(apiStatus.failure); // Mark as failure on error
      }
    };

    getTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentDate = new Date().toLocaleDateString();

    const taskData = {
      id: uuid(),
      title,
      description,
      status: taskStatus,
      dueDate,
      createdAt: currentDate,
    };

    const jwtToken = Cookies.get("jwt_token");
    const apiUrl = "https://tasktrackerbackend-x03u.onrender.com/tasks";

    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    };

    try {
      const response = await fetch(apiUrl, options);

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      setTasks((prevState) => [...prevState, taskData]);
      setTitle("");
      setDescription("");
      setTaskStatus("Pending");
      setDueDate("");
      setStatus(apiStatus.success);
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // Success View - Table Display
  const renderSuccessView = () => (
    <div className="table-con">
      <table className="task-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Created At</th>
            <th>Manage</th>
          </tr>
        </thead>
        <tbody>
          {taskList.map((task) => (
            <tr key={task.id} className="">
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.status}</td>
              <td>{task.dueDate}</td>
              <td>{task.createdAt}</td>
              <td>
                <Link to={`/tasks/${task.id}`} className="view-detail">
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Failure View - Error Message
  const renderFailureView = () => (
    <div className="error-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-dark-theme-img.png"
        alt="failure-img"
        className="failure-img"
      />
      <p className="error-text">Something went wrong! Please try again.</p>
      <button className="retry-btn" onClick={() => window.location.reload()}>
        Retry
      </button>
    </div>
  );

  // No Tasks View
  const renderNoTasksView = () => (
    <div className="no-tasks-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-saved-videos-img.png"
        alt="no-tasks-img"
        className="no-tasks-img"
      />
      <p className="no-tasks-text">
        No tasks available. Create a new task to get started!
      </p>
    </div>
  );

  // Loading View
  const renderLoadingView = () => (
    <div className="loader-container">
      <ClipLoader color="#4fa94d" size={50} />
    </div>
  );

  // Render different views based on API status
  const renderView = () => {
    switch (status) {
      case apiStatus.inProgress:
        return renderLoadingView();
      case apiStatus.success:
        return renderSuccessView();
      case apiStatus.noTasks:
        return renderNoTasksView();
      case apiStatus.failure:
        return renderFailureView();
      default:
        return null;
    }
  };

  return (
    <div>
      <Header />
      <div className="home-con">
        <h1>Add a task</h1>
        <form className="task-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <select
            name="status"
            value={taskStatus}
            onChange={(e) => setTaskStatus(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <input
            type="date"
            name="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
          <button type="submit">Add Task</button>
        </form>
        <h2>Task List</h2>
        {renderView()}
      </div>
    </div>
  );
};

export default Tasks;
