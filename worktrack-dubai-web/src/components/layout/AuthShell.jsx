import LanguageToggle from '../language/LanguageToggle';

export default function AuthShell({ children }) {
  return (
    <div className="min-h-screen bg-midnight mashrabiya-bg flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 end-4">
        <LanguageToggle />
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="font-display text-4xl text-gold font-semibold">WorkTrack</span>
          <span className="block text-slate text-sm mt-1 tracking-widest uppercase">Dubai</span>
        </div>
        {children}
      </div>
    </div>
  );
}
