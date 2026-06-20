function StatsCard({ title, count }) {
    return (
        <div className="stats-card">
            <h3>{title}</h3>
            <p>{count}</p>
        </div>
    );
}

export default StatsCard;