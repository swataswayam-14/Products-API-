"use client"
import Image from 'next/image'
import { useEffect, useState } from 'react'
"./globals.css"

export default function Home() {
  const [products,setProducts] = useState([]);
  useEffect(()=>{
    async function fetchProds() {
      try {
      const apiUrl="http://localhost:9023/api/v1/products"
      let res = await fetch(apiUrl,{
        method:"GET",
      })
      const data = await res.json();
      setProducts(data.products);
      console.log("Rcvd ::",data);
    }catch(e:any) {
      console.error(e.message);
    }
  }
    fetchProds();
  },[])

  interface Prod {
    name :string,
    company:string,
    price: number,
    _id:string
  }

  return (
    <center>
      <h1 style={{fontSize:"30px"}}>Products API with NextJS 13 Client</h1>
      <a href="/update">Update a Product</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <a href="/post">Post a Product</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <a href="/delete">Delete a Product</a>
      <br /><br />
    <div style={{width:"60%"}}>
      {
        products.map((product :Prod,index:number)=>(
          <div className='eachprod' key={index} style={{borderColor:"white",borderWidth:"2px",margin:"3px"}}>
            <br />
            <h1>{index+1}</h1>
            <h1>Name :{product.name}</h1>
            <h1>Company:{product.company}</h1>
            <h1>Price:Rs.{product.price}</h1>
            <h1>_id:{product._id}</h1>

            <br />
          </div>
        ))
      }
    </div>
    </center>
  )
}

/**
 * 
company
: 
"liddy"
createdAt
: 
"2023-10-18T19:55:25.245Z"
featured
: 
true
name
: 
"albany sectional"
price
: 
109
rating
: 
5
__v
: 
0
_id
: 
"65303830971dc373
 */