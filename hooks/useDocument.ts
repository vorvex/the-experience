import { useState, useEffect, useCallback } from 'react';
import { app } from '../config/firebase';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  DocumentSnapshot,
  onSnapshot,
} from 'firebase/firestore';

const db = getFirestore(app);

type Type<T = any> = [
  {
    ref: any;
    data: T | null;
    loading: boolean;
    error: null | string;
    exists: boolean;
  },
  React.Dispatch<React.SetStateAction<T | null>>
];

function useDocument<T = any>(
  collectionPath: string = '',
  id: string | null,
  editDocOnSet = false
): Type<T> {
  const [data, setdata] = useState<T | null>(null);
  const [loading, setloading] = useState<boolean>(true);
  const [listener, setlistener] = useState<Function[]>([]);
  const [error, seterror] = useState<null | string>(null);
  const [exists, setexists] = useState<boolean>(true);

  let ref: any =
    collectionPath && !collectionPath.includes('//') && !!id
      ? doc(db, collectionPath + '/' + id)
      : null;

  useEffect(() => {
    if (listener && listener.length) {
      listener.forEach((unsubsribe) => unsubsribe());
    }

    if (!id) {
      setdata(null);
      setloading(false);
    } else if (ref) {
      setloading(true);
      setdata(null);
      seterror(null);

      let unsubscribe = onSnapshot(
        ref,
        (querySnapshot: DocumentSnapshot) => {
          setdata((querySnapshot?.data() ?? null) as T);
          setloading(false);
          setexists(!!querySnapshot.exists);
        },
        (err: Error) => {
          console.error(err);
          seterror(err.message);
          setloading(false);
        }
      );

      setlistener([unsubscribe]);
    }
    return () => {
      if (listener && listener.length) {
        listener.forEach((unsubsribe) => unsubsribe());
      }
    };
  }, [db, collectionPath, id]);

  const setData: React.Dispatch<React.SetStateAction<T | null>> = useCallback(
    (fn: T | null | ((d: T | null) => T | null)) => {
      if (!editDocOnSet) {
        setdata(fn);
      } else {
        let d =
          typeof fn === 'function' ? (fn as (d: T | null) => T)(data) : fn;

        if (d) {
          ref.set(d, { merge: true });
        }
      }
    },
    [ref, editDocOnSet, data]
  );

  return [{ ref, data, loading, error, exists }, setData];
}

export default useDocument;
