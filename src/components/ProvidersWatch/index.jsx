import Image from "next/image";
import Link from "next/link";

import { ImageTmdb } from "../ImageTmdb";

import styles from './providers.module.css'

export function ProvidersWatch({ providers }) {
   const traduction = {
      buy: "Comprar",
      flatrate: "Por plano",
      rent: "Alugar"
   }
  
   return providers ? (
      <section className={styles["section"]}>
         {
            Object.entries(providers).map(([type, streamings], index) => {
               if (type === "link") return "";

               return (
                  <div key={index} className={styles["container"]}>
                     <h3 className={styles["providers-mode"]}>
                        {traduction[type]}
                     </h3>

                     <div className={styles["providers-list"]}>
                        {
                           streamings.map((streaming) => {
                              return (
                                 <Link
                                    href={providers.link}
                                    key={streaming.display_priority}
                                    className={styles["streaming-item"]}
                                 >
                                    <div className={styles["streaming-image"]}>
                                       <ImageTmdb 
                                          type="miniCover"
                                          path={streaming.logo_path}
                                          alt={streaming.name + " logo"}
                                       />
                                    </div>

                                    <p className={styles["streaming-name"]}>{streaming.provider_name}</p>

                                 </Link>
                              )
                           })
                        }
                     </div>
                  </div>
               )
            })
         }
      </section>
   ) : (
      <p>{"Sem conteúdo"}</p>
   )
}