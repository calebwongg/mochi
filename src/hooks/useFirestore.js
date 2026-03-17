import { useEffect, useRef, useCallback } from 'react'
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  increment,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore'
import { db, isConfigured } from '../firebase'

// Initialize or update user document on sign-in
async function initUserDoc(uid, displayName, photoURL) {
  if (!db) return { mochiRelationship: 0, visitCount: 1, totalSessionTime: 0 }
  const userRef = doc(db, 'users', uid)
  const snap = await getDoc(userRef)

  if (!snap.exists()) {
    await setDoc(userRef, {
      displayName: displayName || '',
      photoURL: photoURL || '',
      createdAt: serverTimestamp(),
      lastVisit: serverTimestamp(),
      totalSessionTime: 0,
      visitCount: 1,
      mochiRelationship: 0,
    })
    // Initialize mochiState
    await setDoc(doc(db, 'users', uid, 'mochiState', 'current'), {
      currentMood: 'happy',
      knownFacts: [],
      milestones: [],
      currentActivity: 'studying',
    })
  } else {
    await updateDoc(userRef, {
      lastVisit: serverTimestamp(),
      visitCount: increment(1),
      displayName: displayName || snap.data().displayName,
      photoURL: photoURL || snap.data().photoURL,
    })
  }

  return (await getDoc(userRef)).data()
}

// Load Mochi state
async function loadMochiState(uid) {
  if (!db) return { currentMood: 'happy', knownFacts: [], milestones: [], currentActivity: 'studying' }
  const ref = doc(db, 'users', uid, 'mochiState', 'current')
  const snap = await getDoc(ref)
  if (snap.exists()) return snap.data()
  return { currentMood: 'happy', knownFacts: [], milestones: [], currentActivity: 'studying' }
}

// Load latest conversation summary
async function loadLatestConversation(uid) {
  if (!db) return { messages: [], summary: '' }
  const convRef = collection(db, 'users', uid, 'conversations')
  const q = query(convRef, orderBy('createdAt', 'desc'), limit(1))
  const snap = await getDocs(q)
  if (snap.empty) return { messages: [], summary: '' }
  return snap.docs[0].data()
}

// Save a conversation
async function saveConversation(uid, messages, summary) {
  if (!db) return
  const convRef = collection(db, 'users', uid, 'conversations')
  await addDoc(convRef, {
    messages,
    summary,
    createdAt: serverTimestamp(),
  })
}

// Update mochi state
async function updateMochiState(uid, updates) {
  if (!db) return
  const ref = doc(db, 'users', uid, 'mochiState', 'current')
  await updateDoc(ref, updates)
}

// Update user stats
async function updateUserStats(uid, updates) {
  if (!db) return
  const userRef = doc(db, 'users', uid)
  await updateDoc(userRef, updates)
}

export function useFirestore(user) {
  const sessionStartRef = useRef(Date.now())
  const lastSaveRef = useRef(Date.now())

  // Session time tracking — save every 5 minutes and on unload
  const saveSessionTime = useCallback(() => {
    if (!user || !db) return
    const now = Date.now()
    const elapsed = Math.floor((now - lastSaveRef.current) / 60000) // minutes
    if (elapsed < 1) return
    lastSaveRef.current = now
    updateUserStats(user.uid, {
      totalSessionTime: increment(elapsed),
    })
  }, [user])

  useEffect(() => {
    if (!user || !db) return

    const interval = setInterval(saveSessionTime, 5 * 60 * 1000)

    const handleUnload = () => saveSessionTime()
    window.addEventListener('beforeunload', handleUnload)

    return () => {
      clearInterval(interval)
      window.removeEventListener('beforeunload', handleUnload)
      saveSessionTime()
    }
  }, [user, saveSessionTime])

  // Increment relationship score (+1 per 10 min)
  useEffect(() => {
    if (!user || !db) return
    const interval = setInterval(() => {
      updateUserStats(user.uid, {
        mochiRelationship: increment(1),
      }).catch(() => {})
    }, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [user])

  return {
    initUserDoc,
    loadMochiState,
    loadLatestConversation,
    saveConversation,
    updateMochiState,
    updateUserStats,
  }
}
