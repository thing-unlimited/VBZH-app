import React, { useState } from 'react';
import {
  Wifi,
  Laptop,
  Monitor,
  Coffee,
  Zap,
  VolumeX,
  Gauge,
  CheckCircle,
  Play,
  RotateCw,
} from 'lucide-react';

export const NomadSpotlight: React.FC = () => {
  const [testingSpeed, setTestingSpeed] = useState(false);
  const [speedProgress, setSpeedProgress] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState(462);
  const [uploadSpeed, setUploadSpeed] = useState(88);
  const [ping, setPing] = useState(11);
  const [hasTested, setHasTested] = useState(true);

  const runSpeedTest = () => {
    if (testingSpeed) return;
    setTestingSpeed(true);
    setSpeedProgress(0);

    const interval = setInterval(() => {
      setSpeedProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTestingSpeed(false);
          setHasTested(true);
          // Slight natural variation
          setDownloadSpeed(455 + Math.floor(Math.random() * 20));
          setUploadSpeed(85 + Math.floor(Math.random() * 10));
          setPing(10 + Math.floor(Math.random() * 4));
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  return (
    <section id="nomad-workspace" className="py-14 bg-stone-900 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="text-xs font-semibold tracking-wider text-amber-400 uppercase mb-1">
            Built for Remote Professionals
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white tracking-tight">
            Work Without Compromise by the Bay
          </h2>
          <p className="text-stone-300 text-sm sm:text-base mt-2">
            No cramped dining tables or unreliable hotel Wi-Fi. Tulip Studio at 4709 Tulip Dr provides an authentic ergonomic workstation and high-speed fiber internet for frictionless productivity.
          </p>
        </div>

        {/* 2-Column Grid: Live Speed Test Simulator + Workstation Hardware Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Wi-Fi & Live Speed Test Card (5 cols) */}
          <div className="lg:col-span-5 bg-stone-800/80 rounded-2xl p-6 border border-stone-700/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center">
                    <Wifi className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Fiber Mesh Wi-Fi 6</h3>
                    <p className="text-xs text-stone-400">Direct dedicated studio line</p>
                  </div>
                </div>

                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                  Low Latency
                </span>
              </div>

              {/* Speed Test Display Box */}
              <div className="p-4 bg-stone-950/70 rounded-xl border border-stone-800 my-4">
                <div className="flex items-center justify-between mb-3 text-xs text-stone-400">
                  <span className="flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-amber-400" />
                    <span>Real-Time Speed Test</span>
                  </span>
                  <span className="font-mono text-stone-300">Tulip Dr Studio Node</span>
                </div>

                {/* Progress bar when testing */}
                {testingSpeed && (
                  <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden mb-3">
                    <div
                      className="bg-amber-400 h-full transition-all duration-150"
                      style={{ width: `${speedProgress}%` }}
                    />
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2 text-center py-2">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
                      Download
                    </div>
                    <div className="text-2xl font-mono font-bold text-emerald-400 mt-0.5 tabular-nums">
                      {testingSpeed ? Math.round((downloadSpeed * speedProgress) / 100) : downloadSpeed}
                    </div>
                    <div className="text-[10px] text-stone-500 font-mono">Mbps</div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
                      Upload
                    </div>
                    <div className="text-2xl font-mono font-bold text-sky-400 mt-0.5 tabular-nums">
                      {testingSpeed ? Math.round((uploadSpeed * speedProgress) / 100) : uploadSpeed}
                    </div>
                    <div className="text-[10px] text-stone-500 font-mono">Mbps</div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
                      Ping
                    </div>
                    <div className="text-2xl font-mono font-bold text-amber-400 mt-0.5 tabular-nums">
                      {ping}
                    </div>
                    <div className="text-[10px] text-stone-500 font-mono">ms</div>
                  </div>
                </div>

                {/* Run Test Button */}
                <button
                  onClick={runSpeedTest}
                  disabled={testingSpeed}
                  className="w-full mt-3 py-2 px-3 text-xs font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {testingSpeed ? (
                    <>
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Testing Studio Latency...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-stone-900" />
                      <span>{hasTested ? 'Retest Connection' : 'Run Live Speed Test'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Nomad Peace of Mind */}
            <div className="text-xs text-stone-400 pt-3 border-t border-stone-700/60 space-y-1.5">
              <div className="flex items-center gap-2 text-stone-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Verified 4K video conference stable (tested daily)</span>
              </div>
              <div className="flex items-center gap-2 text-stone-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero bandwidth throttling or guest data caps</span>
              </div>
            </div>
          </div>

          {/* Workstation Specs & Perks (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-stone-800/80 rounded-2xl border border-stone-700/80">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center mb-3">
                <Monitor className="w-4 h-4 text-amber-400" />
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">
                27" 4K IPS External Display
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                Connect seamlessly with provided USB-C and HDMI cables. Charge your MacBook or PC laptop right through the monitor power delivery.
              </p>
            </div>

            <div className="p-5 bg-stone-800/80 rounded-2xl border border-stone-700/80">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center mb-3">
                <Laptop className="w-4 h-4 text-amber-400" />
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">
                Ergonomic Chair & Solid Oak Desk
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                Breathable high-back mesh chair with lumbar adjustment. Spacious natural wood surface with cable grommet and desk pad.
              </p>
            </div>

            <div className="p-5 bg-stone-800/80 rounded-2xl border border-stone-700/80">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center mb-3">
                <VolumeX className="w-4 h-4 text-amber-400" />
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">
                Quiet Tulip Dr Residential Setting
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                Low-traffic coastal avenue with ambient sound below 35 dB. Perfect acoustics for critical client presentations and audio calls.
              </p>
            </div>

            <div className="p-5 bg-stone-800/80 rounded-2xl border border-stone-700/80">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center mb-3">
                <Coffee className="w-4 h-4 text-amber-400" />
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">
                Dedicated Coffee Bar
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                Chemex pour-over, electric gooseneck kettle, and complimentary whole-bean roasts from Virginia Beach local roasters.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
