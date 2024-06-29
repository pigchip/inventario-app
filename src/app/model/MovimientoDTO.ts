import { ProductoDTO } from "./ProductoDTO";

export interface MovimientoDTO {
    idMovimiento: number;
    tipoMovimiento: string;
    fechaMovimiento: string;
    cantidad: number;
    producto: ProductoDTO;
}