import React, { useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';

const GuestHome = () => {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen">
      <div className="p-12 bg-lime-200 bg-opacity-50 backdrop-filter backdrop-blur-md rounded-lg shadow-lg overflow-hidden min-w-full max-w-4xl">
        <div className="flex flex-row items-center justify-center w-full">
          <div className="flex flex-col w-1/2 space-y-4">
            <h1 className="text-5xl font-bold">Debate Dino</h1>
            <p className="text-xl">Start debating today!</p>
            <div className="flex space-x-4">
              <button className="px-6 py-2 bg-black text-white rounded">
                Get Started
              </button>
              <button className="px-6 py-2 bg-transparent text-black rounded border border-black">
                Learn More
              </button>
            </div>
          </div>
          <div className="w-1/2 flex justify-center">
            <img
              src="../../Debate_Dino_Logo.svg"
              alt="Debate Tournaments"
              className="max-w-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface User {
  uid: string;
  email?: string;
  displayName?: string;
  // etc.
}

const SignedInHome: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero / Welcome section */}
      <section
        className="relative h-[50vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            'url("../../Debate_Dino_Logo.svg")',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome back, {user.displayName || 'Debater'}!
          </h1>
          <p className="mb-6 text-xl">Ready to jump into your next debate?</p>
          <button className="px-8 py-3 bg-black rounded text-white font-semibold">
            Continue Debating
          </button>
        </div>
      </section>

      {/* Example recommended section */}
      <section className="py-8 px-4 md:px-16">
        <h2 className="text-2xl font-bold mb-4">Recommended Debates</h2>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">AI & Ethics</h3>
            <p className="text-gray-600 mb-4">
              Upcoming debate on AI usage in daily life.
            </p>
            <button className="px-4 py-2 bg-lime-200 text-black rounded">
              Join Now
            </button>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Renewable Energy</h3>
            <p className="text-gray-600 mb-4">Debate of the week!</p>
            <button className="px-4 py-2 bg-lime-200 text-black rounded">
              View
            </button>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">Global Economy</h3>
            <p className="text-gray-600 mb-4">Suggested for you</p>
            <button className="px-4 py-2 bg-lime-200 text-black rounded">
              Join Discussion
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const Home = () => {
  const { currentUser: fbUser } = useAuth();
  const [signedInUser, setSignedInUser] = useState<User | null>(null);

  useEffect(() => {
    async function checkUser() {
      if (!fbUser) {
        console.error("User is not signed in, can't do user-specific stuff.");
        setSignedInUser(null);
        return;
      }

      try {
        const token = await fbUser.getIdToken();
        console.log('User Token:', token);

        setSignedInUser({
          uid: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || '',
        });
      } catch (err) {
        console.error('Error retrieving token:', err);
        setSignedInUser(null);
      }
    }

    checkUser();
  }, [fbUser]);

  if (!signedInUser) {
    return <GuestHome />;
  }

  return <SignedInHome user={signedInUser} />;
};

export default Home;
