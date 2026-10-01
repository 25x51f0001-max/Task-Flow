import { useState } from "react";
import { IconPlus, IconSparkles } from "./Icons";

const TaskForm = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);

    // Format description with priority metadata tag cleanly
    let finalDescription = description.trim();
    if (priority) {
      finalDescription = `[priority:${priority}] ${finalDescription}`.trim();
    }

    try {
      await onAdd({
        title: title.trim(),
        description: finalDescription,
      });
      setTitle("");
      setDescription("");
      setPriority("medium");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && e.target.tagName !== "TEXTAREA") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="card-task-form">
      <div className="task-form-header">
        <div className="hero-feature-icon" style={{ width: 28, height: 28 }}>
          <IconPlus size={16} />
        </div>
        <h3 className="task-form-title">Create New Task</h3>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="task-title-input">
            Task Title <span style={{ color: "var(--accent-rose)" }}>*</span>
          </label>
          <input
            id="task-title-input"
            className="custom-input"
            style={{ paddingLeft: "14px" }}
            placeholder="e.g., Finalize project report..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            required
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="task-desc-input">
            Notes & Details <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(optional)</span>
          </label>
          <textarea
            id="task-desc-input"
            className="custom-textarea"
            placeholder="Add additional context, bullet points, or checklist..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="priority-selector">
          <label className="priority-label">Priority Level</label>
          <div className="priority-options">
            <button
              type="button"
              className={`priority-btn low ${priority === "low" ? "active" : ""}`}
              onClick={() => setPriority("low")}
            >
              <span className="priority-dot low" />
              <span>Low</span>
            </button>
            <button
              type="button"
              className={`priority-btn medium ${priority === "medium" ? "active" : ""}`}
              onClick={() => setPriority("medium")}
            >
              <span className="priority-dot medium" />
              <span>Medium</span>
            </button>
            <button
              type="button"
              className={`priority-btn high ${priority === "high" ? "active" : ""}`}
              onClick={() => setPriority("high")}
            >
              <span className="priority-dot high" />
              <span>High</span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={!title.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <div className="spinner" />
          ) : (
            <>
              <IconSparkles size={16} />
              <span>Add to Workspace</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;