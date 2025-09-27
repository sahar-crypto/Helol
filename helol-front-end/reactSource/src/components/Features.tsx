import "../css/Features.css";

function Features() {
    return (
        <div className="features-section">
            <h2 className="section-title">مميزات النظام</h2>
            <div className="features-container">
                <div className="feature-box">
                    <div className="icon-circle">
                        <img src="/add_task.png" alt="Add Task Icon"/>
                    </div>
                    <p className="feature-text">تتبع مستمر</p>
                </div>
                <div className="feature-box">
                    <div className="icon-circle">
                        <img src="/admin_panel_settings.png" alt="Admin Panel Settings Icon"/>
                    </div>
                    <p className="feature-text">حماية وأمان</p>
                </div>
                <div className="feature-box">
                    <div className="icon-circle">
                        <img src="/alarm_on.png" alt="Alarm Icon"/>
                    </div>
                    <p className="feature-text">سرعة في الاستجابة</p>
                </div>
            </div>
        </div>
    )
}

export default Features;