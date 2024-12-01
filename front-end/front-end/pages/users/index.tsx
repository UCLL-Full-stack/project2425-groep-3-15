import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '@/components/header';
import UserOverviewTable from '@/components/users/UserOverviewTable';
import UserService from '@/services/UserService'; // Adjust the import path as needed
import { User } from '@/types';

const IndexPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);

    const getUsers = async () => {
        try {
            const data = await UserService.getAllUsers();
            console.log('Fetched users:', data); // Add this line to verify data
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users", error);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <>
            <Head>
                <title>Users</title>
                <link rel="icon" href="/logo.ico" />
            </Head>
            <Header />
            <main className="d-flex flex-column justify-content-center align-items-center">
                <h1 className="text-2xl font-bold mb-8">Users</h1>
                <section>
                    <UserOverviewTable users={users} />
                </section>
            </main>
        </>
    );
};

export default IndexPage;