import React from 'react';
import { NETWORK_CONFIGS, NetworkId } from '../../lib/networkConfig';
import { getExplorerContractUrl } from '../../lib/addressUtils';
import { Shield, ExternalLink, MessageSquareText } from 'lucide-react';

interface FooterProps {
  currentNetwork: NetworkId;
  feedbackUrl?: string;
  xProfileUrl?: string;
}

export const Footer: React.FC<FooterProps> = ({
  currentNetwork,
  feedbackUrl = 'https://forms.gle/SLAxiomFeedback2026',
  xProfileUrl = 'https://x.com/SLAxiomPrivacy',
}) => {
  const previewContract = NETWORK_CONFIGS.preview.contractAddress;
  const preprodContract = NETWORK_CONFIGS.preprod.contractAddress;

  return (
    <footer className="w-full border-t border-slate-200 bg-white/95 mt-16 py-12">
      <div className="max-w-[1440px] w-[95%] mx-auto px-4 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <img src="/logo-shield.svg" alt="SLAxiom" className="w-6 h-6" />
              <span className="font-heading font-extrabold text-base text-slate-900">
                SLA<span className="text-purple-600">xiom</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Confidential contract performance and SLA verification layer powered by Midnight Network zero-knowledge proofs.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <a
                href={feedbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 text-xs text-purple-700 font-medium transition"
              >
                <MessageSquareText className="w-3.5 h-3.5 text-purple-600" />
                <span>Submit Feedback</span>
              </a>
              <a
                href={xProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 font-medium transition"
              >
                <span>Product X</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Col 2: Verified On-Chain Deployments */}
          <div className="space-y-2.5 md:col-span-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
              Verified On-Chain Contract Deployments
            </span>
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-600" />
                    <span className="text-xs font-semibold text-slate-800">Midnight Preprod</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 break-all">
                    {preprodContract}
                  </span>
                </div>
                <a
                  href={getExplorerContractUrl('preprod', preprodContract)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-purple-700 hover:text-purple-900 hover:underline shrink-0 font-medium"
                >
                  <span>Preprod Explorer</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-xs font-semibold text-slate-800">Midnight Preview</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 break-all">
                    {previewContract}
                  </span>
                </div>
                <a
                  href={getExplorerContractUrl('preview', previewContract)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-purple-700 hover:text-purple-900 hover:underline shrink-0 font-medium"
                >
                  <span>Preview Explorer</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Architectural Standard */}
          <div className="space-y-2.5">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
              Zero-Knowledge Verification
            </span>
            <ul className="text-xs text-slate-600 space-y-1.5">
              <li className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-purple-600" />
                <span>Dual-State Execution Model</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-purple-600" />
                <span>Compact 0.5.2 Circuits</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-purple-600" />
                <span>Client-Side Private Witness</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                <span>Plural Endpoint Routing</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>© 2026 SLAxiom. Confidential Contract Verification on Midnight Network.</span>
          <span className="font-mono text-[11px]">
            Active Network: <strong className="text-purple-700 font-bold">{NETWORK_CONFIGS[currentNetwork].name}</strong>
          </span>
        </div>
      </div>
    </footer>
  );
};
