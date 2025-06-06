"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Post from "../components/Post";
import styles from "../styles/Post.module.css";

const SinglePost = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // Si usas query params, o ajusta según la ruta

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${baseUrl}/api/posts/${id}`);
        setPost(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar la publicación:", error);
        setError(
          "No se pudo cargar la publicación. Puede que haya sido eliminada o no tengas permiso para verla."
        );
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, baseUrl]);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return <div className="loading">Cargando publicación...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">{error}</div>
        <button className="back-button" onClick={handleBack}>
          Volver
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="error-container">
        <div className="error">Publicación no encontrada</div>
        <button className="back-button" onClick={handleBack}>
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className={styles["single-post-container"]}>
      <div className={styles["single-post-header"]}>
        <button className="back-button" onClick={handleBack}>
          ← Volver
        </button>
        <h1>Publicación</h1>
      </div>
      <Post post={post} />
    </div>
  );
};

export default SinglePost;
