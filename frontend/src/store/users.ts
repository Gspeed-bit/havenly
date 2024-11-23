import { create } from 'zustand';
import { User } from '../services/types/user.types';

type UserStore = {
  users: User[];
};

export const useUsersStore = create<UserStore>(() => ({
  users: [],
}));

export const userStoreActions = {
  setUsers: (users: User[]) => {
    useUsersStore.setState((v) => {
      return { ...v, users };
    });
  },
};
