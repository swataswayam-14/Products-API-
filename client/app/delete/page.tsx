"use client"
import React, { useState } from 'react'

const page = () => {

    const [ID, setID] = useState("")

    function handleChange(e:any,setter:any) {
        setter(e.target.value)
    }
    async function handleSubmit() {
        if(!ID) {
            alert("Please Enter All the fields!");
            return;
        }
        const apiUrl = "http://localhost:9023/api/v1/products"
        try{
            const res = await fetch(apiUrl,{
                method:"DELETE",
            })
            alert("Done.")
        }catch(e:any) {
            console.log(e.message);
        }
    }
  return (
    <div >
        <center>
            <h1>Delete a Product</h1><br /><br />
            <input onChange={(e)=>handleChange(e,setID)} value={ID} type="text" placeholder='Enter _id of Product'/><br /><br />
            <button onClick={handleSubmit} style={{backgroundColor:"green",width:200}}>Delete :(</button>
        </center>
    </div>
  )
}

export default page
