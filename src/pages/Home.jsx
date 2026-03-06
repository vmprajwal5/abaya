import { Hero } from '../components/Hero';
import { NewArrivals } from '../components/NewArrivals';
import { CategoryShowcase } from '../components/CategoryShowcase';
import { FeaturedCollection } from '../components/FeaturedCollection';
import { NewsletterPopup } from '../components/NewsletterPopup';

function Home() {
    return (
        <div>
            <Hero />
            <CategoryShowcase />
            <NewArrivals />
            <FeaturedCollection />
            <NewsletterPopup />
        </div>
    );
}

export default Home;
