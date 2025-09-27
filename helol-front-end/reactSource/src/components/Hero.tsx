import "../css/Hero.css";

function Hero(){
    return (
        <section className="hero">
          <div className="hero-content">
            <div className="hero-image">
              <img src="/egypt-map.png" alt="Egypt Map with Flag" />
            </div>
            <div className="hero-text">
              <h2>
                منصتك الذكية لتقديم <br />
                <span>الشكاوى الحكومية</span>
              </h2>
              <p>نظام متطور وآمن لتقديم شكاواكم بسهولة</p>
              <div className="hero-buttons">
                  <a href="#" className="btn">
                      <img src="/complain-create.png" alt="Complai Craete Icon" className="btn-icon"/>
                      قدم الشكوى
                  </a>
                  <a href="#" className="btn">
                      <img src="/complain-followup.png" alt="Complain Followup Icon" className="btn-icon"/>
                      تتبع الشكوى
                  </a>
              </div>
            </div>
          </div>
        </section>
    )
}

export default Hero;