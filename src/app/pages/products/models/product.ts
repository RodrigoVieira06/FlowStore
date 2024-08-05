import { Manufacturer } from "../../manufacturers/models/manufacturer";

export interface Product {
  codigoBarras: string;
  descricao: string;
  id: number;
  nome: string;
  fabricante: Manufacturer
}
