import { useState, useMemo } from "react";
import styles from "./SearchStudentsSection.module.css";

import IPersonDto from "@application/models/IPersonDto";
import AnimatedPanel from "@view/common/AnimatedPanel";
import EmploymentInfoDetail from "@view/admin/InfoDetails/EmploymentInfoDetail";
import Table, { ITableCellIndex, ITableColumn } from "@view/common/Table";
import useFetchStudents from "../Api/useFetchStudents";
import ISearchStudentsRow from "./ISearchStudentsRow";
import studentToRow from "./StudenToRow";
import StudentsSearcher from "./SearchStudenInput";

const SearchStudentsSection = () => {

  const [selectedPerson, setSelectedPerson] = useState<undefined | IPersonDto>();
  const [openLeftPanel, setOpenLeftPanel] = useState(false);
  const [selectedCell, setSelectedCell] = useState<undefined | ITableCellIndex<ISearchStudentsRow>>();
  const [searchString, setSearchString] = useState<string>("");

  const { students, loadingStudents } = useFetchStudents({ keyWords: searchString });
  const [columns, setColumns] = useState<ITableColumn<ISearchStudentsRow>[]>([
    { Header: "#", accessor: "rowIndex", width: 50, cellWidth: 50 },
    { Header: "Fecha de registro", accessor: "registerDate", width: 200, cellWidth: 200 },
    { Header: "Nombres y apellidos", accessor: "fullName", width: 300, cellWidth: 300 },
  ]);

  const values = useMemo(() => students
    ?.sort((a: IPersonDto, b:IPersonDto) => {
      const aCreatedAt = new Date(a.createdAt);
      const bCreatedAt = new Date(b.createdAt);
      if (aCreatedAt > bCreatedAt) return -1;
      if (aCreatedAt < bCreatedAt) return 1;
      return 0;
    })
    .map((x:IPersonDto, index:number) => studentToRow(x, index)) ?? [],
    [students]
  );

  const onCellClick = (cellIndex: ITableCellIndex<ISearchStudentsRow>) => {
    setSelectedCell(selectedCell);
    setSelectedPerson(students?.find(x => x.id === cellIndex.rowId));
    setOpenLeftPanel(true);
  };

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h1>Buscar estudiantes por perfil de empleabilidad: </h1>
        <div className={styles.headersButtons}>

        </div>
      </header>
      <StudentsSearcher
        onSubmit={s => setSearchString(s)}
        resultsCount={students?.length}
        loading={loadingStudents}
      /> 
      <main>
        <div role="dummy-table" className={styles.table}>
          <Table
            loading={loadingStudents}
            className={styles.table}
            columns={columns}
            values={values}
            onCellClick={onCellClick}
            selectedCell={selectedCell}
            onColumnsChange={setColumns}
          />
        </div>
      </main>
      <AnimatedPanel open={openLeftPanel} onClose={() => { setOpenLeftPanel(false); }}>
        {selectedPerson
          ? (
            <div style={{ padding: "1rem 1rem" }} >
              <h1 style={{ color: "var(--color-primary)", textAlign: "center" }}>
                Perfil de empleabilidad
              </h1>
              {selectedPerson?.employmentInfo != null &&
                <EmploymentInfoDetail employmentInfo={selectedPerson.employmentInfo} />
              }
            </div>
          ) : (
            <></>
          )}
      </AnimatedPanel>
    </div>
  );
};

export default SearchStudentsSection;
