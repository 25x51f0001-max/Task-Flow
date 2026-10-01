import { useState } from "react";
import {
  IconCheckCircle,
  IconCircle,
  IconTrash,
  IconEdit,
  IconCalendar,
  IconClose,
  IconCheck,
} from "./Icons";

const TaskItem = ({ task, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState("");
  const [editPriority, setEditPriority] = useState("medium");

  // Parse priority metadata from description if present
  const parsePriorityAndDesc = (rawDesc = "") => {
    const match = rawDesc.match(/\[priority:(low|medium|high)\]/i);
    let priority = "medium";
    let cleanDesc = rawDesc;
    if (match) {
      priority = match[1].toLowerCase();
      cleanDesc = rawDesc.replace(match[0], "").trim();
    }
    return { priority, cleanDesc };
  };

  const { priority, cleanDesc } = parsePriorityAndDesc(task.description);

  const startEditing = () => {
    setEditTitle(task.title);
    setEditDesc(cleanDesc);
    setEditPriority(priority);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) return;
    const finalDescription = `[priority:${editPriority}] ${editDesc.trim()}`.trim();
    if (onUpdate) {
      await onUpdate(task._id, {
        title: editTitle.trim(),
        description: finalDescription,
      });
    }
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={`task-item-card ${task.completed ? "completed" : ""}`}>
      {/* Checkbox toggle */}
      <button
        type="button"
        className={`task-checkbox-btn ${task.completed ? "checked" : ""}`}
        onClick={() => onToggle(task)}
        aria-label={task.completed ? "Mark as incomplete" : "Mark as completed"}
        title={task.completed ? "Mark as incomplete" : "Mark as completed"}
      >
        {task.completed ? <IconCheckCircle size={22} /> : <IconCircle size={22} />}
      </button>

      {/* Task Content */}
      <div className="task-content">
        {isEditing ? (
          <div className="task-edit-box">
            <input
              className="custom-input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Task title"
              style={{ marginBottom: 8, height: 38 }}
            />
            <textarea
              className="custom-textarea"
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              placeholder="Description (optional)"
              rows={2}
              style={{ marginBottom: 8 }}
            />
            <div className="priority-options" style={{ marginBottom: 10 }}>
              <button
                type="button"
                className={`priority-btn low ${editPriority === "low" ? "active" : ""}`}
                onClick={() => setEditPriority("low")}
              >
                <span className="priority-dot low" /> Low
              </button>
              <button
                type="button"
                className={`priority-btn medium ${editPriority === "medium" ? "active" : ""}`}
                onClick={() => setEditPriority("medium")}
              >
                <span className="priority-dot medium" /> Med
              </button>
              <button
                type="button"
                className={`priority-btn high ${editPriority === "high" ? "active" : ""}`}
                onClick={() => setEditPriority("high")}
              >
                <span className="priority-dot high" /> High
              </button>
            </div>
            <div className="task-edit-actions">
              <button type="button" className="btn-secondary" onClick={handleSaveEdit}>
                <IconCheck size={14} /> Save
              </button>
              <button type="button" className="btn-ghost" onClick={cancelEditing}>
                <IconClose size={14} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="task-title-text">{task.title}</div>
            {cleanDesc && <div className="task-desc-text">{cleanDesc}</div>}

            <div className="task-meta-row">
              {/* Priority Tag */}
              <span className={`priority-tag ${priority}`}>
                <span className={`priority-dot ${priority}`} />
                <span>{priority}</span>
              </span>

              {/* Created Date */}
              {task.createdAt && (
                <span className="task-date-tag">
                  <IconCalendar size={13} />
                  <span>{formatDate(task.createdAt)}</span>
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Task Actions */}
      {!isEditing && (
        <div className="task-actions">
          <button
            type="button"
            className="task-action-btn"
            onClick={startEditing}
            title="Edit task"
            aria-label="Edit task"
          >
            <IconEdit size={15} />
          </button>
          <button
            type="button"
            className="task-action-btn delete"
            onClick={() => onDelete(task._id)}
            title="Delete task"
            aria-label="Delete task"
          >
            <IconTrash size={15} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskItem;