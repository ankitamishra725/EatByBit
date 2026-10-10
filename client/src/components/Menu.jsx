import { useEffect,useState } from "react"
import API from "../api"

function Menu(){

const [menu,setMenu] = useState([])

const loadMenu = async()=>{

const res = await API.get("/api/menu")

setMenu(res.data)

}

useEffect(()=>{
loadMenu()
},[])

return(

<div>

<h2>Menu</h2>

{menu.map(item=>(
<div key={item._id}>
{item.name} - ₹{item.studentPrice}
</div>
))}

</div>

)

}

export default Menu