import React from "react";
import { useLanguage } from "../../LanguageContext";
import FeaturedLeader from "./FeaturedLeader";

export default function LeadershipSection() {
  const { teamMembers } = useLanguage();

  return (
    <FeaturedLeader
      leader={teamMembers[0]}
      onClick={() => {}}
    />
  );
}