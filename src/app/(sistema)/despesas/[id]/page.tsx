import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { editarDespesa } from "./actions";


export default async function EditarDespesaPage({
  params,
}:{
  params:{
    id:string;
  };
}){


  const { data: despesa } = await supabase
    .from("despesas")
    .select("*")
    .eq(
      "id",
      params.id
    )
    .single();



  if(!despesa){

    return (

      <div className="text-red-400 text-2xl">
        Despesa não encontrada.
      </div>

    );

  }



  const inputClass = `
    w-full
    mt-2
    bg-[#0B0F14]
    border
    border-zinc-800
    rounded-xl
    px-4
    py-3
    text-white
    outline-none
    focus:border-green-500
    transition
  `;



  const labelClass = `
    text-sm
    font-semibold
    text-zinc-400
  `;



  return (

    <main className="space-y-8">



      <div className="
        flex
        items-center
        justify-between
      ">



        <div>


          <p className="
            text-xs
            uppercase
            tracking-[0.25em]
            font-semibold
            text-zinc-500
          ">
            FINANCEIRO
          </p>



          <h1 className="
            mt-3
            text-5xl
            font-bold
            text-white
          ">
            Editar
            <span className="text-green-400">
              {" "}Despesa
            </span>
          </h1>



          <p className="
            text-zinc-400
            mt-3
            text-lg
          ">
            Atualize as informações do custo operacional.
          </p>


        </div>




        <Link

          href="/despesas"

          className="
            bg-[#1C2430]
            border
            border-zinc-800
            hover:border-zinc-600
            transition
            px-6
            py-3
            rounded-xl
            font-semibold
            text-white
          "

        >

          ← Voltar

        </Link>


      </div>






      <section

        className="
          rounded-3xl
          border
          border-zinc-800
          bg-gradient-to-b
          from-[#171F2B]
          to-[#111827]
          p-8
        "

      >



        <div className="mb-8">


          <h2 className="
            text-2xl
            font-bold
            text-white
          ">
            Informações da despesa
          </h2>


          <p className="
            text-zinc-500
            mt-2
          ">
            Altere os dados e salve as modificações.
          </p>


        </div>






        <form

          action={
            editarDespesa.bind(
              null,
              despesa.id
            )
          }

          className="
            space-y-8
          "

        >



          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-6
          ">



            <div className="md:col-span-2">


              <label className={labelClass}>
                Descrição
              </label>


              <input

                name="descricao"

                defaultValue={
                  despesa.descricao
                }

                className={inputClass}

              />


            </div>





            <div>


              <label className={labelClass}>
                Categoria
              </label>


              <input

                name="categoria"

                defaultValue={
                  despesa.categoria
                }

                className={inputClass}

              />


            </div>





            <div>


              <label className={labelClass}>
                Tipo da despesa
              </label>


              <select

                name="tipo"

                defaultValue={
                  despesa.tipo
                }

                className={inputClass}

              >


                <option value="Fixa">
                  Fixa
                </option>


                <option value="Variável">
                  Variável
                </option>


              </select>


            </div>





            <div>


              <label className={labelClass}>
                Valor
              </label>


              <input

                name="valor"

                type="number"

                step="0.01"

                defaultValue={
                  despesa.valor
                }

                className={inputClass}

              />


            </div>





            <div>


              <label className={labelClass}>
                Dia vencimento (fixa)
              </label>


              <input

                name="dia_vencimento"

                type="number"

                defaultValue={
                  despesa.dia_vencimento ?? ""
                }

                className={inputClass}

              />


            </div>





            <div>


              <label className={labelClass}>
                Data (variável)
              </label>


              <input

                name="data"

                type="date"

                defaultValue={
                  despesa.data ?? ""
                }

                className={inputClass}

              />


            </div>



          </div>






          <div className="
            flex
            justify-end
            pt-4
            border-t
            border-zinc-800
          ">


            <button

              className="
                bg-green-500
                hover:bg-green-400
                transition
                text-black
                font-bold
                px-10
                py-4
                rounded-xl
              "

            >

              Salvar Alterações

            </button>


          </div>





        </form>



      </section>



    </main>

  );

}