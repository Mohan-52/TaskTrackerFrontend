import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../Header";
import Cookies from "js-cookie";
import { ClipLoader } from "react-spinners";
import "./index.css";

const apiStatus = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(apiStatus.initial);

  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({});

  const [markAsRead, setMarkAsRead] = useState(false);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      setStatus(apiStatus.inProgress);
      const jwtToken = Cookies.get("jwt_token");

      if (!jwtToken) {
        setError("Unauthorized: No JWT Token found.");
        return;
      }

      try {
        const response = await fetch(
          `https://tasktrackerbackend-x03u.onrender.com/tasks/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch task details.");
        }

        const data = await response.json();
        setTask(data);
        setEditedTask(data);
        setStatus(apiStatus.success);
      } catch (error) {
        setStatus(apiStatus.failure);
        setError(error.message);
      }
    };

    fetchTaskDetails();
  }, [id]);

  if (error) return <p className="error-message">{error}</p>;

  const handleChange = (e) => {
    setEditedTask({
      ...editedTask,
      [e.target.name]: e.target.value,
    });
  };

  // Function to update task (PUT request)
  const handleSave = async () => {
    const jwtToken = Cookies.get("jwt_token");

    try {
      const response = await fetch(
        `https://tasktrackerbackend-x03u.onrender.com/tasks/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedTask),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update task.");
      }

      setTask(editedTask);
      setIsEditing(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async () => {
    const jwtToken = Cookies.get("jwt_token");

    try {
      const response = await fetch(
        `https://tasktrackerbackend-x03u.onrender.com/tasks/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete task.");
      }

      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  if (markAsRead) {
    setMarkAsRead(false);
    handleSave();
  }

  const markAsComplete = () => {
    setEditedTask({
      ...editedTask,
      status: "Completed",
    });

    setMarkAsRead(true);
  };

  const renderSuccessView = () => (
    <div className="task-details-container">
      <h1 className="task-details-heading">Task Details</h1>
      <div className="buttons-container">
        {isEditing ? (
          <button className="btn save-btn" onClick={handleSave}>
            Save
          </button>
        ) : (
          <button className="btn edit-btn" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        )}

        <button className="btn save-btn" onClick={markAsComplete}>
          Mark as complete
        </button>

        <button className="btn delete-btn" onClick={handleDelete}>
          Delete
        </button>
      </div>

      <p>
        <strong>ID:</strong> {task.id}
      </p>
      <p>
        <strong>Title:</strong>{" "}
        {isEditing ? (
          <input
            className="input-field"
            type="text"
            name="title"
            value={editedTask.title}
            onChange={handleChange}
          />
        ) : (
          task.title
        )}
      </p>

      <p>
        <strong>Description:</strong>{" "}
        {isEditing ? (
          <textarea
            className="textarea-field"
            name="description"
            value={editedTask.description}
            onChange={handleChange}
          />
        ) : (
          task.description
        )}
      </p>

      <p>
        <strong>Status:</strong>{" "}
        {isEditing ? (
          <select
            className="select-field"
            name="status"
            value={editedTask.status}
            onChange={handleChange}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        ) : (
          task.status
        )}
      </p>

      <p>
        <strong>Due Date:</strong>{" "}
        {isEditing ? (
          <input
            className="input-field"
            type="date"
            name="due_date"
            value={editedTask.due_date}
            onChange={handleChange}
          />
        ) : (
          task.due_date
        )}
      </p>

      <p>
        <strong>Created At:</strong> {task.created_at}
      </p>
    </div>
  );

  const renderLoadingView = () => (
    <div className="loader-container">
      <ClipLoader color="#4fa94d" size={50} />
    </div>
  );

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

  const renderView = () => {
    switch (status) {
      case apiStatus.inProgress:
        return renderLoadingView();
      case apiStatus.success:
        return renderSuccessView();
      case apiStatus.failure:
        return renderFailureView();
      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      {renderView()}
    </>
  );
};

export default TaskDetails;
