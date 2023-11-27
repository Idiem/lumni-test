import { useState } from "react";
import styles from "./SearchStudenInput.module.css";
import fieldsStyles from "@view/common/Fields/Fields.module.css"
import ButtonWithLoading from "@view/common/ButtonWithLoading";
import { useEffect } from "react";
import { useRef } from "react";
import WordsField from "@view/common/Fields/WordsField";

export interface IStudentsSearcherProps {
  onSubmit: (searchString: string) => void;
  resultsCount?: number;
  loading?: boolean;
}

const StudentsSearcher = (props: IStudentsSearcherProps) => {

  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement & HTMLInputElement>(null);

  const onSubmit = (evt: any) => {
    evt.preventDefault();
    evt.stopPropagation();
    if (props.onSubmit) {
      props.onSubmit(value);
    }
  };

  useEffect(() => {
    if (!props.loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [props.loading]);

  return (
    <div className={styles.root}>
      <form className={styles.inputContainer} onSubmit={onSubmit}>
        <WordsField
          ref={inputRef}
          autofocus
          variant="filled"
          value={value}
          onChange={evt => setValue(evt.target.value)}
          disabled={props.loading}
          maxWords={5}
          maxLength={100}
          placeholder={props.loading
            ? "Buscando..."
            : "Palabras clave"
          }
        />
        <ButtonWithLoading
          type="submit"
          loading={props.loading === true}
          color="secondary"
          variant="contained"
        >
          Buscar
        </ButtonWithLoading>
      </form>
      <footer className={styles.footer}>

      </footer>
    </div>
  );
};

export default StudentsSearcher;