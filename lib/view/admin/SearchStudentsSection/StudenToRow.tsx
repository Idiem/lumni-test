import isoStringDateToHumanDate from "@presentation/dates/isoStringDateToHumanDate";
import ISearchStudentsRow from "./ISearchStudentsRow";
import IPersonDto from "@application/models/IPersonDto";

export default function studentToRow(dto: IPersonDto, index: number): ISearchStudentsRow {
  return {
    rowIndex: index + 1,
    id: dto.id,
    registerDate: isoStringDateToHumanDate(dto.identificationInfo?.createdAt ?? "0"),
    fullName: dto.identificationInfo?.firstName + " " + dto.identificationInfo?.middleName + " " + dto.identificationInfo?.lastName
  };
}