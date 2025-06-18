import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import type { User, UserRole } from '../types';

// Firestore User Document Interface
export interface FirestoreUser {
  uid: string;
  role: UserRole;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  approvedByAdmin?: boolean;
  lastLoginAt?: Timestamp;
}

// User Management Functions
export const userService = {
  /**
   * Create a new user document in Firestore
   */
  async createUser(uid: string): Promise<FirestoreUser> {
    const userRef = doc(db, 'users', uid);
    const userData: Omit<FirestoreUser, 'uid'> = {
      role: 'student', // Default role
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
      approvedByAdmin: false,
      lastLoginAt: serverTimestamp() as Timestamp,
    };

    await setDoc(userRef, userData);
    
    return {
      uid,
      ...userData,
      createdAt: new Date() as unknown as Timestamp, // Will be server timestamp
      updatedAt: new Date() as unknown as Timestamp,
      lastLoginAt: new Date() as unknown as Timestamp,
    };
  },

  /**
   * Get user data from Firestore
   */
  async getUser(uid: string): Promise<FirestoreUser | null> {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return {
          uid,
          ...userSnap.data()
        } as FirestoreUser;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },

  /**
   * Update user's last login time
   */
  async updateLastLogin(uid: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        lastLoginAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  },

  /**
   * Update user role (Admin only)
   */
  async updateUserRole(uid: string, newRole: UserRole, approvedByAdmin = true): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        role: newRole,
        approvedByAdmin,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },

  /**
   * Get all users (Admin only)
   */
  async getAllUsers(): Promise<FirestoreUser[]> {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      
      return snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as FirestoreUser[];
    } catch (error) {
      console.error('Error fetching all users:', error);
      return [];
    }
  },

  /**
   * Get users by role
   */
  async getUsersByRole(role: UserRole): Promise<FirestoreUser[]> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('role', '==', role));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as FirestoreUser[];
    } catch (error) {
      console.error('Error fetching users by role:', error);
      return [];
    }
  },

  /**
   * Get pending educator approvals (Admin only)
   */
  async getPendingEducators(): Promise<FirestoreUser[]> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef, 
        where('role', '==', 'educator'),
        where('approvedByAdmin', '==', false)
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as FirestoreUser[];
    } catch (error) {
      console.error('Error fetching pending educators:', error);
      return [];
    }
  },

  /**
   * Create or update user on login
   */
  async createOrUpdateUser(uid: string): Promise<User> {
    try {
      // Check if user exists
      let firestoreUser = await this.getUser(uid);
      
      if (!firestoreUser) {
        // Create new user
        firestoreUser = await this.createUser(uid);
      } else {
        // Update last login
        await this.updateLastLogin(uid);
      }

      // Return User object for the store
      return {
        uid: firestoreUser.uid,
        role: firestoreUser.role,
      };
    } catch (error) {
      console.error('Error creating/updating user:', error);
      // Fallback to default student role if Firestore fails
      return {
        uid,
        role: 'student',
      };
    }
  }
};

// Helper function to check if user has admin role
export async function isUserAdmin(uid: string): Promise<boolean> {
  const user = await userService.getUser(uid);
  return user?.role === 'admin';
}

// Helper function to check if user has educator or admin role
export async function isUserEducatorOrAdmin(uid: string): Promise<boolean> {
  const user = await userService.getUser(uid);
  return user?.role === 'educator' || user?.role === 'admin';
} 