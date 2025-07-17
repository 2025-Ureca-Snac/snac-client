'use client';

import React from 'react';
import UserCard from './UserCard';

interface User {
  id: number;
  type: 'buyer' | 'seller';
  name: string;
  carrier: string;
  data: string;
  price: string;
}

interface UserListProps {
  users: User[];
  onUserClick?: (user: User) => void;
}

export default function UserList({ users, onUserClick }: UserListProps) {
  return (
    <div className="space-y-4">
      {users.map((user) => (
        <UserCard key={user.id} user={user} onClick={onUserClick} />
      ))}
    </div>
  );
}
