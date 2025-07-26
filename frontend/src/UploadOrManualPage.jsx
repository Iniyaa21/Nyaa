import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './UploadOrManualPage.css';
import { FaPencilAlt, FaTrash, FaCheck } from 'react-icons/fa';


function UploadOrManualPage() {
    const [manualTasks, setManualTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [taskInput, setTaskInput] = useState("");
    const [xpInput, setXpInput] = useState(10);
    const [editIdx, setEditIdx] = useState(null);
    const [editTask, setEditTask] = useState({ text: '', xp: 10 });
    const navigate = useNavigate();

    // Handle PDF upload
    const handlePDF = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setLoading(true);
        const formData = new FormData();
        formData.append("pdf", file);
        const res = await fetch("http://localhost:3001/upload", {
            method: "POST",
            body: formData,
        });
        const { questions } = await res.json();
        setLoading(false);
        navigate("/tasks", { state: { tasks: questions.map(q => ({ text: q, xp: 10 })) } });
    };

    // // Handle manual task input
    // const handleManualChange = (idx, field, value) => {
    //     setManualTasks(tasks =>
    //         tasks.map((t, i) => (i === idx ? { ...t, [field]: value } : t))
    //     );
    // };
    //
    // const addManualTask = () => setManualTasks([...manualTasks, { text: "", xp: 10 }]);

    const handleAddTask = () => {
        if (taskInput.trim()) {
            setManualTasks([...manualTasks, { text: taskInput, xp: xpInput }]);
            setTaskInput("");
            setXpInput(10);
        }
    };

    const handleEditClick = (idx) => {
        setEditIdx(idx);
        setEditTask({ ...manualTasks[idx] });
    };

    // const handleEditChange = (field, value) => {
    //     setEditTask(task => ({ ...task, [field]: value }));
    // };

    const handleEditSave = (idx) => {
        setManualTasks(tasks => tasks.map((t, i) => i === idx ? { ...editTask } : t));
        setEditIdx(null);
    };

    const handleDeleteTask = (idx) => {
        setManualTasks(tasks => tasks.filter((_, i) => i !== idx));
        if (editIdx === idx) setEditIdx(null);
    };

    // Add handler for Next button
    const handleContinue = () => {
        const filtered = manualTasks.filter(t => t.text.trim());
        if (filtered.length) {
            navigate("/tasks", { state: { tasks: filtered } });
        }
    };

    return (
        <div className="upload-page-bg">
            <div className="upload-content">
                <div className="upload-sections-container">
                    <div className="upload-section">
                        <h2>Let Nyaa generate your tasks</h2>
                        <label className="upload-file-label" tabIndex={0}>
                            <span className="upload-file-icon" role="img" aria-label="PDF">📄</span>
                            <span>Click or drag a PDF here to upload</span>
                            <input type="file" accept="application/pdf" onChange={handlePDF} />
                        </label>
                        {loading && <div>Processing PDF...</div>}
                    </div>
                    <div className="upload-section-divider"></div>
                    <div className="upload-section">
                        <h2>(Or) Enter your own tasks</h2>
                        <div className="manual-task-box">
                            <div className="upload-task-row">
                                <input
                                    type="text"
                                    placeholder="Task name"
                                    value={taskInput}
                                    onChange={e => setTaskInput(e.target.value)}
                                    style={{ marginRight: 8 }}
                                />
                                <input
                                    type="number"
                                    placeholder="XP"
                                    value={xpInput}
                                    min={1}
                                    onChange={e => setXpInput(e.target.value)}
                                    style={{ width: 60 }}
                                />
                            </div>
                            <button className="add-task-btn" onClick={handleAddTask} style={{ marginTop: 12, width: '100%' }}>Add Task</button>
                            <div className="manual-task-list">
                                {manualTasks.map((task, idx) => (
                                    <div key={idx} className="manual-task-item-row">
                                        {editIdx === idx ? (
                                            <>
                                                <input
                                                    className="manual-task-edit-input"
                                                    type="text"
                                                    value={editTask.text}
                                                    onChange={e => setEditTask({ ...editTask, text: e.target.value })}
                                                    style={{ flex: 1, marginRight: 8 }}
                                                />
                                                <button className="save-task-btn" onClick={() => handleEditSave(idx)} style={{ marginRight: 4 }}><FaCheck style={{ color: 'green', marginLeft: '5px' }} /></button>
                                                <button className="cancel-task-btn" onClick={() => setEditIdx(null)}>Cancel</button>
                                            </>
                                        ) : (
                                            <>
                                                <span className="manual-task-text">{task.text} (XP: {task.xp})</span>
                                                <button onClick={() => handleEditClick(idx)} className="edit-task-btn"><FaPencilAlt /></button>
                                                <button
                                                    className="delete-task-btn"
                                                    onClick={() => handleDeleteTask(idx)}
                                                    aria-label="Delete task"
                                                >
                                                    X
                                                </button>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button className="continue-btn" onClick={handleContinue} style={{ marginTop: 24 }}>Next</button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UploadOrManualPage;