import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const API = 'http://localhost:5000/api';

function Rewards() {
  const { user } = useUser();
  const [rewardsData, setRewardsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetch(`${API}/users/${user.id}/rewards`)
      .then((res) => res.json())
      .then((data) => {
        setRewardsData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const handleRedeem = async () => {
    const res = await fetch(`${API}/users/${user.id}/rewards/redeem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ points: 100 })
    });

    if (res.ok) {
      const data = await res.json();
      setRewardsData((prev) => ({
        ...prev,
        total_points: data.remaining,
        history: [
          {
            id: Date.now(),
            points: 100,
            type: 'redeemed',
            description: '£10 off voucher',
            created_at: new Date().toISOString()
          },
          ...prev.history
        ]
      }));
    }
  };

  if (!user) {
    return (
      <div className="empty-state">
        <div className="icon">🔒</div>
        <h2>Log in</h2>
        <p>You need an account to see rewards</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }

  if (loading) return <div className="loading">Loading...</div>;

  const pts = rewardsData?.total_points || 0;
  // 10 points = £1 value, so points/10 = £
  const poundsValue = (pts / 10).toFixed(2);

  return (
    <div>
      <div className="rewards-header">
        <h1>Rewards</h1>
        <div className="rewards-points">{pts}</div>
        <p className="rewards-value">
          Worth about £{poundsValue} if you redeem (100 points = £10 off)
        </p>
        <p style={{ fontSize: '0.9rem', color: '#666', marginTop: 8 }}>
          You get 1 point per £1 spent. No card payment on this site — points are for vouchers only.
        </p>
        {pts >= 100 && (
          <button
            type="button"
            onClick={handleRedeem}
            style={{
              marginTop: 16,
              background: '#333',
              color: '#ffd700',
              padding: '12px 24px',
              borderRadius: 8,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Use 100 points for £10 off
          </button>
        )}
      </div>

      <h2 className="section-title">History</h2>

      {rewardsData?.history?.length === 0 ? (
        <div className="empty-state">
          <div className="icon">⭐</div>
          <h2>Nothing yet</h2>
          <p>1 point per £1 you spend on an order</p>
          <Link to="/products">Browse products</Link>
        </div>
      ) : (
        rewardsData?.history?.map((item) => (
          <div key={item.id} className="reward-history-item">
            <div>
              <strong>{item.description}</strong>
              <p style={{ fontSize: '0.8rem', color: '#888', marginTop: 2 }}>
                {new Date(item.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>
            <span className={item.type === 'earned' ? 'points-earned' : 'points-redeemed'}>
              {item.type === 'earned' ? '+' : '-'}
              {item.points} pts
            </span>
          </div>
        ))
      )}
    </div>
  );
}

export default Rewards;
