import React, { useRef, useState, } from "react";

import PhotoContext from "./PhotoContext";

const PhotoState=(props)=> {
        const [image, setImage] = useState(null);
        const hiddenFileInput = useRef(null);

        const handleImageChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = Math.max(img.width, img.height);
        canvas.width = maxSize;
        canvas.height = maxSize;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
            img,
            (maxSize - img.width) / 2,
            (maxSize - img.height) / 2
        );
        canvas.toBlob(
            (blob) => {
            const file = new File([blob], {
                type: "image/png",
                lastModified: Date.now(),
            });

            console.log(file);
            setImage(file);
            },
            "image/jpeg",
            0.8
        );
        };
    };
    };

    const handleUploadButtonClick = (file) => {
    var myHeaders = new Headers();
    const token = localStorage.getItem('token');
    myHeaders.append("Authorization", `Bearer ${token}`);

    var formdata = new FormData();
    formdata.append("file", file);

    var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
    };
    const getPhotos=async()=>{
        const response=await fetch("localhost:5000/api/photo/fecthallphotos",requestOptions,{
            method:'GET',
            headers:{
                'content-type':'application/json',
                "authToken":localStorage.getItem
            }
        })
        const json=await response.json()
        setImage(json)
        .then((response) => response.text())
        .then((result) => {
        console.log(JSON.parse(result));
        const profileurl = JSON.parse(result);
        setImage(profileurl.img_url);
        })
        .catch((error) => console.log("error", error));
    };
    
    const addPhoto=async(file)=>{
        const response=await fetch("localhost:5000/api/photo/uploadImage",{
            method:'POST',
            headers:{
                'content-Type':'application/json',
                "authToken":localStorage.getItem('token')
            },
            body:JSON.stringify({file})
        })
        const photo=await response.json();
        setImage(photo.concat(file))
    }
    const handleClick = (event) => {
    hiddenFileInput.current.click();
    };

    return (
        <PhotoContext.Provider value={{ image,hiddenFileInput,addPhoto,handleClick, handleImageChange,handleUploadButtonClick,getPhotos }}>
    {props.children}
    </PhotoContext.Provider>
    
    )
}
}
export default PhotoState;