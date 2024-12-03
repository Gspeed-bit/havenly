'use client';

import React, { useEffect, useState } from 'react';
import { fetchAllUsersApi } from '@/services/user/userApi';
import { User } from '@/services/types/user.types';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,

  TableCaption,

  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle2, Mail, Phone, ShieldCheck } from 'lucide-react';
import Icon from '@/components/common/icon/icons';

const AdminGetAllUsers = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const fetchUsers = async () => {
    try {
      const response = await fetchAllUsersApi();
      if (response.status === 'success') {
        setUsers(response.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsHydrated(true);
    if (!isAuthenticated) {
      router.push('/');
    } else {
      fetchUsers();
    }
  }, [isAuthenticated, router]);

  if (!isHydrated) return null;

  if (loading)
    return (
      <Icon
        type='Loader2'
        color={'#3A0CA3'}
        size={32}
        className='animate-spin flex-center mx-auto'
      />
    );

  if (!users || users.length === 0)
    return (
      <div className='min-h-full flex mx-auto flex-center text-center py-4 text-primary_main'>
        No users found
      </div>
      
    );

  return (
    <Card className='shadow-lg'>
      <CardHeader className='bg-primary_main text-white'>
        <CardTitle className='text-xl font-bold'>
          List of registered users
        </CardTitle>
      </CardHeader>
      <CardContent className='bg-veryLightGray'>
        <Table className='bg-white'>
          <TableCaption>A list of all Users</TableCaption>
          
          <TableHeader>
            <TableRow>
              <TableHead className='w-12 text-center text-primary_main'>
                #
              </TableHead>
              <TableHead className='w-1/4 text-primary_main'>
                <div className='flex items-center space-x-2'>
                  <UserCircle2 className='h-5 w-5' />
                  <span>Name</span>
                </div>
              </TableHead>
              <TableHead className='w-1/4 text-primary_main'>
                <div className='flex items-center space-x-2'>
                  <Mail className='h-5 w-5' />
                  <span>Email</span>
                </div>
              </TableHead>
              <TableHead className='w-1/4 text-primary_main'>
                <div className='flex items-center space-x-2'>
                  <Phone className='h-5 w-5' />
                  <span>Phone</span>
                </div>
              </TableHead>
              <TableHead className='w-20 text-center text-primary_main'>
                <div className='flex items-center justify-center space-x-2'>
                  <ShieldCheck className='h-5 w-5' />
                  <span>Admin</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user._id} className='hover:bg-gray-100'>
                <TableCell className='text-center font-medium'>
                  {index + 1}
                </TableCell>
                <TableCell className='whitespace-nowrap'>
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell className='whitespace-nowrap'>
                  {user.email}
                </TableCell>
                <TableCell className='whitespace-nowrap'>
                  {user.phoneNumber}
                </TableCell>
                <TableCell className='text-center'>
                  {user.isAdmin ? (
                    <span className='text-green-500 font-bold'>Yes</span>
                  ) : (
                    <span className='text-red-500 font-bold'>No</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdminGetAllUsers;
