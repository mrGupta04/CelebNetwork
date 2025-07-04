import React from 'react';

interface SocialLinks {
  instagram?: string;
  youtube?: string;
  spotify?: string;
  [key: string]: string | undefined;
}

interface SocialMediaLinksProps {
  links?: SocialLinks;
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({ links = {} }) => {
  const socialPlatforms = [
    {
      name: 'Instagram',
      key: 'instagram',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      key: 'youtube',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
        </svg>
      ),
    },
    {
      name: 'Spotify',
      key: 'spotify',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0 3c-3.866 0-7 3.134-7 7s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7zm3.21 10.5c-.195.267-.525.342-.792.147-1.186-.875-2.682-1.072-4.446-.585-.303.088-.618-.129-.706-.432-.088-.303.129-.618.432-.706 2.035-.588 3.784-.354 5.194.585.267.195.342.525.147.792zm.815-1.587c-.237.324-.664.424-.988.187-1.361-.99-3.438-1.278-5.647-.684-.366.088-.75-.142-.838-.508-.088-.366.142-.75.508-.838 2.571-.618 4.956-.285 6.708.684.324.237.424.664.187.988zm.075-1.656c-2.872-1.702-7.571-1.85-10.29-.972-.434.132-.912-.108-1.044-.542s.108-.912.542-1.044c3.165-.96 8.412-.784 11.74 1.125.398.236.53.738.294 1.136-.235.398-.737.53-1.136.294z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-500 mb-2">Social Media</h4>
      <div className="flex space-x-4">
        {socialPlatforms.map((platform) => (
          links[platform.key] && (
            <a
              key={platform.key}
              href={links[platform.key]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-indigo-600 transition-colors"
              aria-label={platform.name}
            >
              {platform.icon}
            </a>
          )
        ))}
      </div>
    </div>
  );
};

export default SocialMediaLinks;