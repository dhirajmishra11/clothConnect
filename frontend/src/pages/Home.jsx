import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/landing");
  }, [navigate]);

  return null; // No UI needed as it redirects immediately
}

export default Home;
