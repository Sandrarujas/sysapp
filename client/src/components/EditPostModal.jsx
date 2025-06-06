"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import styles from "../styles/EditPostModal.module.css"

const EditPostModal = ({ isOpen, onClose, post, onPostUpdate }) => {
  const [content, setContent] = useState("")
  const [image, setImage] = useState(null)
  const [previewImage, setPreviewImage] = useState("")
  const [keepExistingImage, setKeepExistingImage] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (post) {
      setContent(post.content || "")
      if (post.image) {
        setPreviewImage(getImageUrl(post.image))
      } else {
        setPreviewImage("")
      }
      setKeepExistingImage(!!post.image)
    }
  }, [post])

  // Función para construir la URL completa de la imagen
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null

    // Si la ruta ya es una URL completa, devolverla tal cual
    if (imagePath.startsWith("http")) return imagePath

    // Construir la URL completa
    return `http://localhost:5000${imagePath}`
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setPreviewImage(URL.createObjectURL(file))
      setKeepExistingImage(false)
    }
  }

  const handleRemoveImage = () => {
    setImage(null)
    setPreviewImage("")
    setKeepExistingImage(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!content && !keepExistingImage && !image) {
      setError("La publicación debe tener contenido o imagen")
      setLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append("content", content)

      if (image) {
        formData.append("image", image)
      } else if (!keepExistingImage && post.image) {
        formData.append("image", "")
      }

      const res = await axios.put(`http://localhost:5000/api/posts/${post.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      onPostUpdate({
        ...post,
        content: res.data.content,
        image: res.data.image,
      })

      onClose()
    } catch (error) {
      console.error("Error al actualizar publicación:", error)
      setError(error.response?.data?.message || "Error al actualizar la publicación")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles["modal-overlay"]}>
      <div className={styles["edit-post-modal"]}>
        <div className={styles["modal-header"]}>
          <h2>Editar Publicación</h2>
          <button className={styles["close-button"]} onClick={onClose}>
            &times;
          </button>
        </div>

        {error && <div className={styles["error-message"]}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles["form-group"]}>
            <label>Contenido</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="¿Qué estás pensando?"
              rows={4}
            ></textarea>
          </div>

          <div className={styles["form-group"]}>
            <label>Imagen</label>
            {previewImage ? (
              <div className={styles["image-preview-container"]}>
                <img
                  src={previewImage || "/placeholder.svg"}
                  alt="Vista previa"
                  className={styles["image-preview"]}
                />
                <button
                  type="button"
                  className={styles["remove-image-button"]}
                  onClick={handleRemoveImage}
                >
                  Eliminar imagen
                </button>
              </div>
            ) : (
              <input type="file" accept="image/*" onChange={handleImageChange} />
            )}
          </div>

          <div className={styles["form-actions"]}>
            <button
              type="button"
              className={styles["cancel-button"]}
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles["save-button"]}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditPostModal
