import { useNavigate } from "react-router-dom";
import './TitlePage.css';
function TitlePage() {
    const navigate = useNavigate();

    return (
        <div style={{ position: "relative", minHeight: "100vh", minWidth: "100vw" }}>
            <div className="title-page-bg" />
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                position: "relative",
                zIndex: 1
            }}>
                <h1 className="title-page-title">NYAA</h1>
                <button onClick={() => navigate("/input")} className="start-btn">Begin The Quest</button>
                <h2 className="title-page-subheading">Turn your notes into quests. Level up as you study.
                </h2>

            </div>
        </div>
    );
}

export default TitlePage;
