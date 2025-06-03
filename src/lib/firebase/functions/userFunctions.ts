import { collection, getDocs, query, orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  startAt } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { userType } from "@/lib/types/userType";

export async function fetchAllUsers(): Promise<userType[]> {
  const data: userType[] = [];
  const q = query(collection(db, "user"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const userData = { id: doc.id, ...doc.data() } as userType;
    data.push(userData);
  });
  return data;
}





export async function fetchPaginatedUsers(
  pageSize: number,
  startAfterDoc?: QueryDocumentSnapshot<DocumentData> | null,
  goBackDoc?: QueryDocumentSnapshot<DocumentData> | null
): Promise<{
  users: userType[]
  lastDoc: QueryDocumentSnapshot<DocumentData> | null
  hasMore: boolean
}> {
  const ref = collection(db, 'user')
  let q

  if (goBackDoc) {
    q = query(ref, orderBy('time', 'desc'), startAt(goBackDoc), limit(pageSize))
  } else if (startAfterDoc) {
    q = query(ref, orderBy('time', 'desc'), startAfter(startAfterDoc), limit(pageSize))
  } else {
    q = query(ref, orderBy('time', 'desc'), limit(pageSize))
  }

  const snapshot = await getDocs(q)
  const users: userType[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as userType[]

  const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null
  const hasMore = snapshot.docs.length === pageSize

  return { users, lastDoc, hasMore }
}
