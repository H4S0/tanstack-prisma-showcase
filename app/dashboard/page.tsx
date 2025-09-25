import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import React from 'react';

const DashboardPage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return <div>welcome {user?.given_name}</div>;
};

export default DashboardPage;
