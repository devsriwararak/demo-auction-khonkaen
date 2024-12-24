import React from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import LayoutPage from '../components/LayoutPage';


export default function AdminLayout({
  children, 
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutPage children={children}/>
  );
}
