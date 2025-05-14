// components/SkeletonPropertyCard.jsx
import "../../styles/SkeletonPropertyCard.css"
const SkeletonPropertyCard = () => {
    return (
        <div className="property-card skeleton">
            <div className="property-image skeleton-box" />
            <div className="property-details">
                <div className="skeleton-line short" />
                <div className="skeleton-line" />
                <div className="skeleton-line price" />
            </div>
        </div>
    );
};

export default SkeletonPropertyCard;
