import { useState, useEffect, useMemo } from 'react';
// Removed unused import: import { TypeElement } from 'typescript';
import { app } from '../config/firebase';
import {
  QuerySnapshot,
  collection,
  getFirestore,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  DocumentData,
  Query,
} from 'firebase/firestore'; // Changed from 'firebase/firestore/lite' to 'firebase/firestore'
import { onSnapshot } from 'firebase/firestore';

const db = getFirestore(app);

type WhereFilterOp =
  | '<'
  | '<='
  | '=='
  | '!='
  | '>='
  | '>'
  | 'array-contains'
  | 'in'
  | 'array-contains-any'
  | 'not-in';

type Triplet = [string, WhereFilterOp, any];

interface Options {
  filter?: Triplet[];
  sort?: [string, string] | [];
  limit?: null | number;
  keepDataWhileLoading?: boolean;
}

type Type<T = any> = [
  {
    ref: Query<DocumentData> | null;
    data: (T & { id: string })[];
    loading: boolean;
    error: null | string;
  },
  React.Dispatch<React.SetStateAction<(T & { id: string })[]>>
];

function useCollection<T = any>(
  collectionPath: string = '',
  options: Options = { filter: [], sort: [], limit: null }
): Type<T> {
  const { filter = [], sort = [], limit = null } = options;

  const [data, setdata] = useState<(T & { id: string })[]>([]);
  const [loading, setloading] = useState<boolean>(true);
  const [listener, setlistener] = useState<Function[]>([]);
  const [error, seterror] = useState<null | string>(null);

  const stringifiedOptions = useMemo(() => JSON.stringify(options), [options]);

  let ref: Query<DocumentData> | null =
    collectionPath && !collectionPath.includes('//')
      ? collection(db, collectionPath)
      : null;

  useEffect(() => {
    if (listener && listener.length) {
      listener.forEach((unsubscribe) => unsubscribe());
    }

    let queryRef: Query<DocumentData> | null = ref;

    if (queryRef) {
      filter.forEach((rule: Triplet) => {
        queryRef = queryRef ? query(queryRef, where(...rule)) : null;
      });

      if (sort.length) {
        queryRef = queryRef ? query(queryRef, (orderBy as any)(...sort)) : null;
      }

      if (limit) {
        queryRef = queryRef ? query(queryRef, firestoreLimit(limit)) : null;
      }

      if (queryRef) {
        setloading(true);
        if (!options.keepDataWhileLoading) {
          setdata([]);
        }
        seterror(null);

        let unsubscribe = onSnapshot(
          queryRef,
          (querySnapshots: QuerySnapshot) => {
            let arr: unknown[] = [];

            querySnapshots.forEach((doc) => {
              let data = { ...doc.data(), id: doc.id };

              arr.push(data);
            });

            setdata(arr as (T & { id: string })[]);
            setloading(false);
          },
          (err: Error) => {
            console.error(err, err.message);
            seterror(err.message);
            setloading(false);
          }
        );

        setlistener([unsubscribe]);
      }
    }
    return () => {
      if (listener && listener.length) {
        listener.forEach((unsubscribe) => unsubscribe());
      }
    };
  }, [db, collectionPath, stringifiedOptions]);

  return [{ ref, data, loading, error }, setdata];
}

export default useCollection;
