import Hero from '../components/Hero.tsx'
import Features from '../components/Features.tsx'
import Callout from '../components/Callout.tsx'
import Footer from '../components/Footer.tsx'

function Home(){
    return (
        <div>
            <Hero/>
            <Features/>
            <Callout/>
            <Footer/>
        </div>
    );
}

export default Home;