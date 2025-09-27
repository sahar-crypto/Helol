import "../css/Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-column">
                <h3 className="logo-title">
                    <img src="/light_pen_bulb.png" alt="logo" className="logo" />
                    منصة حلول
                </h3>
                <p>منصة لتقديم الشكاوى والمقترحات<br/>للجهات المعتمدة في جمهورية مصر العربية</p>
            </div>

            <div className="footer-column">
                <h4>روابط سريعة</h4>
                <ul>
                    <li><a href="/">الرئيسية</a></li>
                    <li><a href="/complaint">تقديم شكوى</a></li>
                    <li><a href="/follow-complain">تتبع شكوى</a></li>
                    <li><a href="/FAQ">الأسئلة الشائعة</a></li>
                </ul>
            </div>

            <div className="footer-column">
                <h4>الدعم</h4>
                <ul>
                    <li><a href="/help">مركز المساعدة</a></li>
                    <li><a href="/terms-and-conditions">الشروط والأحكام</a></li>
                    <li><a href="/privacy-policy">سياسة الخصوصية</a></li>
                </ul>
            </div>

            <div className="footer-column">
                <h4>تواصل معنا</h4>
                <p>
                    <img src="/call.png" alt="Call Icon" className="phone-icon" />
                    01234
                </p>
                <p>
                    <img src="/mail.png" alt="Email Icon" className="email-icon" />
                    Solution@gmail.com
                </p>
            </div>
        </footer>
    );
}

export default Footer;
