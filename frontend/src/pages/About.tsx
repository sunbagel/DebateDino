import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero / Header section */}
      <div
        className="relative h-[40vh] bg-center bg-cover flex justify-center items-center"
        style={{
          backgroundImage:
            'url("../../Debate_Dino_Logo.svg")',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="z-10 text-center text-white">
          <h1 className="text-5xl font-bold mb-2">About Debate Dino</h1>
          <p className="text-xl">We sure love debating!</p>
        </div>
      </div>

      {/* Main content */}
      <section className="container mx-auto py-12 px-4 md:px-8">
        {/* Intro paragraph */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4">Who We Are</h2>
          <p className="text-lg leading-relaxed">
            At <strong>Debate Dino</strong>, our mission is to be a dinosaur.
          </p>
        </div>

        {/* Mission / Vision section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-semibold mb-3">Our Mission</h3>
            <p className="text-base leading-relaxed">
              Our mission is to bring debaters of all backgrounds together to
              learn, compete, and have fun. We believe that debate fosters
              critical thinking, empathy, and effective communication—skills
              that empower people to make positive changes in their lives
              and communities.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-3">Our Vision</h3>
            <p className="text-base leading-relaxed">
              We envision a world where thoughtful discussion is accessible
              to everyone—no matter their location, experience, or skill
              level. From friendly online forums to prestigious, in-person
              tournaments, we aim to create an inclusive environment where
              participants can explore new perspectives and grow together.
            </p>
          </div>
        </div>

        {/* Fun Fact / Stats / Highlight section (optional) */}
        <div className="bg-lime-100 rounded-lg p-6 mb-12 shadow-md">
          <h3 className="text-2xl font-semibold mb-3">Why “Dino”?</h3>
          <p className="text-base leading-relaxed">
            Dinosaurs spark curiosity, imagination, and a sense of wonder
            about the past—and that’s what we want for debates: a place
            that ignites curiosity, respectful exploration, and excitement
            for the next new idea. Plus, who doesn’t love a friendly T-Rex
            as a mascot?
          </p>
        </div>

        {/* Team / Values / “Timeline” section (optional) */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Our Journey</h3>
          <ul className="space-y-4">
            <li>
              <div className="flex items-center mb-1">
                <span className="font-bold text-lime-600 mr-2">2021</span>
                <span className="text-gray-800 font-medium">
                  Debate Dino was hatched
                </span>
              </div>
              <p className="ml-6 text-gray-600 text-sm">
                Began as a small group of enthusiastic debaters on campus.
              </p>
            </li>
            <li>
              <div className="flex items-center mb-1">
                <span className="font-bold text-lime-600 mr-2">2022</span>
                <span className="text-gray-800 font-medium">
                  First official tournament
                </span>
              </div>
              <p className="ml-6 text-gray-600 text-sm">
                We welcomed debaters from around the globe in our first big
                online event.
              </p>
            </li>
            <li>
              <div className="flex items-center mb-1">
                <span className="font-bold text-lime-600 mr-2">2023+</span>
                <span className="text-gray-800 font-medium">
                  Expanding our footprint
                </span>
              </div>
              <p className="ml-6 text-gray-600 text-sm">
                Partnering with more institutions and clubs to bring debate
                to new audiences.
              </p>
            </li>
          </ul>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-semibold mb-4">
            Ready to Join the Discussion?
          </h3>
          <p className="text-base mb-6">
            Sign up for our next tournament or explore our forums to jump
            into a debate that sparks your interest.
          </p>
          <button className="px-6 py-3 bg-black text-white rounded font-semibold">
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;
