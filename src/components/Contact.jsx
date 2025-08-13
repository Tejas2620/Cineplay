import React from 'react';

const Contact = () => (
  <div className="max-w-xl mx-auto py-12 px-6">
    <h2 className="text-4xl font-extrabold text-white mb-6">Contact Us</h2>
    <p className="text-zinc-300 mb-4 text-lg">
      Have feedback, questions, or want to report a bug? We’d love to hear from
      you!
    </p>
    <div className="mb-6">
      <h3 className="text-2xl font-bold text-white mb-2">How to Reach Us</h3>
      <ul className="list-disc pl-6 text-zinc-300 space-y-2">
        <li>
          <strong>Email:</strong>{' '}
          <a href="mailto:your@email.com" className="text-[#6556CD] underline">
            cineplay.contact.handclasp297@slmails.com
          </a>
        </li>
        <li>
          <strong>GitHub Issues:</strong>{' '}
          <a
            href="https://github.com/Tejas2620/Cineplay/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#6556CD] underline"
          >
            Open an issue
          </a>{' '}
          for bugs or feature requests.
        </li>
      </ul>
    </div>
    <div>
      <h3 className="text-2xl font-bold text-white mb-2">
        Connect & Contribute
      </h3>
      <p className="text-zinc-300">
        Cineplay is open source! If you’d like to contribute, check out our{' '}
        <a
          href="https://github.com/Tejas2620/Cineplay"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#6556CD] underline"
        >
          GitHub repository
        </a>
        .
      </p>
    </div>
  </div>
);

export default Contact;
