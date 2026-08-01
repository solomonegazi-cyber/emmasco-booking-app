import React from "react";

interface Leader {
  name: string;
  role: string;
  bio: string;
  image: string;
}

interface Props {
  leader: Leader;
  onClick: () => void;
}

const LeaderCard: React.FC<Props> = ({ leader, onClick }) => {
  return (
    <div className="leader-card">

      <div className="leader-image-wrapper">
        <img
          src={leader.image}
          alt={leader.name}
          className="leader-image"
        />
      </div>

      <div className="leader-body">

        <h3>{leader.name}</h3>

        <span className="leader-role">
          {leader.role}
        </span>

        <p>
          {leader.bio.length > 120
            ? leader.bio.substring(0, 120) + "..."
            : leader.bio}
        </p>

        <button
          className="leader-button"
          onClick={onClick}
        >
          View Profile →
        </button>

      </div>

    </div>
  );
};

export default LeaderCard;