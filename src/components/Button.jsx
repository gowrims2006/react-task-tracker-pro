function Button({ label, onClick, variant = "primary", type = "button" }) {
    const baseStyle = {
        padding: '10px 24px',
        border: 'none',
        borderRadius: '6px',
        fontWeight: '600',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    const variants = {
        primary: {
            background: '#3b82f6',
            color: 'white'
        },
        danger: {
            background: '#ef4444',
            color: 'white'
        },
        success: {
            background: '#10b981',
            color: 'white'
        }
    };

    const hoverStyle = {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
    };

    return (
        <button
            type={type}
            style={{ ...baseStyle, ...variants[variant] }}
            onClick={onClick}
            onMouseEnter={(e) => {
                Object.assign(e.target.style, hoverStyle);
            }}
            onMouseLeave={(e) => {
                Object.assign(e.target.style, baseStyle, variants[variant]);
            }}
        >
            {label}
        </button>
    );
}

export default Button;