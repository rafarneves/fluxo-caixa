"use client";

import { marcarComoPago } from "./actions";


export default function MarcarPago({
  id
}:{
  id:string;
}){


  return (

<form
action={async()=>{

  await marcarComoPago(id);

}}
>


<button

className="
bg-green-500
text-black
px-4
py-2
rounded-xl
font-bold
hover:bg-green-400
"

>

Marcar Pago

</button>


</form>

  );

}