import { api } from './config';
import IApiErrorDto from '@presentation/controllersModels/IApiErrorDto';
import { useMemo } from 'react';
import useSWR from 'swr';
import IPersonDto from '@application/models/IPersonDto';

export interface IuseFetchPublicStudents {
  keyWords?: string;
}

export default function useFetchStudents(props: IuseFetchPublicStudents) {
  const searchKey = useMemo(() => {
    if (props.keyWords !== undefined) {
      return `persons?keyWords=${encodeURIComponent(props.keyWords)}`;
    } else {
      return 'persons';
    }
  }, [props.keyWords]);

  const { data, error, isValidating, mutate } = useSWR<
    IPersonDto[],
    IApiErrorDto,
    string
  >(searchKey, (key: string) =>
    api.get(key).then((x) => (x.isSuccess ? x.body : Promise.reject(x.body)))
  );

  return {
    students: data,
    refreshStudents: mutate,
    loadingStudents: isValidating && data === undefined,
    validatingStudents: isValidating,
    fetchingStudentsError: error,
  };
}
