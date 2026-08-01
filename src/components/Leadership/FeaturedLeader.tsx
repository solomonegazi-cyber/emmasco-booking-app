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

const FeaturedLeader: React.FC<Props> = ({ leader }) => {
  return (
    <div style={{ padding: 30, background: "#fff", color: "#000" }}>
      <h1>{leader.name}</h1>
      <h2>{leader.role}</h2>
      <p>{leader.bio}</p>

      <img
        src={leader.image}
        alt={leader.name}
        style={{
          width: 250,
          borderRadius: 20
        }}
      />
    </div>
  );
};

export default FeaturedLeader;