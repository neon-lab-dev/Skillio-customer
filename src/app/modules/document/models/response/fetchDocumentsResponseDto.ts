import { AppResponseData } from "@neon-lab-dev/platform";
import { DocumentType } from "../../enums/documentEnum";
import { AutoMap } from "@automapper/classes";

export class FetchDocumentsResponseDto implements AppResponseData{
    @AutoMap()
    id!:string;

    @AutoMap()
    url!: string;

    @AutoMap()
    type!: DocumentType
}