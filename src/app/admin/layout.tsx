

import React from 'react';
import LayoutPage from '../components/LayoutPage';


export default function AdminLayout({
  children, 
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutPage children={children} />
  );
}
