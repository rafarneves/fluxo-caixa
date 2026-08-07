"use client";

import { excluirDespesa } from "./actions";


export default function ExcluirDespesa({
  id
}:{
  id:string;
}){


  const excluir =
    excluirDespesa.bind(
      null,
      id
    );


  return (

    <form action={excluir}>


      <button

        className="
          bg-red-500/20
          text-red-400
          px-4
          py-2
          rounded-xl
          font-bold
          hover:bg-red-500
          hover:text-white
          transition
        "

      >

        Excluir

      </button>


    </form>

  );


}