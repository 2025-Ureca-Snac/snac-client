'use client';

import React from 'react';
import UserCard from './UserCard';
import { User } from '../../types';

interface UserListProps {
  users: User[];
  onUserClick?: (user: User) => void;
}

export default function UserList({ users, onUserClick }: UserListProps) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <div className="text-lg font-medium mb-2">
          필터 조건을 선택해 주세요
        </div>
        <div className="text-sm">조건에 맞는 사용자가 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <UserCard key={user.tradeId} user={user} onClick={onUserClick} />
      ))}
    </div>
  );
}
