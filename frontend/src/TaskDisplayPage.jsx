import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./TaskDisplayPage.css";

function TaskDisplayPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const initialTasks = location.state?.tasks || [];
    const [tasks, setTasks] = useState(
        initialTasks.map(t => ({ ...t, completed: false }))
    );

    const handleComplete = idx => {
        setTasks(ts => {
            const updated = ts.map((t, i) =>
                i === idx ? { ...t, completed: true } : t
            );
            // Move completed to bottom
            updated.sort((a, b) => a.completed - b.completed);
            return updated;
        });
    };

    const handleXPChange = (idx, value) => {
        setTasks(ts =>
            ts.map((t, i) => (i === idx ? { ...t, xp: Number(value) } : t))
        );
    };

    const totalXP = tasks.filter(t => t.completed).reduce((sum, t) => sum + (Number(t.xp) || 0), 0);

    if (!tasks.length) {
        return (
            <div style={{ textAlign: "center", marginTop: 40 }}>
                <div>No tasks found.</div>
                <button onClick={() => navigate("/")}>Back to Start</button>
            </div>
        );
    }

    return (
        <div className="task-display-bg">
            <div className="task-display-container">
                <h2>Tasks / Questions</h2>
                <div className="total-xp">Total XP: {totalXP}</div>
                {tasks.map((task, idx) => (
                    <div
                        key={idx}
                        className={`task-item-row${task.completed ? " completed" : ""}`}
                    >
                        <div className="task-main">
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleComplete(idx)}
                            disabled={task.completed}
                            className="task-checkbox"
                        />
                        <span className="task-text">{task.text}</span>
                        </div>
                        <input
                            type="number"
                            min={1}
                            value={task.xp}
                            onChange={e => handleXPChange(idx, e.target.value)}
                            className="task-xp-input"
                            disabled={task.completed}
                        />
                        <span className="task-xp-label">XP</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TaskDisplayPage;
