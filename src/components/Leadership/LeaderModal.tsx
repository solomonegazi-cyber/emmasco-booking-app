import React from "react";

interface Leader {
  name: string;
  role: string;
  bio: string;
  image: string;
}

interface Props {
  leader: Leader;
  onClose: () => void;
}

const LeaderModal: React.FC<Props> = ({ leader, onClose }) => {
  return (
    <div className="leader-modal-overlay" onClick={onClose}>

      <div
        className="leader-modal"
        onClick={(e) => e.stopPropagation()}
      >

        <button
          className="modal-close"
          onClick={onClose}
        >
          ✕
        </button>

        <img
          src={leader.image}
          alt={leader.name}
          className="modal-image"
        />

        <h2>{leader.name}</h2>

        <h4>{leader.role}</h4>

        <div className="modal-divider"></div>

        <p>{leader.bio}</p>

        <div className="modal-footer">

          <span className="leader-badge">
            Executive Leadership
          </span>

          <span className="leader-badge">
            Emmasco Reinigungsteam
          </span>

        </div>

      </div>

    </div>
  );
};

export default LeaderModal;