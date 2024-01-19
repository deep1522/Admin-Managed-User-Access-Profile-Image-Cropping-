import React, { useContext, useEffect, } from 'react';
import { useNavigate } from 'react-router-dom';
import PhotoContext from '../context/photos/PhotoContext';
import "../style.css";

const Photo = (props) => {
    const context=useContext(PhotoContext)
    let navigate=useNavigate
    const{image,hiddenFileInput,handleClick, handleImageChange,handleUploadButtonClick,getPhotos}=context;
    useEffect(() => {
        if(localStorage.getItem('token')){
            getPhotos()
        }
        else{
            navigate('/login')
        }
        // eslint-disable-next-line
    }, [])
    return (
    <div className="image-upload-container">
        <div className="box-decoration">
        <label htmlFor="image-upload-input" className="image-upload-label">
            {image ? image.name : "Choose a profile picture"}
        </label>
        <div onClick={handleClick} style={{ cursor: "pointer" }}>
            {image ? (
            <img src={URL.createObjectURL(image)} alt="upload image" className="img-display-after" />
            ) : (
            <img src="./photo.png" alt="upload image" className="img-display-before" />
            )}

            <input
            id="image-upload-input"
            type="file"
            onChange={handleUploadButtonClick}
            ref={hiddenFileInput}
            style={{ display: "none" }}
            />
        </div>

        <button
            className="image-upload-button"
            onClick={handleImageChange}
        >
            Upload
        </button>
        </div>
    </div>
)
}

export default Photo
