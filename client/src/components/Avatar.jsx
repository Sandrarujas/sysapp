"use client";

import { useState } from "react";
import styles from "./Avatar.module.css";

const Avatar = ({ src, username, size = 40, version = "" }) => {
  const [error, setError] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  const getImageUrl = (imagePath) => {
    if (!imagePath || error) return `/placeholder.svg?height=${size}&width=${size}`;

    const fullUrl = imagePath.startsWith("http")
      ? imagePath
      : `${baseUrl}${imagePath}`;

    return version ? `${fullUrl}?v=${version}` : fullUrl;
  };

  return (
    <img
      src={getImageUrl(src)}
      alt={username || "Usuario"}
      className={styles.avatarImage}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        objectFit: "cover",
      }}
      onError={() => setError(true)}
    />
  );
};

export default Avatar;
