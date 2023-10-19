"use client"
import React, { useState } from 'react'

const page = () => {

    const [name, setName] = useState("")
    const [price, setPrice] = useState()
    const [company, setCompany] = useState("")
    const [rating, setRating] = useState("")

    function handleChange(e:any,setter:any) {
        setter(e.target.value)
    }
    async function handleSubmit() {
        if(!name ||! price || ! company || !rating) {
            alert("Please Enter All the fields!");
            return;
        }
        const apiUrl = "http://localhost:9023/api/v1/products"
        try{
            let formData = new FormData();
            formData.append("name",name);
            formData.append("price",price);
            formData.append("company",company);
            formData.append("rating",rating);
            
            const res = await fetch(apiUrl,{
                method:"POST",
                body:formData,
            })
            alert("Done.")
        }catch(e:any) {
            console.log(e.message);
        }
    }
  return (
    <div >
        <center>
            <h1>Post a Product</h1><br /><br />
            <input onChange={(e)=>handleChange(e,setName)} value={name} type="text" placeholder='Name of Product'/><br /><br />
            <input onChange={(e)=>handleChange(e,setPrice)} value={price} type="number" placeholder='Price of Product'/><br /><br />
            <input onChange={(e)=>handleChange(e,setCompany)} value={company} type="text" placeholder='Company of Product'/><br /><br />
            <input onChange={(e)=>handleChange(e,setRating)} value={rating} type="number" placeholder='Rating of Product'/><br /><br />
            <button onClick={handleSubmit} style={{backgroundColor:"green",width:200}}>Upload</button>
        </center>
    </div>
  )
}

export default page
